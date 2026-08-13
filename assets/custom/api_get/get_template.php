<?php
//ini_set("display_errors",1);

require_once "../connect.php";

$memberId = $_REQUEST['member_id'];

$sql = "SELECT * FROM wa_template WHERE id = 1";
$query = $db->query($sql);
$result = $query->fetch_assoc();
$db->close();
 
echo json_encode($result);

?>