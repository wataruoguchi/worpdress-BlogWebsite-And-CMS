<?php 
require_once("../lib/vendor/htmlpurifier/HTMLPurifier.standalone.php");
$purifier = new HTMLPurifier();

include ("../includes/ExecDB.php");
$exec = new ExecDB();

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		// query
		// SELECT
		$sql = "SELECT userId, displayName, u.roleId as roleId, roleName, userName, Email, URL, u.isDeletedFlag as isDeletedFlag "
		."FROM user u INNER JOIN userrole r ON u.roleId = r.roleId WHERE Email is not null";
		echo $exec->select($sql);
		break;
	case 'DELETE':
		// DELETE
		$userId = $purifier->purify(addslashes($_GET['userId']));
		$sql = "UPDATE user SET isDeletedFlag = 1 WHERE userId='".$userId."'";
		$exec->update($sql);
		break;
}
?>