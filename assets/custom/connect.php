<?php
	date_default_timezone_set('Asia/Kolkata');
	$db = new mysqli('localhost','utavqate_msbsec_wa','YLPu;XPfvJ,L','utavqate_msbsec_wa');
	if($db->connect_errno){
		die('Sorry, We are having some errors');
	}

    if (version_compare(phpversion(), '7.1', '>=')) {
        ini_set( 'serialize_precision', -1 );
    }

	
?>