<?php
	include ("../connect.php");
	session_start();

	$access_token    = isset($_REQUEST["whatsapp_access_token"]) ? trim($_REQUEST["whatsapp_access_token"]) : '';
	$phone_number_id = isset($_REQUEST["whatsapp_phone_number_id"]) ? trim($_REQUEST["whatsapp_phone_number_id"]) : '';
	$waba_id         = isset($_REQUEST["whatsapp_waba_id"]) ? trim($_REQUEST["whatsapp_waba_id"]) : '';
	$api_version     = isset($_REQUEST["whatsapp_api_version"]) ? trim($_REQUEST["whatsapp_api_version"]) : 'v22.0';
	$url             = isset($_REQUEST["whatsapp_base_url"]) ? trim($_REQUEST["whatsapp_base_url"]) : 'https://graph.facebook.com';

	if ($api_version === '') {
		$api_version = 'v22.0';
	}
	if ($url === '') {
		$url = 'https://graph.facebook.com';
	}

	$validator = array("success"=>false, "messages"=>"There was some error saving the records");

	$sql = "UPDATE whatsapp SET
		`provider` = 'meta',
		`access_token` = ?,
		`phone_number_id` = ?,
		`waba_id` = ?,
		`api_version` = ?,
		`url` = ?
		WHERE `id` = 1";

	$stmt = $db->prepare($sql);
	if ($stmt) {
		$stmt->bind_param(
			'sssss',
			$access_token,
			$phone_number_id,
			$waba_id,
			$api_version,
			$url
		);

		if ($stmt->execute()) {
			$validator['success'] = true;
			$validator['messages'] = "Successfully Updated";
		} else {
			$validator['success'] = false;
			$validator['messages'] = "There was some error updating the records";
		}
		$stmt->close();
	} else {
		$validator['success'] = false;
		$validator['messages'] = "Prepare failed. Run migrations/001_meta_whatsapp_credentials.sql first.";
	}

	echo json_encode($validator);
	
?>
