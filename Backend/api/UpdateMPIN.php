<?php
include 'Connection.php';

if($_SERVER["REQUEST_METHOD"] == "POST"){
    
    include './Authentication.php';

    $data = json_decode(file_get_contents('php://input'));

    
    $newmpin = $data->newmpin;

    $sql = "Update `root` SET `MPIN` = '$newmpin'";

    $result = mysqli_query($mainConnection, $sql);

    if($result){
        echo json_encode(array("updated" => true));
    }
    else{
        echo json_encode(array("updated" => false));
    }
}