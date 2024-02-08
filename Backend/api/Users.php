<?php

include_once './Connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    try {

        include 'Authentication.php';

        $data = json_decode(file_get_contents('php://input'));

        $gender = $data->gender;
        $year = $data->year;
        $batchcode = $data->batchcode;

        $startDate = (($data->year * 1) - 1) . '-11-01';
        $endDate = ($data->year * 1) . '-10-31';

        if ($batchcode !== "") {

            $sql = "SELECT * FROM `users` WHERE `Gender` = '$gender' AND `Date` BETWEEN '$startDate' AND '$endDate' and Batchcode like '$batchcode%' ORDER BY Convert(REPLACE(BatchCode,'$batchcode',''),SIGNED)";

            $result = mysqli_query($mainConnection, $sql);

            $jsonArray = array();

            while ($row = mysqli_fetch_assoc($result)) {
                $jsonArray[] = $row;
            }

            echo json_encode(array_reverse($jsonArray));
        } else {

            $jsonArray = array();
            $letter = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
            foreach (str_split($letter) as $letter) {
                $arr = array();
                $sql = "SELECT * FROM `users` WHERE `Gender` = '$gender' AND `Date` BETWEEN '$startDate' AND '$endDate' and Batchcode like '$letter%' ORDER BY Convert(REPLACE(BatchCode,'$letter',''),SIGNED)";
                $result = mysqli_query($mainConnection, $sql);

                while ($row = mysqli_fetch_assoc($result)) {
                    $arr[] = $row;
                }
                $jsonArray = array_merge($arr, $jsonArray);

            }
            echo json_encode(array_reverse($jsonArray));
        }

    } //catch exception
    catch (Exception $e) {
        echo 'Message: ' . $e->getMessage();
    }

}