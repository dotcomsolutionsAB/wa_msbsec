<?php
// ini_set("display_errors",1);
session_start();
require_once __DIR__ . '/../connect.php';

/**
 * Debug UI + File logger
 */
$DEBUG_UI   = true;   // show logs on page
$DEBUG_FILE = true;   // also log into file
$LOG_FILE   = __DIR__ . '/wa_debug.log';

if ($DEBUG_UI) {
    echo '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">';
    echo '<title>WA Queue Debug</title>';
    echo '<style>
        body{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace; background:#0b1220; color:#e5e7eb; padding:16px;}
        .card{background:#0f172a; border:1px solid #1f2937; border-radius:12px; padding:14px; margin:12px 0;}
        .ok{color:#34d399;} .bad{color:#fb7185;} .muted{color:#94a3b8;}
        pre{white-space:pre-wrap; word-break:break-word; background:#0b1220; border:1px dashed #334155; padding:10px; border-radius:10px; margin-top:10px;}
        .title{font-weight:700; font-size:16px;}
        .row{margin:4px 0;}
    </style></head><body>';
    echo '<div class="card"><div class="title">WhatsApp Queue Debug</div><div class="row muted">Started: '.date('Y-m-d H:i:s').'</div></div>';
}

function log_line($label, $value = '', $type = 'info', $DEBUG_UI = true, $DEBUG_FILE = false, $LOG_FILE = '') {
    $ts = date('Y-m-d H:i:s');
    $line = "[$ts] $label" . ($value !== '' ? " : $value" : "");

    if ($DEBUG_FILE && $LOG_FILE) {
        @file_put_contents($LOG_FILE, $line.PHP_EOL, FILE_APPEND);
    }

    if ($DEBUG_UI) {
        $cls = ($type === 'ok') ? 'ok' : (($type === 'bad') ? 'bad' : 'muted');
        echo '<div class="row '.$cls.'"><strong>'.htmlspecialchars($label).'</strong>'
           . ($value !== '' ? ' : '.htmlspecialchars($value) : '')
           . '</div>';
        @ob_flush(); @flush();
    }
}

function mask_secret($s) {
    if (!$s) return '';
    $len = strlen($s);
    if ($len <= 6) return str_repeat('*', $len);
    return substr($s, 0, 3) . str_repeat('*', $len - 6) . substr($s, -3);
}

// Fetch WhatsApp config
$sql_fetch   = "SELECT * FROM whatsapp LIMIT 1";
$query_fetch = $db->query($sql_fetch);
$row_fetch   = $query_fetch ? $query_fetch->fetch_assoc() : null;

if (!$row_fetch) {
    if ($DEBUG_UI) echo '<div class="card">';
    log_line('Config ERROR', 'No row found in whatsapp table', 'bad', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);
    if ($DEBUG_UI) { echo '</div></body></html>'; }
    exit;
}

$secret  = $row_fetch['secret'];
$account = isset($row_fetch['account']) && $row_fetch['account'] !== '' ? $row_fetch['account'] : $row_fetch['instance_id'];

$base_from_db = trim($row_fetch['url']);
if ($base_from_db === '') { $base_from_db = 'https://dash.woonotif.com'; }
$apiEndpoint = rtrim($base_from_db, '/') . '/api/send/whatsapp';

if ($DEBUG_UI) echo '<div class="card">';
log_line('Endpoint', $apiEndpoint, 'info', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);
if ($DEBUG_UI) echo '</div>';

$sql   = "SELECT * FROM `wa_messages` ORDER BY `priority` DESC, `id`";
$query = $db->query($sql);

    if (!$query) {
        if ($DEBUG_UI) echo '<div class="card">';
        log_line('DB ERROR', $db->error, 'bad', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);
        if ($DEBUG_UI) { echo '</div></body></html>'; }
        exit;
    }

    if ($DEBUG_UI) echo '<div class="card">';
    log_line('Messages Picked', (string)$query->num_rows, $query->num_rows ? 'ok' : 'bad', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);
    if ($DEBUG_UI) echo '</div>';

    /**
     * Helper to send request to Woonotif + return debug info
     */
    $sendToWoonotif = function(array $fields) use ($apiEndpoint) {
        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_URL            => $apiEndpoint,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING       => '',
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST  => 'POST',
            CURLOPT_POSTFIELDS     => $fields,
            CURLOPT_HTTPHEADER     => [
                'Accept: application/json',
            ],
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_SSL_VERIFYPEER => false,
        ]);

        $response = curl_exec($ch);
        $err      = curl_error($ch);
        $errno    = curl_errno($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);

        return [
            'ok'       => ($errno === 0),
            'errno'    => $errno,
            'error'    => $err,
            'httpCode' => $httpCode,
            'response' => $response,
        ];
    };

    while ($row = $query->fetch_assoc()) {

        $messege_id = $row['id'];
        $mob        = $row['mobile'];
        $message    = $row['message'];
        $url        = $row['url'];
        $pdf        = $row['pdf'];
        $priority   = isset($row['priority']) && $row['priority'] !== '' ? (int)$row['priority'] : 2;

        if (strlen($mob) == 10) { $mob = '91' . $mob; }

        if ($DEBUG_UI) echo '<div class="card">';
        log_line('Processing ID', (string)$messege_id, 'info', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);
        log_line('Recipient', $mob, 'info', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);

        // Decide type
        $sendType = '';
        if ($message !== '') $sendType = 'text';
        elseif ($url !== '') $sendType = 'media:image';
        elseif ($pdf !== '') $sendType = 'media:pdf';
        else $sendType = 'empty';

        log_line('Type', $sendType, $sendType !== 'empty' ? 'ok' : 'bad', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);

        // 1) TEXT MESSAGE
        if ($message != '') {
            $fields = [
                'secret'    => $secret,
                'account'   => $account,
                'recipient' => $mob,
                'message'   => $message,
                'type'      => 'text',
                'priority'  => (string) $priority,
                'shortener' => '0',
            ];

            // Log payload (masked secret)
            $fields_for_log = $fields;
            $fields_for_log['secret'] = mask_secret($fields_for_log['secret']);

            log_line('Request Sent', 'YES (text)', 'ok', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);
            if ($DEBUG_UI) echo '<pre>'.htmlspecialchars(json_encode($fields_for_log, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)).'</pre>';

            $res = $sendToWoonotif($fields);

            log_line('HTTP Code', (string)$res['httpCode'], ($res['httpCode'] >= 200 && $res['httpCode'] < 300) ? 'ok' : 'bad', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);
            if (!$res['ok']) log_line('cURL Error', $res['errno'].' '.$res['error'], 'bad', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);

            if ($DEBUG_UI) echo '<pre>'.htmlspecialchars((string)$res['response']).'</pre>';

            $db->query("DELETE FROM `wa_messages` WHERE `id` = '". $db->real_escape_string($messege_id) ."'");
            log_line('Deleted From Queue', 'YES', 'ok', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);

            if ($DEBUG_UI) echo '</div>';
            continue;
        }

        // 2) IMAGE / MEDIA URL
        if ($url != '') {
            $fields = [
                'secret'     => $secret,
                'account'    => $account,
                'recipient'  => $mob,
                'message'    => '',
                'type'       => 'media',
                'priority'   => (string) $priority,
                'media_url'  => $url,
                'media_type' => 'image',
                'shortener'  => '0',
            ];

            $fields_for_log = $fields;
            $fields_for_log['secret'] = mask_secret($fields_for_log['secret']);

            log_line('Request Sent', 'YES (media:image)', 'ok', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);
            if ($DEBUG_UI) echo '<pre>'.htmlspecialchars(json_encode($fields_for_log, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)).'</pre>';

            $res = $sendToWoonotif($fields);

            log_line('HTTP Code', (string)$res['httpCode'], ($res['httpCode'] >= 200 && $res['httpCode'] < 300) ? 'ok' : 'bad', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);
            if (!$res['ok']) log_line('cURL Error', $res['errno'].' '.$res['error'], 'bad', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);

            if ($DEBUG_UI) echo '<pre>'.htmlspecialchars((string)$res['response']).'</pre>';

            $db->query("DELETE FROM `wa_messages` WHERE `id` = '". $db->real_escape_string($messege_id) ."'");
            log_line('Deleted From Queue', 'YES', 'ok', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);

            if ($DEBUG_UI) echo '</div>';
            continue;
        }

        // 3) PDF / DOCUMENT URL
        if ($pdf != '') {
            $fields = [
                'secret'        => $secret,
                'account'       => $account,
                'recipient'     => $mob,
                'message'       => '',
                'type'          => 'media',
                'priority'      => (string) $priority,
                'document_url'  => $pdf,
                'document_name' => 'file.pdf',
                'document_type' => 'pdf',
                'shortener'     => '0',
            ];

            $fields_for_log = $fields;
            $fields_for_log['secret'] = mask_secret($fields_for_log['secret']);

            log_line('Request Sent', 'YES (media:pdf)', 'ok', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);
            if ($DEBUG_UI) echo '<pre>'.htmlspecialchars(json_encode($fields_for_log, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)).'</pre>';

            $res = $sendToWoonotif($fields);

            log_line('HTTP Code', (string)$res['httpCode'], ($res['httpCode'] >= 200 && $res['httpCode'] < 300) ? 'ok' : 'bad', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);
            if (!$res['ok']) log_line('cURL Error', $res['errno'].' '.$res['error'], 'bad', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);

            if ($DEBUG_UI) echo '<pre>'.htmlspecialchars((string)$res['response']).'</pre>';

            $db->query("DELETE FROM `wa_messages` WHERE `id` = '". $db->real_escape_string($messege_id) ."'");
            log_line('Deleted From Queue', 'YES', 'ok', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);

            if ($DEBUG_UI) echo '</div>';
            continue;
        }

        // If none exists, delete so queue doesn't get stuck
        log_line('Nothing to send', 'Deleting empty row', 'bad', $DEBUG_UI, $DEBUG_FILE, $LOG_FILE);
        $db->query("DELETE FROM `wa_messages` WHERE `id` = '". $db->real_escape_string($messege_id) ."'");

        if ($DEBUG_UI) echo '</div>';
    }

if ($DEBUG_UI) {
    echo '<div class="card"><div class="row muted">Finished: '.date('Y-m-d H:i:s').'</div></div>';
    echo '</body></html>';
}
?>