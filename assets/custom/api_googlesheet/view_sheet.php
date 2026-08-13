<?php
/**
 * view_sheet.php
 * Reads rows from a published Google Sheet CSV URL and inserts WhatsApp messages into `wa_messages`.
 * No Google SDK. No Guzzle. Pure CSV fetch + parse.
 */

declare(strict_types=1);

//ini_set('display_errors', '1');
header('Content-Type: application/json');

// ----------------------- BOOTSTRAP -----------------------
require '../../vendor/autoload.php'; // keep if you rely on it elsewhere; harmless if unused
require_once '../php_replace_improper.php';
require_once '../connect.php';

// ----------------------- CONFIG --------------------------
$CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS7R08j3SowAO79MVH9zGnivm2jkDFphOu1x_s90Ees3g7-toN3UYH7sqe_kOVzb26n62OEzXGGdg0N/pub?output=csv';

// ----------------------- INPUTS --------------------------
$waTemplate = isset($_REQUEST['wa_message']) ? (string) $_REQUEST['wa_message'] : '';
if ($waTemplate === '') {
    echo json_encode(['success' => false, 'error' => "Missing required 'wa_message'"]);
    exit;
}

$edit_message_id = $_REQUEST['edit_message_id'] ?? null;
$nextID          = $_REQUEST['nextID']          ?? null;
$fileCount       = isset($_REQUEST['count']) ? (int) $_REQUEST['count'] : 0;

// ----------------------- DB: NEXT ID ---------------------
if (!$nextID || $nextID === 'undefined') {
    $sql   = "SHOW TABLE STATUS LIKE 'wa_messages'";
    $query = $db->query($sql);
    if (!$query) {
        echo json_encode(['success' => false, 'error' => 'DB error fetching table status', 'detail' => $db->error]);
        exit;
    }
    $row    = $query->fetch_assoc();
    $nextID = (string) $row['Auto_increment'];
}

// ----------------------- CSV FETCH -----------------------
/**
 * Fetch CSV via streams (no curl). If allow_url_fopen is disabled, fallback to curl.
 */
function fetchCsvString(string $url, int $timeout = 20): string {
    // Try file_get_contents with timeout
    $ctx = stream_context_create([
        'http' => [
            'method'  => 'GET',
            'timeout' => $timeout,
            'header'  => "User-Agent: PHP-CVS-Fetch\r\n",
        ],
        'https' => [
            'method'  => 'GET',
            'timeout' => $timeout,
            'header'  => "User-Agent: PHP-CVS-Fetch\r\n",
        ]
    ]);
    $data = @file_get_contents($url, false, $ctx);
    if ($data !== false) return $data;

    // Fallback to curl if available
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS      => 5,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_USERAGENT      => 'PHP-CVS-Fetch',
        ]);
        $data = curl_exec($ch);
        $err  = curl_error($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($data !== false && $code >= 200 && $code < 400) {
            return $data;
        }
        throw new RuntimeException("CSV fetch failed via curl: HTTP $code, $err");
    }

    throw new RuntimeException("CSV fetch failed: allow_url_fopen disabled and curl unavailable");
}

/**
 * Parse CSV string into array of associative rows using the first row as headers.
 * Header matching is case-insensitive and trimmed.
 */
function parseCsv(string $csv): array {
    // Remove UTF-8 BOM if present
    if (substr($csv, 0, 3) === "\xEF\xBB\xBF") {
        $csv = substr($csv, 3);
    }

    $fh = fopen('php://temp', 'r+');
    fwrite($fh, $csv);
    rewind($fh);

    $rows = [];
    $headers = [];
    $line = 0;
    while (($data = fgetcsv($fh)) !== false) {
        $line++;
        // Skip empty lines
        if ($data === [null] || (count($data) === 1 && trim((string)$data[0]) === '')) {
            continue;
        }
        if (empty($headers)) {
            // Normalize headers: trim + collapse spaces
            foreach ($data as $h) {
                $headers[] = preg_replace('/\s+/', ' ', trim((string)$h));
            }
            continue;
        }
        // Build associative row with normalized keys
        $rowAssoc = [];
        foreach ($headers as $i => $key) {
            $rowAssoc[$key] = isset($data[$i]) ? trim((string)$data[$i]) : '';
        }
        $rows[] = $rowAssoc;
    }
    fclose($fh);
    return $rows;
}

