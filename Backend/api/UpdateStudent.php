<?php

include_once './Connection.php';

function generateRandomString($length = 10)
{
    return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length / strlen($x)))), 1, $length);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    include './Authentication.php';

    $data = json_decode(file_get_contents('php://input'));

    $id = $data->id;
    $name = $data->name;
    $number = $data->number;
    $gender = $data->gender;
    $fee = $data->fee;
    $frequancy = $data->frequancy;
    $paymentStatus = $data->paymentStatus;
    $batchCode = $data->batchCode;
    $date = $data->date;

    $image = $data->image;

    $imageURI = null;

    if ($data->image != '') {
        $imageURI = $gender . $frequancy . $batchCode . date("Y", strtotime($date)) . generateRandomString(5);
        $image = str_replace('data:image/png;base64,', '', $image);
        $image = str_replace(' ', '+', $image);
        $imageName = $imageURI . '.png';
        $imagePath = './images/' . $imageName;
        file_put_contents($imagePath, base64_decode($image));

        if (isset($data->oldImageURI)) {
            $oiu = $data->oldImageURI . ".png";
            $path = "./images/" . $oiu;
            if (file_exists($path)) {
                unlink($path);
            }
        }

        $sql = "UPDATE `users` SET `ImageURI`='$imageURI',`Name`='$name',`MobileNumber`='$number',`Gender`='$gender',`Fee`='$fee',`Frequancy`='$frequancy',`PaymentStatus`='$paymentStatus',`BatchCode`='$batchCode',`Date`='$date' WHERE `Id`='$id'";
    } else {
        $sql = "UPDATE `users` SET `Name`='$name',`MobileNumber`='$number',`Gender`='$gender',`Fee`='$fee',`Frequancy`='$frequancy',`PaymentStatus`='$paymentStatus',`BatchCode`='$batchCode',`Date`='$date' WHERE `Id`='$id'";
    }

    if (mysqli_query($mainConnection, $sql)) {
        $successJsonMsg = array('status' => '200', 'message' => 'Student Updated Successfully');
        echo json_encode($successJsonMsg);
    } else {
        $queryError = mysqli_error($mainConnection);
        $errorJsonMsg = array('status' => '400', 'message' => $queryError);
        echo json_encode($errorJsonMsg);
    }

}