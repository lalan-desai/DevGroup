<?php

$servername = "YOUR_HOSTNAME";
$username = "YOUR_USERNAME";
$password = "YOUR_PASSWORD";
$dbname = "YOUR_DB_NAME";

$mainConnection = new mysqli($servername, $username, $password, $dbname);


if ($mainConnection->connect_error) {
    die("Connection failed: " . $mainConnection->connect_error);
}

