<?php 
require_once("../cms/lib/vendor/htmlpurifier/HTMLPurifier.standalone.php");
$purifier = new HTMLPurifier();

include ("../cms/includes/ExecDB.php");
$exec = new ExecDB();

switch ($_SERVER['REQUEST_METHOD']) {
	case 'POST':
		$inputs = json_decode(file_get_contents('php://input'), true);
		$input = $inputs[0];
		
		$name = $purifier->purify(addslashes($input['name']));
		$email = $purifier->purify(addslashes($input['email']));
		$message = $purifier->purify(addslashes($input['message']));

		$sql = "INSERT INTO contact (`name`,`email`,`message`) VALUES ('".$name."','".$email."','".$message."') ";
		$exec->insert($sql);
		break;
}
?>