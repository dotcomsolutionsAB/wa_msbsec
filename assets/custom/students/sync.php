<?php
/**
 * Sync students from published Google Sheet CSV into `students` table.
 * Preserves last_message_sent_at by ITS across syncs.
 *
 * Each sheet row is imported as-is (no ITS merging) so multiple due fees
 * for the same student become multiple rows / messages.
 */

declare(strict_types=1);

@ini_set('display_errors', '0');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../connect.php';
require_once __DIR__ . '/../api_googlesheet/sheet_csv.php';

function waJsonFail(string $error, string $detail = '', int $code = 500): void
{
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error' => $error,
        'detail' => $detail,
    ]);
    exit;
}

try {
    try {
        $csvString = fetchCsvString(SHEET_CSV_URL, 25);
        $rows = parseCsv($csvString);
    } catch (Throwable $e) {
        waJsonFail('CSV fetch/parse failed', $e->getMessage());
    }

    if (empty($rows)) {
        waJsonFail('Sheet has no data rows', '', 400);
    }

    $headerMap = indexByHeader($rows[0]);
    $headerError = validateSheetHeaders($headerMap);
    if ($headerError !== null) {
        waJsonFail($headerError, '', 400);
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
        waJsonFail('Failed to clear students table', $db->error);
    }

    $sql = "INSERT INTO `students`
        (`sn`,`name`,`its`,`father_name`,`father_mobile`,`mother_name`,`mother_mobile`,`class`,`section`,`custom_1`,`custom_2`,`custom_3`,`custom_4`,`custom_5`,`synced_at`)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())";

    $stmt = $db->prepare($sql);
    if (!$stmt) {
        waJsonFail('Prepare failed. Run migrations/002_students_table.sql first.', $db->error);
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
        @$db->query("UPDATE `students` SET `last_message_sent_at` = '{$tsEsc}' WHERE `its` = '{$itsEsc}'");
    }

    echo json_encode([
        'success' => true,
        'count' => $inserted,
        'messages' => "Synced {$inserted} students",
    ]);
} catch (Throwable $e) {
    waJsonFail('Sync failed', $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
}
