<?php
    session_start();
    if($_SESSION['userlevel'] != "sadmin_df56fdg")
    {
        header("location:http://msbsec.ongoingsites.xyz?val=timeout");
    }  
?>