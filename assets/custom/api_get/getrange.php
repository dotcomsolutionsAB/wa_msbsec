<?php
session_start();
require_once "../connect.php";

if(isset($_SESSION['start']))
	$start = $_SESSION['start'];
else
{
	$start = '2020-04-01';
	$_SESSION['start'] = $start;
}

if(isset($_SESSION['end']))
	$end = $_SESSION['end'];
else
{
	$end = '2021-03-31';
	$_SESSION['end'] = $end;

}

$validator = array('success' => true, 'start' => $start, 'end' => $end);

echo json_encode($validator);


?>

