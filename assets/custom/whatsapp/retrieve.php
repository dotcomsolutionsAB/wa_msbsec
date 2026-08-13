<?php
session_start();
include ("../connect.php");

$pagination = $_REQUEST['pagination'];  
$query_array = $_REQUEST['query'];  
$sort_array = $_REQUEST['sort'];

$query = $query_array['generalSearch'];

$sql_1 = "SELECT COUNT(*) AS total FROM `wa_messages` WHERE `message` LIKE '%$query%' || `mobile` LIKE '%$query%'";
$query_1 = $db->query($sql_1);
$row_1 = $query_1->fetch_assoc();

$perpage = $pagination['perpage'];
$start = ($pagination['page']-1)*$perpage;
$pages = $row_1['total'] / $perpage;

$output = array('meta'=> array("page"=> $pagination['page'], "pages"=> $pages, "perpage"=> $perpage,"total"=> $row_1['total'],"sort"=> 'asc', "field"=> 'SN'), 'data' => array());

$count = $start + 1;
$sql = "SELECT * FROM `wa_messages` WHERE `message` LIKE '%$query%' || `mobile` LIKE '%$query%' ORDER BY `id` LIMIT ".$start.','.$perpage;
$query = $db->query($sql);
while($row = $query->fetch_assoc()){


    $message = $row['message'];
    $message = preg_replace("/\r\n|\r|\n/", '<br/>', $message);
    $message = preg_replace('#\*(.*?)\*#', '<b>$1</b>', $message);
    $message = preg_replace('#\_(.*?)\_#', '<i>$1</i>', $message);

    $output['data'][] = array(      
        'SN' => $count++,
        'id' => $row['id'],
        'mobile' => $row['mobile'],
        'message' => $message,
        'image' => $row['image'],
        'pdf' => $row['pdf']
    );
}

echo json_encode($output);

?>