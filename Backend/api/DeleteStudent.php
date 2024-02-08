<?php

include_once './Connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    include './Authentication.php';

    $data = json_decode(file_get_contents('php://input'));

    if ($data->ImageURI !== '') {
        $name = $data->ImageURI . ".png";
        $path = "./images/" . $name;

        if (file_exists($path)) {
            unlink($path);
        }
    }

    $id = $data->StudentID;

    $sql = "DELETE FROM `users` WHERE `ID` = '$id'";

    if (mysqli_query($mainConnection, $sql)) {
        $successJsonMsg = array('status' => '200', 'message' => 'Student Deleted Successfully');
        echo json_encode($successJsonMsg);
    } else {
        $queryError = mysqli_error($mainConnection);
        $errorJsonMsg = array('status' => '400', 'message' => $queryError);
        echo json_encode($errorJsonMsg);
    }
}

