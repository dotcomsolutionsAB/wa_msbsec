<?php
/**
 * Sync students from published Google Sheet CSV into `students` table.
 * Preserves last_message_sent_at by ITS across syncs.
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
foreach ($rows as $r) {
    $sn = sheetGet($r, $headerMap, 'SN');
    $name = sheetGet($r, $headerMap, 'Name');
    $its = sheetGet($r, $headerMap, 'ITS');
    $fatherName = sheetGet($r, $headerMap, 'Father Name');
    $fatherMobile = sheetGet($r, $headerMap, 'Father Mobile');
    $motherName = sheetGet($r, $headerMap, 'Mother Name');
    $motherMobile = sheetGet($r, $headerMap, 'Mother Mobile');
    $class = sheetGet($r, $headerMap, 'Class');
    $section = sheetGet($r, $headerMap, 'Section');
    $c1 = sheetGet($r, $headerMap, 'Custom 1');
    $c2 = sheetGet($r, $headerMap, 'Custom 2');
    $c3 = sheetGet($r, $headerMap, 'Custom 3');
    $c4 = sheetGet($r, $headerMap, 'Custom 4');
    $c5 = sheetGet($r, $headerMap, 'Custom 5');

    if ($name === '' && $its === '' && $fatherMobile === '' && $motherMobile === '') {
        continue;
    }

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
    }
}

$stmt->close();

foreach ($lastSentByIts as $itsKey => $ts) {
    $itsEsc = $db->real_escape_string((string) $itsKey);
    $tsEsc = $db->real_escape_string((string) $ts);
    $db->query("UPDATE `students` SET `last_message_sent_at` = '{$tsEsc}' WHERE `its` = '{$itsEsc}'");
}

echo json_encode([
    'success' => true,
    'count'   => $inserted,
    'messages'=> "Synced {$inserted} students",
]);
