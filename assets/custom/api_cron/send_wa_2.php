<?php
//ini_set("display_errors",1);
session_start();

date_default_timezone_set('Asia/Kolkata');
$db = new mysqli('localhost','utavqate_msbsec_wa','YLPu;XPfvJ,L','utavqate_msbsec_wa');

  if($db->connect_errno){
    die('Sorry, We are having some errors');
  }

if (version_compare(phpversion(), '7.1', '>=')) {
    ini_set( 'serialize_precision', -1 );
}

  $sql_fetch = "SELECT * FROM whatsapp";
  $query_fetch = $db->query($sql_fetch);
  $row_fetch = $query_fetch->fetch_assoc();

  $token        = $row_fetch['token'];
  $instance_id  = $row_fetch['instance_id'];
  $base_url     = $row_fetch['url'];

  $queue_status = $row_fetch['queue_status'];
  $frequency    = $row_fetch['frequency'];
  $start_time   = $row_fetch['start_time'];
  $end_time     = $row_fetch['end_time'];

if(time() >= strtotime($start_time) && time() <= strtotime($end_time) && $queue_status){

  $today = date('Y-m-d');
  $day_today = date('l',strtotime($today));

  $sql = "SELECT * FROM `wa_messages` ORDER BY `priority` DESC,`id` LIMIT $frequency";
  $query = $db->query($sql);
  while($row = $query->fetch_assoc()){

    $messege_id = $row['id'];
    $mob      = $row['mobile'];

    // $mob = '918961043773';
    if(strlen($mob) == '10'){
        $mob = '91'.$mob;
    }
    $message  = $row['message'];
    $url      = $row['url'];
    $pdf      = $row['pdf'];

    if($message != ''){

      $post_url = $base_url."/api/send.php?";
      $post_url .= 'number='.$mob;
      $post_url .= '&type=text';
      $post_url .= '&message='.urlencode($message);
      $post_url .= '&instance_id='.$instance_id;
      $post_url .= '&access_token='.$token;    

      $ch_image = curl_init();
      curl_setopt_array($ch_image, array(
        CURLOPT_URL => $post_url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_SSL_VERIFYPEER => false,
      ));
      $result = curl_exec($ch_image);
		
		echo $result;

      $sql_update = "DELETE FROM `wa_messages` WHERE `id` = '$messege_id'";
      $query_update = $db->query($sql_update);

    }

    if($url != ''){

      $post_url = $base_url."/api/send.php?";
      $post_url .= 'number='.$mob;
      $post_url .= '&type=media';
      $post_url .= '&message='."";
      $post_url .= '&media_url='.urlencode($url);
      $post_url .= '&instance_id='.$instance_id;
      $post_url .= '&access_token='.$token;    

      $ch = curl_init();
      curl_setopt_array($ch, array(
        CURLOPT_URL => $post_url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_SSL_VERIFYPEER => false,
      ));
      $result = curl_exec($ch);

      $sql_update = "DELETE FROM `wa_messages` WHERE `id` = '$messege_id'";
      $query_update = $db->query($sql_update);
          
    }

    if($pdf != ''){
      $post_url = $base_url."/api/send.php?";
      $post_url .= 'number='.$mob;
      $post_url .= '&message='."";
      $post_url .= '&type=media';
      $post_url .= '&media_url='.$pdf;
      $post_url .= '&filename=file.pdf';
      $post_url .= '&instance_id='.$instance_id;
      $post_url .= '&access_token='.$token;    

      $ch_image = curl_init();
      curl_setopt_array($ch_image, array(
        CURLOPT_URL => $post_url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_SSL_VERIFYPEER => false,
      ));
      $result_image = curl_exec($ch_image);

      $sql_update = "DELETE FROM `wa_messages` WHERE `id` = '$messege_id'";
      $query_update = $db->query($sql_update);

    }

  }
}

?>