<?php

include_once './Connection.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    try {

        $data = json_decode(file_get_contents('php://input'));

        $year = $data->year;
        $gender = $data->gender;

        $startDate = (($data->year * 1) - 1) . '-11-01';
        $endDate = ($data->year * 1) . '-10-31';

        $letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $jsonArray = array();

        foreach (str_split($letter) as $letter) {
            $sql = "select COUNT(BatchCode) as '$gender' from users where date BETWEEN '$startDate' and '$endDate' and BatchCode like '$letter%' and Gender = '$gender'";
            $result = mysqli_query($mainConnection, $sql);


            while ($row = mysqli_fetch_assoc($result)) {
                if ($row[$gender] == 0) {
                    $jsonArray['batchcode'] = 1;
                } else {

                    $jsonArray['batchcode'] = $row[$gender];
                }

            }
            if ($jsonArray['batchcode'] <= 99) {
                $jsonArray['letter'] = $letter;
                break;
            }
        }

        $batch = $jsonArray['letter'] . $jsonArray['batchcode'];
        
        DataCheck($batch, $jsonArray['batchcode'], 100, mb_substr("ABCDEFGHIJKLMNOPQRSTUVWXYZ", strpos("ABCDEFGHIJKLMNOPQRSTUVWXYZ", $jsonArray["letter"]) + 1, 1, "UTF-8"), $mainConnection);

    } //catch exception
    catch (Exception $e) {
        echo 'Message: ' . $e->getMessage();
    }


}


function DataCheck($batch, $batchcode, $maxbatchcode, $nextletter, $mainConnection)
{

    global $jsonArray;
    global $startDate;
    global $endDate;
    global $gender;
    global $letter;
    $sql = "select COUNT(*) from users where BatchCode = '$batch' and date BETWEEN '$startDate' and '$endDate' and Gender = '$gender'";
    $result = mysqli_query($mainConnection, $sql);
    while ($row = mysqli_fetch_assoc($result)) {
        if ($row['COUNT(*)'] > 0) {
            if ($batchcode == $maxbatchcode) {
                $jsonArray['letter'] = $nextletter;
                $jsonArray['batchcode'] = 1;
                $batch = $jsonArray['letter'] . $jsonArray['batchcode'];

            } else {
                $jsonArray['batchcode'] = $jsonArray['batchcode'] + 1;
                $batch = $jsonArray['letter'] . $jsonArray['batchcode'];
            }
            DataCheck($batch, $jsonArray['batchcode'], 100, mb_substr("ABCDEFGHIJKLMNOPQRSTUVWXYZ", strpos("ABCDEFGHIJKLMNOPQRSTUVWXYZ", $jsonArray["letter"]) + 1, 1, "UTF-8"), $mainConnection);
        } else {
            echo json_encode($jsonArray);

        }
    }
}


