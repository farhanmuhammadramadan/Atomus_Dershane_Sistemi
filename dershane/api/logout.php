<?php
session_start();
session_destroy();
header("Location: ../tanitim.html");
exit();
?>