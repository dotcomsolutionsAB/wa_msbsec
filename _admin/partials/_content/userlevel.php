<?php
    session_start();
    if($_SESSION['userlevel'] != "sadmin_df56fdg")
    {
        header("location:https://www.dotcomsolutions.com?val=timeout");
    }  
?>