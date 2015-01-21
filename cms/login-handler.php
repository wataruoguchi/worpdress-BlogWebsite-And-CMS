<?php
session_start();
$targetPage = "index.php";
$loginPage = "login.php";
require_once("./lib/vendor/htmlpurifier/HTMLPurifier.standalone.php");
$purifier = new HTMLPurifier();

include ("./includes/ExecDB.php");
$exec = new ExecDB();

if (isset($_POST['email'], $_POST['upass'])) {
    $email = $purifier->purify(addslashes($_POST['email']));
    $pass = $purifier->purify(addslashes($_POST['upass']));

    $sql = "SELECT userId, displayName, roleId FROM user WHERE Email = '". $email . "' "
    ."AND password = '" . $pass . "' AND isDeletedFlag = 0";
    if ($result = $exec->select($sql)) {
        $resultData = json_decode($result, true);
        if (count($resultData) === 1) {
            $_SESSION['auth'] = true;
            $_SESSION['userId'] = $resultData[0]['userId'];
            $_SESSION['displayName'] = $resultData[0]['displayName'];
            $_SESSION['roleId'] = $resultData[0]['roleId'];
            header("location:" . $targetPage);
        } else {
            header("location:".$loginPage."?error");
        }
    } else {
        header("location:".$loginPage."?error2");
    }
} else {
    header("location:".$loginPage."?error3");
}
?>