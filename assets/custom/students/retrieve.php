<?php
session_start();
include __DIR__ . '/../connect.php';

$pagination = isset($_REQUEST['pagination']) ? $_REQUEST['pagination'] : ['page' => 1, 'perpage' => 10];
$query_array = isset($_REQUEST['query']) ? $_REQUEST['query'] : [];
$query = isset($query_array['generalSearch']) ? trim((string) $query_array['generalSearch']) : '';
$classFilter = isset($query_array['class']) ? trim((string) $query_array['class']) : '';

$where = [];
if ($query !== '') {
    $q = $db->real_escape_string($query);
    $where[] = "(
        `name` LIKE '%{$q}%'
        OR `its` LIKE '%{$q}%'
        OR `father_name` LIKE '%{$q}%'
        OR `father_mobile` LIKE '%{$q}%'
        OR `mother_name` LIKE '%{$q}%'
        OR `mother_mobile` LIKE '%{$q}%'
        OR `class` LIKE '%{$q}%'
        OR `section` LIKE '%{$q}%'
        OR `custom_1` LIKE '%{$q}%'
        OR `custom_2` LIKE '%{$q}%'
        OR `custom_3` LIKE '%{$q}%'
    )";
}
if ($classFilter !== '') {
    $classEsc = $db->real_escape_string($classFilter);
    $where[] = "`class` = '{$classEsc}'";
}

$searchSql = empty($where) ? '' : (' WHERE ' . implode(' AND ', $where));

$total = 0;
$countRes = $db->query("SELECT COUNT(*) AS total FROM `students`{$searchSql}");
if ($countRes) {
    $total = (int) $countRes->fetch_assoc()['total'];
}

$perpage = max(1, (int) $pagination['perpage']);
$page = max(1, (int) $pagination['page']);
$start = ($page - 1) * $perpage;
$pages = $perpage > 0 ? (int) ceil($total / $perpage) : 1;

$output = [
    'meta' => [
        'page' => $page,
        'pages' => $pages,
        'perpage' => $perpage,
        'total' => $total,
        'sort' => 'asc',
        'field' => 'SN',
    ],
    'data' => [],
];

$count = $start + 1;
$sql = "SELECT * FROM `students`{$searchSql} ORDER BY CAST(`sn` AS UNSIGNED), `id` LIMIT {$start},{$perpage}";
$result = $db->query($sql);
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $lastSent = isset($row['last_message_sent_at']) ? $row['last_message_sent_at'] : null;
        $output['data'][] = [
            'SN' => $count++,
            'id' => $row['id'],
            'sheet_sn' => $row['sn'],
            'name' => $row['name'],
            'its' => $row['its'],
            'father_name' => $row['father_name'],
            'father_mobile' => $row['father_mobile'],
            'mother_name' => $row['mother_name'],
            'mother_mobile' => $row['mother_mobile'],
            'class' => $row['class'],
            'section' => $row['section'],
            'custom_1' => $row['custom_1'],
            'custom_2' => $row['custom_2'],
            'custom_3' => $row['custom_3'],
            'custom_4' => $row['custom_4'],
            'custom_5' => $row['custom_5'],
            'synced_at' => $row['synced_at'],
            'last_message_sent_at' => $lastSent ? $lastSent : '',
            'last_message_sent_on' => $lastSent ? $lastSent : '—',
        ];
    }
}

echo json_encode($output);
