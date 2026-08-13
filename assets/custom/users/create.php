<?php
	include ("../connect.php");
	session_start();
	//Entered Value in login Page
	$name = $_REQUEST['name'];	
	$username = $_REQUEST['username'];	
	$password = $_REQUEST['password'];
	$mobile = $_REQUEST['mobile'];
	$email = $_REQUEST['email'];
	$userlevel = $_REQUEST['userlevel'];

	//Salt Encryption
	$salt = "DCS1920";

	//Encrypting Password
	$password = $salt.$password;	
	$password = sha1($password);

	$validator = array("success"=>false, "messages"=>"There was some error saving the records");
	
	$sql = "INSERT INTO users (`username`,`password`,`userlevel`,`mobile`,`email`,`name`) VALUES ('$username','$password','$userlevel','$mobile','$email','$name')";
	$query = $db->query($sql);

	if($query===true)
	{
		$validator['success'] = true;
		$validator['messages'] = "Successfully Added";
	}
	else
	{
		$validator['success'] = false;
		$validator['messages'] = "There was some error saving the records";

	}

	echo json_encode($validator);
	
?>