
<?php

include './Connection.php';

if ($_SERVER["REQUEST_METHOD"] =="POST"){
    
    include './Authentication.php';

    $data = json_decode(file_get_contents('php://input'));

    $year = $data->year;

    $start_date = (($data->year) - 1) . '-11-01';
    $end_date = ($data->year) . '-10-31';

    $totalfee = "SELECT SUM(Fee) as Fee FROM `users` WHERE date BETWEEN '$start_date' and '$end_date' and PaymentStatus != 'P'";
    
    $pendingPaymentsStudentSum = "SELECT Count(*) as Total FROM `users` WHERE date BETWEEN '$start_date' and '$end_date' and PaymentStatus = 'P'";
    $paidStudent = "SELECT Count(*) as Total FROM `users` WHERE date BETWEEN '$start_date' and '$end_date' and PaymentStatus != 'P'";

 
    
    $lifetimeincome = "SELECT SUM(Fee) as Fee FROM `users` WHERE  PaymentStatus != 'P'";

    $totalstudents = "SELECT COUNT(*) as Total FROM `users` WHERE date BETWEEN '$start_date' and '$end_date'";
    $totalmale = "SELECT COUNT(*) as Total FROM `users` WHERE date BETWEEN '$start_date' and '$end_date' and Gender = 'M'";
    $totalfemale = "SELECT COUNT(*) as Total FROM `users` WHERE date BETWEEN '$start_date' and '$end_date' and Gender = 'F'";
    $monthlyPlaneSelected = "SELECT COUNT(*) as Total FROM `users` WHERE date BETWEEN '$start_date' and '$end_date' and Frequancy = 'M'";
    $yearlyPlaneSelected = "SELECT COUNT(*) as Total FROM `users` WHERE date BETWEEN '$start_date' and '$end_date' and Frequancy = 'Y'";
    
    $totalfee = mysqli_query($mainConnection, $totalfee);

    $pendingPaymentsStudentSum = mysqli_query($mainConnection, $pendingPaymentsStudentSum);
    $paidStudent = mysqli_query($mainConnection, $paidStudent);
 

    $lifetimeincome = mysqli_query($mainConnection, $lifetimeincome);
    $totalstudents = mysqli_query($mainConnection, $totalstudents);
    $totalmale = mysqli_query($mainConnection, $totalmale);
    $totalfemale = mysqli_query($mainConnection, $totalfemale);
    $monthlyPlaneSelected = mysqli_query($mainConnection, $monthlyPlaneSelected);
    $yearlyPlaneSelected = mysqli_query($mainConnection, $yearlyPlaneSelected);


    $jsonArray = array();

    while ($row = mysqli_fetch_assoc($totalfee)) {
        $jsonArray["This Year Income"] = $row["Fee"];
    }
    while ($row = mysqli_fetch_assoc($pendingPaymentsStudentSum)) {
        $jsonArray["Pending"] = $row["Total"];
    }
    while ($row = mysqli_fetch_assoc($paidStudent)) {
        $jsonArray["Paid"] = $row["Total"];
    }
   
    while ($row = mysqli_fetch_assoc($lifetimeincome)) {
        $jsonArray["Life-Time Income"] = $row["Fee"];
    }
    while ($row = mysqli_fetch_assoc($totalstudents)) {
        $jsonArray["Total Student"] = $row["Total"];
    }
    while ($row = mysqli_fetch_assoc($totalmale)) {
        $jsonArray["Male Student"] = $row["Total"];
    }
    while ($row = mysqli_fetch_assoc($totalfemale)) {
        $jsonArray["Female Student"] = $row["Total"];
    }
    while ($row = mysqli_fetch_assoc($monthlyPlaneSelected)) {
        $jsonArray["Monthly"] = $row["Total"];
    }
    while ($row = mysqli_fetch_assoc($yearlyPlaneSelected)) {
        $jsonArray["Yearly"] = $row["Total"];
    }

    echo json_encode($jsonArray);

}

