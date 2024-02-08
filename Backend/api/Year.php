<?php

include "./Connection.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

  try {
    include 'Authentication.php';

    $sql = "SELECT YEAR(adddate(Date, INTERVAL 2 MONTH)) as Year FROM `users` group by YEAR(adddate(Date, INTERVAL 2 MONTH));";

    $result = mysqli_query($mainConnection, $sql);

    $dataofyear = array();

    while ($row = mysqli_fetch_assoc($result)) {
      $dataofyear[] = $row;
    }


    echo json_encode($dataofyear);
  } catch (Exception $e) {
    echo 'Message: ' . $e->getMessage();
  }
}
