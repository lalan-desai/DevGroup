<?php

include 'Connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    include 'Authentication.php';


    $data = json_decode(file_get_contents('php://input'));

    $mpin = $data->mpin;

    $sql = "SELECT COUNT(*) as root FROM `root` WHERE `MPIN` = '$mpin'";

    $result = mysqli_query($mainConnection, $sql);

    $row = mysqli_fetch_assoc($result);

    if ($row['root'] == 1) {
        echo json_encode(array("status" => 200));
    } else {
        echo json_encode(array("status" => 403));
    }
}
