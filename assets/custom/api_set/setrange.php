<?php
session_start();
require_once "../connect.php";

$request = file_get_contents('php://input');
$input = json_decode($request);

$validator = array('success' => false, 'messages' => array());

$_SESSION['start'] = $_REQUEST['start'];
$_SESSION['end'] = $_REQUEST['end'];

$validator['success'] = true;
$validator['messages'] = $_SESSION['start']." - ".$_SESSION['end'];

echo json_encode($validator);


?>