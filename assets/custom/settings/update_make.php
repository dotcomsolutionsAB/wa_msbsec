<?php
	include ("../connect.php");
	session_start();

	$group_name = $_REQUEST["settings_group"];
	$make = $_REQUEST["settings_make"];

	$default_make = '0';
	if($make == "on")
		$default_make = '1';
	
	$validator = array("success"=>false, "messages"=>"There was some error saving the records");

	$sql = "UPDATE settings SET `default_make`='$default_make' WHERE `group_name` = '$group_name'";
	$query = $db->query($sql);

	$sql = "UPDATE product SET `default_make`='$default_make' WHERE `group` = '$group_name'";
	$query = $db->query($sql);

	if($query===true)
	{
		$validator['success'] = true;
		$validator['messages'] = "Successfully Updated";
	}
	else
	{
		$validator['success'] = false;
		$validator['messages'] = "There was some error updating the records";
	}

	echo json_encode($validator);
	
?>