<?php

include "./Connection.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

  try {

    include 'Authentication.php';

    // awailble year get from database
    $sql = "SELECT  `Yearly_fee`, `Monthly_fee`, `Renew_fee` FROM `root`";

    $result = mysqli_query($mainConnection, $sql);

    while ($row = mysqli_fetch_assoc($result)) {
      echo json_encode($row);
    }


  } catch (Exception $e) {
    echo 'Message: ' . $e->getMessage();
  }
}
