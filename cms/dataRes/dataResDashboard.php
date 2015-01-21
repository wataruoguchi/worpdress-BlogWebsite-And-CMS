<?php
require_once("../lib/vendor/htmlpurifier/HTMLPurifier.standalone.php");
$purifier = new HTMLPurifier();

include ("../includes/ExecDB.php");
$exec = new ExecDB();

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		// query
		// DELETE GARBAGE
		$userId = $purifier->purify(addslashes($_GET['userId']));
		$sql = "DELETE FROM post WHERE replyId IS NULL AND header IS NULL AND authorId = '".$userId."' ";
		$exec->delete($sql);

		// SELECT
		$sql = "SELECT q0.authorId AS authorId,pTotal,pPublished,cTotal,cApproved FROM (SELECT '"
				.$userId."' AS authorId FROM DUAL) q0 "
				."LEFT JOIN (SELECT count(*) AS pTotal, authorId from post "
				."WHERE replyId IS NULL AND header IS NOT NULL AND isDeletedFlag != 1 AND authorId = '"
				.$userId."') q1 ON q0.authorId = q1.authorId "
				."LEFT JOIN (SELECT count(*) AS pPublished, authorId from post "
				."WHERE replyId IS NULL AND header IS NOT NULL AND isDeletedFlag != 1 AND isPublishedFlag = 1 AND authorId = '"
				.$userId."') q2 ON q0.authorId = q2.authorId "
				."LEFT JOIN (SELECT count(*) AS cTotal, root.authorId FROM post p "
				."INNER JOIN (SELECT authorId, postId AS rootId, header AS title FROM post "
				."WHERE authorId = '".$userId."') root ON SUBSTRING_INDEX(TRIM(LEADING '0' FROM p.path),'.',1) = root.rootId "
				."WHERE isSpamFlag != 1) q3 ON q0.authorId = q3.authorId "
				."LEFT JOIN (SELECT count(*) AS cApproved, root.authorId FROM post p "
				."INNER JOIN (SELECT authorId, postId AS rootId, header AS title FROM post "
				."WHERE authorId = '".$userId."') root "
				."ON SUBSTRING_INDEX(TRIM(LEADING '0' FROM p.path),'.',1) = root.rootId WHERE isSpamFlag != 1 AND isApprovedFlag = 1 "
				.") q4 ON q0.authorId = q4.authorId ";
		echo $exec->select($sql);
		break;
}
?>