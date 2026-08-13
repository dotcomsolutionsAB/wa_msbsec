<?php
session_start();
session_unset();
session_destroy();

header("location:https://wa.anjumanequtbimsbsecunderabad.com?val=signout");
exit();
?>