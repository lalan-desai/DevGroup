<?php
include_once './Connection.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    include './Authentication.php';

    $data = json_decode(file_get_contents('php://input'));

    
    $sql = "SELECT * FROM `users` WHERE 1 = 1";

    $params = [];

    if (isset($data->name) && $data->name !== "") {
        $sql .= " AND (`name` LIKE ? OR `MobileNumber` LIKE ?)";
        $params[] = '%' . $data->name . '%';
        $params[] = '%' . $data->name . '%';
    }

    if (isset($data->date) && $data->date !== "") {
        $sql .= " AND (`Date` LIKE ? OR `Date` LIKE ?)";
        $params[] = '%' . $data->date . '%';
        $params[] = '%' . $data->date . '%';
    }


    if (isset($data->fr) && $data->fr !== "") {
        $sql .= " AND `Frequancy` = ?";
        $params[] = $data->fr;
    }

    if (isset($data->batchcode) && $data->batchcode !== "") {
        $sql .= " AND `BatchCode` LIKE ?";
        $params[] = $data->batchcode . '%';
    }

    if (isset($data->paymentstatus) && $data->paymentstatus !== "") {
        $sql .= " AND `PaymentStatus` = ?";
        $params[] = $data->paymentstatus;
    }

    if (isset($data->year) && $data->year !== "") {
        $startdate = ($data->year - 1) . '-11-01';
        $enddate = $data->year . '-10-31';
        $sql .= " AND `Date` BETWEEN ? AND ?";
        $params[] = $startdate;
        $params[] = $enddate;
    }

    if (isset($data->gender) && $data->gender !== "") {
        $sql .= " AND `Gender` = ?";
        $params[] = $data->gender;
    }

    $stmt = mysqli_prepare($mainConnection, $sql);
    if ($stmt) {
        if (count($params) > 0) {
            mysqli_stmt_bind_param($stmt, str_repeat('s', count($params)), ...$params);
        }
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
    }

    $jsonArray = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $jsonArray[] = $row;
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($jsonArray);

    mysqli_stmt_close($stmt);
    mysqli_close($mainConnection);
}
