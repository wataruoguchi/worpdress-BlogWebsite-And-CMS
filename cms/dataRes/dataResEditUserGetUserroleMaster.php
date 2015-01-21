<?php 
include ("../includes/ExecDB.php");
$exec = new ExecDB();

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		// query
		// SELECT
		$sql = "SELECT roleId as value, roleName as label FROM userrole ";
		echo $exec->select($sql);
		break;
}
?>