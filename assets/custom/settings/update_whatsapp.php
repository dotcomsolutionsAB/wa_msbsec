<?php
	include ("../connect.php");
	session_start();

	$token 					= $_REQUEST["whatsapp_token"];
	$instance_id 			= $_REQUEST["whatsapp_instance_id"];
	$url 					= $_REQUEST["whatsapp_base_url"];
	$whatsapp_status 		= $_REQUEST["whatsapp_status"];
	$whatsapp_frequency 	= $_REQUEST["whatsapp_frequency"];
	$whatsapp_start_time 	= $_REQUEST["whatsapp_start_time"];
	$whatsapp_end_time 		= $_REQUEST["whatsapp_end_time"];


	$validator = array("success"=>false, "messages"=>"There was some error saving the records");

	$sql = "UPDATE whatsapp SET `token`='$token',`instance_id`='$instance_id',`url`='$url',`queue_status`='$whatsapp_status',`frequency`='$whatsapp_frequency',`start_time`='$whatsapp_start_time',`end_time`='$whatsapp_end_time' WHERE 1";
	$query = $db->query($sql);

	if($query===true)
	{
		$validator['success'] = true;
		$validator['messages'] = "Successfully Updated";
		$validator['sql'] = $sql;
	}
	else
	{
		$validator['success'] = false;
		$validator['messages'] = "There was some error updating the records";
		$validator['sql'] = $sql;
	}

	echo json_encode($validator);
	
?>