<?php
	include ("../connect.php");
	session_start();
	//Entered Value in login Page
	$id = $_REQUEST['edit_id'];	
	$username = $_REQUEST['edit_username'];	
	$name = $_REQUEST['edit_name'];	
	$mobile = $_REQUEST['edit_mobile'];	
	$email = $_REQUEST['edit_email'];	
	$password = $_REQUEST['edit_password'];
	$userlevel = $_REQUEST['edit_userlevel'];

	$validator = array("success"=>false, "messages"=>"There was some error updating the records");
	
	if($password != ''){
		//Salt Encryption
		$salt = "DCS1920";

		//Encrypting Password
		$password = $salt.$password;	
		$password = sha1($password);

		$sql = "UPDATE users SET `username`='$username',`password`='$password',`mobile`='$mobile',`email`='$email',`name`='$name',`userlevel`='$userlevel' WHERE `id` = '$id'";
		$query = $db->query($sql);

	}else{
		$sql = "UPDATE users SET `username`='$username',`mobile`='$mobile',`email`='$email',`name`='$name',`userlevel`='$userlevel' WHERE `id` = '$id'";
		$query = $db->query($sql);
	}
	

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