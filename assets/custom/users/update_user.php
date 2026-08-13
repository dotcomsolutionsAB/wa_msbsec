<?php
	include ("../connect.php");
	session_start();
	//Entered Value in login Page
	$username = $_SESSION['username'];	
	$name = $_REQUEST['full_name'];	
	$mobile = $_REQUEST['mobile'];	
	$email = $_REQUEST['email'];	

	$validator = array("success"=>false, "messages"=>"There was some error updating the records");
	
	$sql = "UPDATE users SET `mobile`='$mobile',`email`='$email',`name`='$name' WHERE `username` = '$username'";
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