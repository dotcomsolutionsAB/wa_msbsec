<?php

function replace_improper($s){
	$s=str_replace("\"","",$s);
	$s=str_replace("'","",$s);
	$s=strtoupper($s);
	$s=trim($s);
	return $s;
}

function replace_improper_same($s){
	$s=str_replace("\"","",$s);
	$s=str_replace("'","",$s);
	$s=trim($s);
	return $s;
}

function replace_improper_proper($s){
	$s=str_replace("\"","",$s);
	$s=str_replace("'","",$s);
	$s=ucwords(strtolower($s));
	$s=trim($s);
	return $s;
}

function replace_improper_textarea($s){
	$s=str_replace("\"","",$s);
	$s=str_replace("'","",$s);
	$s=str_replace(array("\r\n","\r","\n"),'|',trim($s));
	$s=trim($s);
	return $s;
}

function replace_tax($s){
	$s=str_replace("%","",$s);
	$s=trim($s);
	return $s;
}

?>