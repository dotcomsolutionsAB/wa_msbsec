<?php
/**
 * Meta WhatsApp Cloud API helpers.
 */

declare(strict_types=1);

function waLoadMetaConfig(mysqli $db): array
{
    $res = $db->query('SELECT * FROM `whatsapp` LIMIT 1');
    if (!$res) {
        throw new RuntimeException('Failed to load WhatsApp config: ' . $db->error);
    }
    $row = $res->fetch_assoc();
    if (!$row) {
        throw new RuntimeException('No WhatsApp config row found');
    }

    $accessToken = trim((string) ($row['access_token'] ?? ''));
    $phoneNumberId = trim((string) ($row['phone_number_id'] ?? ''));
    $apiVersion = trim((string) ($row['api_version'] ?? 'v22.0'));
    $baseUrl = trim((string) ($row['url'] ?? 'https://graph.facebook.com'));

    if ($apiVersion === '') {
        $apiVersion = 'v22.0';
    }
    if ($baseUrl === '') {
        $baseUrl = 'https://graph.facebook.com';
    }
    if ($accessToken === '' || $phoneNumberId === '') {
        throw new RuntimeException('Meta credentials incomplete. Set Access Token and Phone Number ID in Settings.');
    }

    return [
        'access_token' => $accessToken,
        'phone_number_id' => $phoneNumberId,
        'api_version' => $apiVersion,
        'base_url' => rtrim($baseUrl, '/'),
        'waba_id' => trim((string) ($row['waba_id'] ?? '')),
    ];
}

function waNormalizeMobile(string $mobile): string
{
    $digits = preg_replace('/\D+/', '', $mobile);
    if ($digits === null || $digits === '') {
        return '';
    }
    if (strlen($digits) === 10) {
        $digits = '91' . $digits;
    }
    return $digits;
}

function waTextParam($value): string
{
    $text = trim((string) $value);
    return $text === '' ? '.' : $text;
}

/**
 * Build fee_reminder body params (10 placeholders).
 *
 * @param array $student DB student row
 * @param string $parentName father or mother name for {{1}}
 */
function waFeeReminderParams(array $student, string $parentName): array
{
    $section = trim((string) ($student['section'] ?? ''));
    if ($section === '') {
        $section = '.';
    }

    $its = waTextParam($student['its'] ?? '');

    return [
        waTextParam($parentName),
        waTextParam($student['name'] ?? ''),
        $its,
        waTextParam($student['class'] ?? ''),
        $section,
        '2026-2027',
        waTextParam($student['custom_1'] ?? ''),
        waTextParam($student['custom_2'] ?? ''),
        waTextParam($student['custom_3'] ?? ''),
        $its,
    ];
}

function waSendTemplateMessage(array $config, string $to, string $templateName, string $langCode, array $bodyParams): array
{
    $endpoint = $config['base_url'] . '/' . $config['api_version'] . '/' . $config['phone_number_id'] . '/messages';

    $parameters = [];
    foreach ($bodyParams as $text) {
        $parameters[] = [
            'type' => 'text',
            'text' => (string) $text,
        ];
    }

    $payload = [
        'messaging_product' => 'whatsapp',
        'to' => $to,
        'type' => 'template',
        'template' => [
            'name' => $templateName,
            'language' => [
                'code' => $langCode,
            ],
            'components' => [
                [
                    'type' => 'body',
                    'parameters' => $parameters,
                ],
            ],
        ],
    ];

    $ch = curl_init($endpoint);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $config['access_token'],
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => 45,
        CURLOPT_CONNECTTIMEOUT => 15,
    ]);

    $response = curl_exec($ch);
    $errno = curl_errno($ch);
    $error = curl_error($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $decoded = null;
    if (is_string($response) && $response !== '') {
        $decoded = json_decode($response, true);
    }

    $ok = ($errno === 0 && $httpCode >= 200 && $httpCode < 300);
    $messageId = '';
    if (is_array($decoded) && isset($decoded['messages'][0]['id'])) {
        $messageId = (string) $decoded['messages'][0]['id'];
    }

    $apiError = '';
    if (is_array($decoded) && isset($decoded['error']['message'])) {
        $apiError = (string) $decoded['error']['message'];
    }

    return [
        'ok' => $ok,
        'http_code' => $httpCode,
        'message_id' => $messageId,
        'error' => $ok ? '' : ($apiError !== '' ? $apiError : ($error !== '' ? $error : 'Send failed')),
        'response' => $decoded,
    ];
}
