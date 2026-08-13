<?php
/**
 * Shared Google Sheet CSV helpers (published CSV URL).
 */

declare(strict_types=1);

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS7R08j3SowAO79MVH9zGnivm2jkDFphOu1x_s90Ees3g7-toN3UYH7sqe_kOVzb26n62OEzXGGdg0N/pub?output=csv';

const SHEET_REQUIRED_HEADERS = [
    'sn', 'name', 'its', 'father name', 'father mobile', 'mother name', 'mother mobile',
    'class', 'section', 'custom 1', 'custom 2', 'custom 3', 'custom 4', 'custom 5',
];

function fetchCsvString(string $url, int $timeout = 25): string
{
    $ctx = stream_context_create([
        'http' => [
            'method'  => 'GET',
            'timeout' => $timeout,
            'header'  => "User-Agent: PHP-CSV-Fetch\r\n",
        ],
        'https' => [
            'method'  => 'GET',
            'timeout' => $timeout,
            'header'  => "User-Agent: PHP-CSV-Fetch\r\n",
        ],
    ]);
    $data = @file_get_contents($url, false, $ctx);
    if ($data !== false) {
        return $data;
    }

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS      => 5,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_USERAGENT      => 'PHP-CSV-Fetch',
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

    throw new RuntimeException('CSV fetch failed: allow_url_fopen disabled and curl unavailable');
}

function parseCsv(string $csv): array
{
    if (substr($csv, 0, 3) === "\xEF\xBB\xBF") {
        $csv = substr($csv, 3);
    }

    $fh = fopen('php://temp', 'r+');
    fwrite($fh, $csv);
    rewind($fh);

    $rows = [];
    $headers = [];
    while (($data = fgetcsv($fh)) !== false) {
        if ($data === [null] || (count($data) === 1 && trim((string) $data[0]) === '')) {
            continue;
        }
        if (empty($headers)) {
            foreach ($data as $h) {
                $headers[] = preg_replace('/\s+/', ' ', trim((string) $h));
            }
            continue;
        }
        $rowAssoc = [];
        foreach ($headers as $i => $key) {
            $rowAssoc[$key] = isset($data[$i]) ? trim((string) $data[$i]) : '';
        }
        $rows[] = $rowAssoc;
    }
    fclose($fh);

    return $rows;
}

function indexByHeader(array $row): array
{
    $map = [];
    foreach ($row as $k => $v) {
        $map[strtolower($k)] = $k;
    }
    return $map;
}

function sheetGet(array $row, array $headerMap, string $key): string
{
    $lk = strtolower($key);
    if (!isset($headerMap[$lk])) {
        return '';
    }
    $ok = $headerMap[$lk];
    return isset($row[$ok]) ? trim((string) $row[$ok]) : '';
}

function validateSheetHeaders(array $headerMap): ?string
{
    foreach (SHEET_REQUIRED_HEADERS as $h) {
        if (!isset($headerMap[$h])) {
            return "Missing column in CSV: '$h'";
        }
    }
    return null;
}
