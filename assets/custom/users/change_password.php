<?php
	include ("../connect.php");
	session_start();
	//Entered Value in login Page
	$user_name = $_SESSION['username'];	
	$password = $_REQUEST['new_pass'];

	//Salt Encryption
	$salt = "DCS1920";

	//Encrypting Password
	$password = $salt.$password;	
	$password = sha1($password);

	$validator = array("success"=>false, "messages"=>"There was some error updating the records");

	$sql = "UPDATE users SET `password`='$password' WHERE `username` = '$user_name'";
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