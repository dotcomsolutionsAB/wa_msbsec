<?php
/**
 * Send Meta WA template: fee_reminder
 *
 * Modes:
 * - test: one student_id + phone (+ optional parent role)
 * - bulk: student_ids[] → father + mother mobiles when present
 */

declare(strict_types=1);

header('Content-Type: application/json');
session_start();

require_once __DIR__ . '/../connect.php';
require_once __DIR__ . '/meta_client.php';

$mode = isset($_REQUEST['mode']) ? trim((string) $_REQUEST['mode']) : 'bulk';
$templateName = 'fee_reminder';
$langCode = 'en';

try {
    $config = waLoadMetaConfig($db);
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}

function loadStudent(mysqli $db, int $id): ?array
{
    $id = (int) $id;
    $res = $db->query("SELECT * FROM `students` WHERE `id` = {$id} LIMIT 1");
    if (!$res) {
        return null;
    }
    $row = $res->fetch_assoc();
    return $row ?: null;
}

function markStudentMessageSent(mysqli $db, int $id): void
{
    $id = (int) $id;
    $db->query("UPDATE `students` SET `last_message_sent_at` = NOW() WHERE `id` = {$id}");
}

$results = [];
$sent = 0;
$failed = 0;

if ($mode === 'test') {
    $studentId = isset($_REQUEST['student_id']) ? (int) $_REQUEST['student_id'] : 0;
    $phone = isset($_REQUEST['phone']) ? trim((string) $_REQUEST['phone']) : '';
    $parentRole = isset($_REQUEST['parent_role']) ? trim((string) $_REQUEST['parent_role']) : 'father';

    $student = loadStudent($db, $studentId);
    if (!$student) {
        echo json_encode(['success' => false, 'error' => 'Student not found']);
        exit;
    }

    $to = waNormalizeMobile($phone);
    if ($to === '') {
        echo json_encode(['success' => false, 'error' => 'Invalid phone number']);
        exit;
    }

    $parentName = $parentRole === 'mother'
        ? (string) ($student['mother_name'] ?? '')
        : (string) ($student['father_name'] ?? '');

    if (trim($parentName) === '') {
        $parentName = $parentRole === 'mother' ? 'Mother' : 'Father';
    }

    $params = waFeeReminderParams($student, $parentName);
    $res = waSendTemplateMessage($config, $to, $templateName, $langCode, $params);

    if ($res['ok']) {
        $sent++;
        markStudentMessageSent($db, $studentId);
    } else {
        $failed++;
    }

    $results[] = [
        'student_id' => $studentId,
        'name' => $student['name'],
        'to' => $to,
        'parent_role' => $parentRole,
        'ok' => $res['ok'],
        'message_id' => $res['message_id'],
        'error' => $res['error'],
        'http_code' => $res['http_code'],
    ];
} else {
    $idsRaw = $_REQUEST['student_ids'] ?? [];
    if (is_string($idsRaw)) {
        $idsRaw = array_filter(array_map('trim', explode(',', $idsRaw)));
    }
    if (!is_array($idsRaw) || empty($idsRaw)) {
        echo json_encode(['success' => false, 'error' => 'No students selected']);
        exit;
    }

    $ids = array_values(array_unique(array_map('intval', $idsRaw)));

    foreach ($ids as $studentId) {
        if ($studentId <= 0) {
            continue;
        }
        $student = loadStudent($db, $studentId);
        if (!$student) {
            $failed++;
            $results[] = [
                'student_id' => $studentId,
                'ok' => false,
                'error' => 'Student not found',
            ];
            continue;
        }

        $targets = [
            ['role' => 'father', 'name' => $student['father_name'], 'mobile' => $student['father_mobile']],
            ['role' => 'mother', 'name' => $student['mother_name'], 'mobile' => $student['mother_mobile']],
        ];

        $anyForStudent = false;
        foreach ($targets as $target) {
            $to = waNormalizeMobile((string) $target['mobile']);
            if ($to === '') {
                continue;
            }
            $anyForStudent = true;
            $parentName = trim((string) $target['name']);
            if ($parentName === '') {
                $parentName = $target['role'] === 'mother' ? 'Mother' : 'Father';
            }

            $params = waFeeReminderParams($student, $parentName);
            $res = waSendTemplateMessage($config, $to, $templateName, $langCode, $params);

            if ($res['ok']) {
                $sent++;
                markStudentMessageSent($db, $studentId);
            } else {
                $failed++;
            }

            $results[] = [
                'student_id' => $studentId,
                'name' => $student['name'],
                'to' => $to,
                'parent_role' => $target['role'],
                'ok' => $res['ok'],
                'message_id' => $res['message_id'],
                'error' => $res['error'],
                'http_code' => $res['http_code'],
            ];
        }

        if (!$anyForStudent) {
            $failed++;
            $results[] = [
                'student_id' => $studentId,
                'name' => $student['name'],
                'ok' => false,
                'error' => 'No valid father/mother mobile',
            ];
        }
    }
}

echo json_encode([
    'success' => $failed === 0 && $sent > 0,
    'sent' => $sent,
    'failed' => $failed,
    'results' => $results,
    'messages' => "Sent {$sent}, failed {$failed}",
]);
