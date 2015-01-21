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
		$sql = "SELECT * FROM post WHERE replyId IS NULL AND header IS NOT NULL AND authorId = '".$userId."' ORDER BY updatedDate DESC";
		echo $exec->select($sql);
		break;
	case 'DELETE':
		// DELETE
		$postId = $purifier->purify(addslashes($_GET['postId']));
		$sql = "DELETE FROM post WHERE postId='".$postId."' AND isDeletedFlag = true;";
		$exec->delete($sql);
		$sql = "DELETE FROM posttag WHERE postId NOT IN (SELECT postId FROM post); ";
		$exec->delete($sql);
		$sql = "UPDATE post SET isDeletedFlag = true WHERE postId='".$postId."';";
		$exec->update($sql);
		break;
}
?>