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
		$sql = "SELECT * FROM tag WHERE userId = '".$userId."' ORDER BY tagId DESC ";
		echo $exec->select($sql);
		break;
	case 'POST':
		// INSERT
		$name = $purifier->purify(addslashes($_GET['tagName']));
		$description = $purifier->purify(addslashes($_GET['description']));
		$userId = $purifier->purify(addslashes($_GET['userId']));
		$sql = "INSERT INTO tag (`tagName`,`description`,`userId`) "
		." VALUES ('".$name."','".$description."','".$userId."') ";
		$exec->insert($sql);
		break;
	case 'PUT':
		// UPDATE
		$name = $purifier->purify(addslashes($_GET['tagName']));
		$description = $purifier->purify(addslashes($_GET['description']));
		$tagId = $purifier->purify(addslashes($_GET['tagId']));
		$sql = "UPDATE tag SET tagName='".$name
		."', description='".$description."' WHERE tagId='".$tagId."';";
		$exec->update($sql);
		break;
	case 'DELETE':
		// DELETE
		$tagId = $purifier->purify(addslashes($_GET['tagId']));
		$sql = "DELETE FROM tag WHERE tagId='".$tagId."'";
		$exec->delete($sql);
		$sql = "DELETE FROM posttag WHERE tagId='".$tagId."'";
		$exec->delete($sql);
		break;
}
?>