try {
    $csvString = fetchCsvString($CSV_URL, 25);
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

// ----------------------- HEADER MAP ----------------------
/**
 * Create a case-insensitive mapping so we can access columns by the exact names you provided.
 */
function indexByHeader(array $row): array {
    $map = [];
    foreach ($row as $k => $v) {
        $map[strtolower($k)] = $k; // store original casing
    }
    return $map;
}

$headerMap = !empty($rows) ? indexByHeader($rows[0]) : []; // built from first row's keys
$need = [
    'sn','name','its','father name','father mobile','mother name','mother mobile',
    'class','section','custom 1','custom 2','custom 3','custom 4','custom 5'
];

// Validate required headers exist (case-insensitive)
foreach ($need as $h) {
    if (!isset($headerMap[$h])) {
        echo json_encode([
            'success' => false,
            'error'   => "Missing column in CSV: '$h'",
        ]);
        exit;
    }
}

// ----------------------- FILES (images / pdfs) -----------
$mydir   = '../../uploads/files/';
$baseUrl = 'https://wa.anjumanequtbimsbsecunderabad.com/assets/uploads/files/';

/**
 * Returns two arrays: [$images, $pdfs]
 */
function collectMessageFiles(string $nextID, int $fileCount, string $dir, string $baseUrl): array
{
    $images = [];
    $pdfs   = [];

    if ($fileCount <= 0 || !is_dir($dir)) {
        return [$images, $pdfs];
    }

    $filesInDir = scandir($dir);
    if (!$filesInDir) {
        return [$images, $pdfs];
    }

    for ($i = 1; $i <= $fileCount; $i++) {
        $basename = $nextID . '_' . $i . '_file';

        // quick check common extensions
        $candidates = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'];
        $found = false;

        foreach ($candidates as $ext) {
            $fullPath = rtrim($dir, '/\\') . '/' . $basename . '.' . $ext;
            if (file_exists($fullPath)) {
                $url = rtrim($baseUrl, '/').'/'.$basename.'.'.$ext;
                if ($ext === 'pdf') {
                    $pdfs[] = $url;
                } else {
                    $images[] = $url;
                }
                $found = true;
                break;
            }
        }

        if (!$found) {
            foreach ($filesInDir as $f) {
                if ($f === '.' || $f === '..') continue;
                $path = rtrim($dir, '/\\') . '/' . $f;
                if (!is_file($path)) continue;

                $ext      = strtolower(pathinfo($path, PATHINFO_EXTENSION));
                $filename = pathinfo($path, PATHINFO_FILENAME);

                if ($filename === $basename && $ext !== '') {
                    $url = rtrim($baseUrl, '/').'/'.$basename.'.'.$ext;
                    if ($ext === 'pdf') $pdfs[] = $url; else $images[] = $url;
                    break;
                }
            }
        }
    }

    return [$images, $pdfs];
}

[$files_arr, $files_pdf_arr] = collectMessageFiles($nextID, $fileCount, $mydir, $baseUrl);

// ----------------------- DB INSERT HELPERS ----------------
function insertText(mysqli $db, string $messageId, string $mobile, string $message): void {
    $sql = "INSERT INTO wa_messages (`message_id`,`mobile`,`message`) VALUES (?,?,?)";
    $stmt = $db->prepare($sql);
    if ($stmt) {
        $stmt->bind_param('sss', $messageId, $mobile, $message);
        $stmt->execute();
        $stmt->close();
    }
}

function insertUrl(mysqli $db, string $messageId, string $mobile, string $url): void {
    $sql = "INSERT INTO wa_messages (`message_id`,`mobile`,`message`,`url`) VALUES (?,?,?,?)";
    $empty = '';
    $stmt = $db->prepare($sql);
    if ($stmt) {
        $stmt->bind_param('ssss', $messageId, $mobile, $empty, $url);
        $stmt->execute();
        $stmt->close();
    }
}

function insertPdf(mysqli $db, string $messageId, string $mobile, string $pdf): void {
    $sql = "INSERT INTO wa_messages (`message_id`,`mobile`,`message`,`pdf`) VALUES (?,?,?,?)";
    $empty = '';
    $stmt = $db->prepare($sql);
    if ($stmt) {
        $stmt->bind_param('ssss', $messageId, $mobile, $empty, $pdf);
        $stmt->execute();
        $stmt->close();
    }
}

// ----------------------- MAIN LOOP -----------------------
/**
 * Helper to get by logical column name (case-insensitive)
 */
$get = function(array $r, array $hmap, string $key): string {
    $lk = strtolower($key);
    $ok = $hmap[$lk];
    return isset($r[$ok]) ? trim((string)$r[$ok]) : '';
};

foreach ($rows as $r) {
    // Build message with placeholders from the template
    $message = addslashes($waTemplate);

    $message = str_replace('{child_name}', $get($r, $headerMap, 'Name'),        $message);
    $message = str_replace('{its}',        $get($r, $headerMap, 'ITS'),         $message);
    $message = str_replace('{class}',      $get($r, $headerMap, 'Class'),       $message);
    $message = str_replace('{section}',    $get($r, $headerMap, 'Section'),     $message);
    $message = str_replace('{custom_1}',   $get($r, $headerMap, 'Custom 1'),    $message);
    $message = str_replace('{custom_2}',   $get($r, $headerMap, 'Custom 2'),    $message);
    $message = str_replace('{custom_3}',   $get($r, $headerMap, 'Custom 3'),    $message);
    $message = str_replace('{custom_4}',   $get($r, $headerMap, 'Custom 4'),    $message);
    $message = str_replace('{custom_5}',   $get($r, $headerMap, 'Custom 5'),    $message);

    $originalMsg = $message;

    // Father
    $fatherMobile = $get($r, $headerMap, 'Father Mobile');
    if ($fatherMobile !== '') {
        $msg1 = str_replace('{name}', $get($r, $headerMap, 'Father Name'), $message);
        insertText($db, $nextID, $fatherMobile, $msg1);

        foreach ($files_arr as $file)    insertUrl($db, $nextID, $fatherMobile, $file);
        foreach ($files_pdf_arr as $pdf) insertPdf($db, $nextID, $fatherMobile, $pdf);
    }

    // Mother
    $motherMobile = $get($r, $headerMap, 'Mother Mobile');
    if ($motherMobile !== '') {
        $msg2 = str_replace('{name}', $get($r, $headerMap, 'Mother Name'), $originalMsg);
        insertText($db, $nextID, $motherMobile, $msg2);

        foreach ($files_arr as $file)    insertUrl($db, $nextID, $motherMobile, $file);
        foreach ($files_pdf_arr as $pdf) insertPdf($db, $nextID, $motherMobile, $pdf);
    }
}

// ----------------------- DONE ----------------------------
echo json_encode(['success' => true]);
?>