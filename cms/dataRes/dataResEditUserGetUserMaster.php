<?php 
require_once("../lib/vendor/htmlpurifier/HTMLPurifier.standalone.php");
$purifier = new HTMLPurifier();

include ("../includes/ExecDB.php");
$exec = new ExecDB();

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		// query
		$userId = $purifier->purify(addslashes($_GET['userId']));
		$email = $purifier->purify(addslashes($_GET['email']));
		// SELECT
		$sql = "SELECT Email FROM user WHERE Email = '".$email."' AND userId <> '".$userId."' ";
		echo $exec->select($sql);
}
?>