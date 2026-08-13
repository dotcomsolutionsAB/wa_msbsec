<?php
	date_default_timezone_set('Asia/Kolkata');

	$dbConfigPath = __DIR__ . '/database.php';
	if (!is_file($dbConfigPath)) {
		die('Database config missing. Copy assets/custom/database.example.php to database.php');
	}

	$dbConfig = require $dbConfigPath;
	$host = isset($dbConfig['host']) ? $dbConfig['host'] : 'localhost';
	$user = isset($dbConfig['username']) ? $dbConfig['username'] : '';
	$pass = isset($dbConfig['password']) ? $dbConfig['password'] : '';
	$name = isset($dbConfig['database']) ? $dbConfig['database'] : '';

	$db = new mysqli($host, $user, $pass, $name);
	if ($db->connect_errno) {
		die('Sorry, We are having some errors');
	}

	if (!empty($dbConfig['charset'])) {
		$db->set_charset($dbConfig['charset']);
	}

	if (version_compare(phpversion(), '7.1', '>=')) {
		ini_set('serialize_precision', -1);
	}
?>
