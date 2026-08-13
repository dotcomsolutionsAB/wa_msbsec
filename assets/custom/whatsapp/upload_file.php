<?php
session_start();
require_once "../connect.php";

$validator = array('success' => false,'id'=>'');

// Image Saving
$file = $_FILES['file'];

$fileName = $_FILES["file"]["name"]; // The file name
$fileTmpLoc = $_FILES["file"]["tmp_name"]; // File in the PHP tmp folder
$fileType = $_FILES["file"]["type"]; // The type of file it is
$fileSize = $_FILES["file"]["size"]; // File size in bytes
$fileErrorMsg = $_FILES["file"]["error"]; // 0 for false... and 1 for true
$fileName = preg_replace('#[^a-z.0-9]#i', '', $fileName); // filter the $filename
$kaboom = explode(".", $fileName); // Split file name into an array using the dot
$fileExt = strtolower(end($kaboom)); // Now target the last array element to get the file extension

$message_id = $_REQUEST['message_id'];
$count = $_REQUEST['count'];

$sql = "SHOW TABLE STATUS LIKE 'wa_messages'";
$query = $db->query($sql);

if ($query && $query->num_rows > 0) {
    $row = $query->fetch_assoc();
    // Get the next auto-increment value
    $nextID = $row['Auto_increment'];
    
    if($message_id && $message_id != 'undefined') {
        // Place it into your "uploads" folder now using the move_uploaded_file() function
        $moveResult = move_uploaded_file($fileTmpLoc, "../../uploads/files/".$message_id."_".($count+1)."_file.".$fileExt);
    } else {
        // Place it into your "uploads" folder now using the move_uploaded_file() function
        $moveResult = move_uploaded_file($fileTmpLoc, "../../uploads/files/".$nextID."_".($count+1)."_file.".$fileExt);
    }

    // Check to make sure the move result is true before continuing
    if ($moveResult != true) {
        $validator['success'] = false;
    }else{
        $validator['success'] = true;
        $validator['nextID'] = $nextID;
    }

    echo json_encode($validator);

} else {
    echo json_encode($validator);
}


?>