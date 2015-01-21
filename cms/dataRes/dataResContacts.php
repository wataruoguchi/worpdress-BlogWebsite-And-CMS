<?php 
include ("../includes/ExecDB.php");
$exec = new ExecDB();

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		// query
		// SELECT
		$sql = "SELECT * FROM contact ORDER BY date DESC; ";
		echo $exec->select($sql);
		break;
}
?>