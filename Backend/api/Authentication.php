<?php

$staticUsername = "YOUR_BASIC_AUTH_USERNAME";
$staticPassword = "YOUR_BASIC_AUTH_PASSWORD";
$staticBase64String = base64_encode($staticUsername . ':' . $staticPassword);

if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW']) || $_SERVER['PHP_AUTH_USER'] !== $staticUsername || $_SERVER['PHP_AUTH_PW'] !== $staticPassword) {
    header('HTTP/1.1 401 Unauthorized');
    header('WWW-Authenticate: Basic realm="Restricted Area"');
    exit('Unauthorized Access');
}

