<?php
/**
 * Sync students from published Google Sheet CSV into `students` table.
 * Preserves last_message_sent_at by ITS across syncs.
 *
 * Duplicate ITS rows are merged:
 * - custom_1: concatenated with ", "
 * - custom_2: summed (amount)
 * - custom_3: taken from the last row in the group
 */

declare(strict_types=1);

header('Content-Type: application/json');

require_once __DIR__ . '/../connect.php';
require_once __DIR__ . '/../api_googlesheet/sheet_csv.php';

try {
    $csvString = fetchCsvString(SHEET_CSV_URL, 25);
    $rows = parseCsv($csvString);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'CSV fetch/parse failed',
        'detail'  => $e->getMessage(),
    ]);
    exit;
}

if (empty($rows)) {
    echo json_encode(['success' => false, 'error' => 'Sheet has no data rows']);
    exit;
}

$headerMap = indexByHeader($rows[0]);
$headerError = validateSheetHeaders($headerMap);
if ($headerError !== null) {
    echo json_encode(['success' => false, 'error' => $headerError]);
    exit;
}

/**
 * Parse amount from Custom 2 (supports "7200", "7,200", "7200.50").
 */
function parseAmount(string $raw): float
{
    $cleaned = preg_replace('/[^\d.\-]/', '', $raw);
    if ($cleaned === null || $cleaned === '' || $cleaned === '-' || $cleaned === '.') {
        return 0.0;
    }
    return (float) $cleaned;
}

/**
 * Format summed amount without unnecessary trailing zeros.
 */
function formatAmount(float $amount): string
{
    if (abs($amount - round($amount)) < 0.00001) {
        return (string) (int) round($amount);
    }
    return rtrim(rtrim(number_format($amount, 2, '.', ''), '0'), '.');
}

// Normalize sheet rows in order
$normalized = [];
foreach ($rows as $r) {
    $name = sheetGet($r, $headerMap, 'Name');
    $its = sheetGet($r, $headerMap, 'ITS');
    $fatherMobile = sheetGet($r, $headerMap, 'Father Mobile');
    $motherMobile = sheetGet($r, $headerMap, 'Mother Mobile');

    if ($name === '' && $its === '' && $fatherMobile === '' && $motherMobile === '') {
        continue;
    }

    $normalized[] = [
        'sn' => sheetGet($r, $headerMap, 'SN'),
        'name' => $name,
        'its' => $its,
        'father_name' => sheetGet($r, $headerMap, 'Father Name'),
        'father_mobile' => $fatherMobile,
        'mother_name' => sheetGet($r, $headerMap, 'Mother Name'),
        'mother_mobile' => $motherMobile,
        'class' => sheetGet($r, $headerMap, 'Class'),
        'section' => sheetGet($r, $headerMap, 'Section'),
        'custom_1' => sheetGet($r, $headerMap, 'Custom 1'),
        'custom_2' => sheetGet($r, $headerMap, 'Custom 2'),
        'custom_3' => sheetGet($r, $headerMap, 'Custom 3'),
        'custom_4' => sheetGet($r, $headerMap, 'Custom 4'),
        'custom_5' => sheetGet($r, $headerMap, 'Custom 5'),
    ];
}

// Merge rows that share the same ITS (sheet order preserved)
$merged = [];
$mergedWithoutIts = [];

