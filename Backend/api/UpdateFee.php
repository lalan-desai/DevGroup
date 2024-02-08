<?php

include_once './Connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    include './Authentication.php';

    $data = json_decode(file_get_contents('php://input'));

    $yf = $data->yf;
    $mf = $data->mf;
    $rf = $data->rf;

    $sql = "UPDATE `root` SET `Yearly_fee`=$yf,`Monthly_fee`=$mf,`Renew_fee`=$rf WHERE 1";
    $result = mysqli_query($mainConnection, $sql);

    echo json_encode(array("code" => 200));
}

