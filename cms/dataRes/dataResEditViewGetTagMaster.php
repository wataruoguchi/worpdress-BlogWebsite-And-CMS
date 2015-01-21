<?php 
require_once("../lib/vendor/htmlpurifier/HTMLPurifier.standalone.php");
$purifier = new HTMLPurifier();

include ("../includes/ExecDB.php");
$exec = new ExecDB();

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		// query
		// SELECT
		$userId = $purifier->purify(addslashes($_GET['userId']));
		$sql = "SELECT tagId, tagName as text FROM tag "
		."WHERE userId = (SELECT userId FROM user WHERE userId='".$userId."')";
		echo $exec->select($sql);
		break;
}
?>