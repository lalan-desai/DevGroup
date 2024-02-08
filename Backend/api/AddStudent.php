<?php

include_once './Connection.php';

function generateRandomString($length = 10)
{
    return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length / strlen($x)))), 1, $length);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    include './Authentication.php';

    try {

        $data = json_decode(file_get_contents('php://input'));


        $name = $data->name;
        $number = $data->number;
        $gender = $data->gender;
        $fee = $data->fee;
        $frequancy = $data->frequancy;
        $paymentStatus = $data->paymentStatus;
        $batchCode = $data->batchCode;
        $date = $data->date;


        $image = $data->image;
        // echo $image;
        $imageURI = null;

        $currentScriptPath = $_SERVER['PHP_SELF'];
        $scriptDirectory = dirname($currentScriptPath);
        $url = "https://{$_SERVER['HTTP_HOST']}{$scriptDirectory}/Batchcode.php";

        if (date("n", strtotime($date)) >= 11) {
            $json = json_encode(array('year' => date("Y", strtotime($date)) + 1, 'gender' => $gender));
        } else {
            $json = json_encode(array('year' => date("Y", strtotime($date)), 'gender' => $gender));
        }


        $options = array(
            'http' => array(
                'header' => "Content-type: application/x-www-form-urlencoded\r",
                'method' => 'POST',
                'content' => $json
            )
        );


        $context = stream_context_create($options);
        $result = file_get_contents($url, false, $context);

        if ($result === FALSE) {
            echo "Error: " . print_r(error_get_last(), true);
            exit;
        }


        $new = json_decode($result);
        $batchCode = $new->letter . $new->batchcode;

        if (isset($data->isRenew)) {
            $batchCode = $data->batchCode;
        }

        //save image
        if ($image != '') {
            $imageURI = $gender . $frequancy . $batchCode . time();
            $image = str_replace('data:image/png;base64,', '', $image);
            $image = str_replace(' ', '+', $image);
            $imageName = $imageURI . '.png';
            $imagePath = './images/' . $imageName;
            file_put_contents($imagePath, base64_decode($image));

            $sql = "INSERT INTO `users`(`ImageURI`,`Name`, `MobileNumber`, `Gender`, `Fee`, `Frequancy`, `PaymentStatus`, `BatchCode`, `Date`) VALUES ('$imageURI','$name','$number','$gender','$fee','$frequancy','$paymentStatus','$batchCode','$date')";

        } else {
            $sql = "INSERT INTO `users`(`Name`, `MobileNumber`, `Gender`, `Fee`, `Frequancy`, `PaymentStatus`, `BatchCode`, `Date`) VALUES ('$name','$number','$gender','$fee','$frequancy','$paymentStatus','$batchCode','$date')";

        }

        if (mysqli_query($mainConnection, $sql)) {
            $successJsonMsg = array('status' => '200', 'message' => 'Student Added Successfully ON ' . $batchCode);
            echo json_encode($successJsonMsg);
        } else {
            $queryError = mysqli_error($mainConnection);
            $errorJsonMsg = array('status' => '400', 'message' => $queryError);
            echo json_encode($errorJsonMsg);
        }
    } //catch exception
    catch (Exception $e) {
        echo 'Message: ' . $e->getMessage();
    }
}


