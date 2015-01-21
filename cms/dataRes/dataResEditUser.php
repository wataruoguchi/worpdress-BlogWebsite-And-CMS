<?php 
require_once("../lib/vendor/htmlpurifier/HTMLPurifier.standalone.php");
$purifier = new HTMLPurifier();

include ("../includes/ExecDB.php");
$exec = new ExecDB();

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		// query
		// SELECT
		if(isset($_GET['userId'])) {
			$userId = $purifier->purify(addslashes($_GET['userId']));
			//get selected record
			$sql = "SELECT * FROM user WHERE userId = '".$userId."'";
			echo $exec->select($sql);
		} else {
			// INSERT
			$sql = "INSERT INTO user (`RoleId`) VALUES ('2')";	//inser default record
			$exec->insert($sql);

			$userId = mysqli_insert_id($exec->myDB->link);
			$sql = "SELECT * FROM user WHERE userId = '".$userId."'";
			echo $exec->select($sql);
		}
		break;
	case 'PUT':
		// UPDATE
		$input = json_decode(file_get_contents('php://input'), true);
		$displayName = $purifier->purify(addslashes($input['displayName']));
		$userName = $purifier->purify(addslashes($input['userName']));
		$email = $purifier->purify(addslashes($input['Email']));
		$url = $purifier->purify(addslashes($input['URL']));
		$password = $purifier->purify(addslashes($input['password']));
		$isDeletedFlag = $purifier->purify(addslashes($input['isDeletedFlag']));
		$RoleId = $purifier->purify(addslashes($input['RoleId']));
		$userId = $purifier->purify(addslashes($input['userId']));
		$sql = "UPDATE user SET displayName = '".$displayName."', userName = '".$userName
		."', Email = '".$email."', URL = '".$url
		."', password = '".$password."', isDeletedFlag = '".$isDeletedFlag
		."', RoleId = '".$RoleId."' "
		."WHERE userId='".$userId."';";
		$exec->update($sql);
		break;
}
?>