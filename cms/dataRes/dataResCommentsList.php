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
		$sql = "SELECT rootId, p.postId, title, inResponse, body, isApprovedFlag, isSpamFlag, displayName, userEmail, userUrl, updatedDate FROM post p 
		INNER JOIN (SELECT postId FROM post WHERE authorId = '".$userId."') articles on SUBSTRING_INDEX(TRIM(LEADING '0' FROM p.path),'.',1) = articles.postId 
		LEFT JOIN (SELECT postId AS rootId, header AS title, body as inResponse FROM post) root ON p.replyId = root.rootId 
		LEFT JOIN (SELECT userId, displayName, Email AS userEmail, URL AS userUrl FROM user) u ON p.authorId = u.userId ";
		echo $exec->select($sql);
		break;
	case 'PUT':
		// UPDATE
		$applovedFlag = $purifier->purify(addslashes($_GET['apF']));
		$spamFlag = $purifier->purify(addslashes($_GET['spF']));
		$postId = $purifier->purify(addslashes($_GET['postId']));
		$sql = "UPDATE post SET isApprovedFlag='".$applovedFlag
		."', isSpamFlag='".$spamFlag."' WHERE postId='".$postId."' ";
		$exec->update($sql);
		break;
}
?>