foreach ($normalized as $row) {
    $itsKey = trim((string) $row['its']);

    // No ITS → keep as individual rows
    if ($itsKey === '') {
        $mergedWithoutIts[] = $row;
        continue;
    }

    if (!isset($merged[$itsKey])) {
        $merged[$itsKey] = $row;
        $merged[$itsKey]['_c1'] = [];
        $merged[$itsKey]['_sum'] = 0.0;

        if ($row['custom_1'] !== '') {
            $merged[$itsKey]['_c1'][] = $row['custom_1'];
        }
        $merged[$itsKey]['_sum'] += parseAmount($row['custom_2']);
        continue;
    }

    // Same ITS: accumulate custom_1 / custom_2, refresh custom_3 from this (later) row
    if ($row['custom_1'] !== '') {
        $merged[$itsKey]['_c1'][] = $row['custom_1'];
    }
    $merged[$itsKey]['_sum'] += parseAmount($row['custom_2']);
    $merged[$itsKey]['custom_3'] = $row['custom_3'];

    // Prefer non-empty identity fields if the first row was sparse
    foreach (['name', 'father_name', 'father_mobile', 'mother_name', 'mother_mobile', 'class', 'section', 'custom_4', 'custom_5'] as $field) {
        if ($merged[$itsKey][$field] === '' && $row[$field] !== '') {
            $merged[$itsKey][$field] = $row[$field];
        }
    }
}

$finalRows = [];
foreach ($merged as $row) {
    $c1Parts = array_values(array_unique($row['_c1']));
    $row['custom_1'] = implode(', ', $c1Parts);
    $row['custom_2'] = formatAmount((float) $row['_sum']);
    unset($row['_c1'], $row['_sum']);
    $finalRows[] = $row;
}
foreach ($mergedWithoutIts as $row) {
    $finalRows[] = $row;
}

// Preserve send timestamps by ITS before rebuild
$lastSentByIts = [];
$preserveRes = @$db->query("SELECT `its`, `last_message_sent_at` FROM `students` WHERE `its` <> '' AND `last_message_sent_at` IS NOT NULL");
if ($preserveRes) {
    while ($p = $preserveRes->fetch_assoc()) {
        $lastSentByIts[(string) $p['its']] = $p['last_message_sent_at'];
    }
}

if (!$db->query('TRUNCATE TABLE `students`')) {
    echo json_encode(['success' => false, 'error' => 'Failed to clear students table', 'detail' => $db->error]);
    exit;
}

$sql = "INSERT INTO `students`
    (`sn`,`name`,`its`,`father_name`,`father_mobile`,`mother_name`,`mother_mobile`,`class`,`section`,`custom_1`,`custom_2`,`custom_3`,`custom_4`,`custom_5`,`synced_at`)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())";

$stmt = $db->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Prepare failed. Run migrations/002_students_table.sql first.', 'detail' => $db->error]);
    exit;
}

$inserted = 0;
$mergedGroups = 0;
foreach ($finalRows as $row) {
    $sn = $row['sn'];
    $name = $row['name'];
    $its = $row['its'];
    $fatherName = $row['father_name'];
    $fatherMobile = $row['father_mobile'];
    $motherName = $row['mother_name'];
    $motherMobile = $row['mother_mobile'];
    $class = $row['class'];
    $section = $row['section'];
    $c1 = $row['custom_1'];
    $c2 = $row['custom_2'];
    $c3 = $row['custom_3'];
    $c4 = $row['custom_4'];
    $c5 = $row['custom_5'];

    $stmt->bind_param(
        'ssssssssssssss',
        $sn,
        $name,
        $its,
        $fatherName,
        $fatherMobile,
        $motherName,
        $motherMobile,
        $class,
        $section,
        $c1,
        $c2,
        $c3,
        $c4,
        $c5
    );

    if ($stmt->execute()) {
        $inserted++;
        if (strpos($c1, ', ') !== false) {
            $mergedGroups++;
        }
    }
}

$stmt->close();

foreach ($lastSentByIts as $itsKey => $ts) {
    $itsEsc = $db->real_escape_string((string) $itsKey);
    $tsEsc = $db->real_escape_string((string) $ts);
    $db->query("UPDATE `students` SET `last_message_sent_at` = '{$tsEsc}' WHERE `its` = '{$itsEsc}'");
}

$sheetCount = count($normalized);
echo json_encode([
    'success' => true,
    'count'   => $inserted,
    'sheet_rows' => $sheetCount,
    'merged_groups' => $mergedGroups,
    'messages'=> "Synced {$inserted} students from {$sheetCount} sheet rows",
]);
