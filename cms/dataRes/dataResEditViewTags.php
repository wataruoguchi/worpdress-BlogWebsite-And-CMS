<?php 
require_once("../lib/vendor/htmlpurifier/HTMLPurifier.standalone.php");
$purifier = new HTMLPurifier();

include ("../includes/ExecDB.php");
$exec = new ExecDB();

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		// query
		// SELECT
		if(isset($_GET['postId'])) {
			//get selected record
			$postId = $purifier->purify(addslashes($_GET['postId']));
			$sql = "SELECT tagId,tagName as text FROM tag "
			."WHERE tagId IN (SELECT tagId FROM posttag WHERE postId = '".$postId."')";
			echo $exec->select($sql);
		}
		break;
	case 'POST':
		//TODO: transaction manage
		// INSERT
		// 1. delete posttag where postid = :postid
		$postId = $purifier->purify(addslashes($_GET['postId']));
		$sql = "DELETE FROM posttag WHERE postId = '".$postId."'";
		$exec->delete($sql);

		// 2. insert into tag
		$inputs = json_decode(file_get_contents('php://input'), true);
		$tagNames = "";
		foreach ($inputs as $record) {
			$tagText = $purifier->purify(addslashes($record['text']));
			$userId = $purifier->purify(addslashes($_GET['userId']));
			$sql = "SELECT tagId FROM tag WHERE userId = '".$userId."' AND tagName = '".$tagText."'";
			$selectedData = json_decode($exec->select($sql));
			if(count($selectedData) === 0) {
				$userId = $purifier->purify(addslashes($_GET['userId']));
				$sql = "INSERT INTO tag (`tagName`, `userId`) VALUES('".$tagText."', '".$userId."');";
				$exec->insert($sql);
			}
			$tagNames .= "'".$tagText."',";
			$selectedData = null;
		}

		// 3. insert into posttag
		if(strlen($tagNames) > 0) {
			//remove an extra comma
			$userId = $purifier->purify(addslashes($_GET['userId']));
			$postId = $purifier->purify(addslashes($_GET['postId']));
			$tagNames = substr($tagNames, 0,strlen($tagNames)-1);
			$sql = "INSERT INTO posttag (`tagId`,`postId`) SELECT tagId, '"
			.$postId."' AS postId FROM tag WHERE tagName IN ("
			.$tagNames.") AND userId = '".$userId."'";
			$exec->insert($sql);
		}
		break;
	case 'DELETE':
		// DELETE
		$postId = $purifier->purify(addslashes($_GET['postId']));
		$sql = "UPDATE post SET isDeletedFlag = true WHERE postId=".$postId;
		$exec->delete($sql);
		break;
}
?>