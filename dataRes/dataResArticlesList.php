<?php 
include ("../cms/includes/ExecDB.php");
$exec = new ExecDB();

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		// query
		// SELECT
		$sql = "SELECT p.postId, p.header, p.body, p.views, p.updatedDate, u.displayName, h.imageUrl FROM post p "
		."LEFT JOIN (SELECT postId, imageUrl FROM headerimage) h ON p.postId = h.postId "
		."LEFT JOIN (SELECT userId, displayName FROM user) u ON p.authorId = u.userId "
		."WHERE p.replyId IS NULL AND p.isPublishedFlag = 1 "
		."ORDER BY p.updatedDate DESC ";
		echo $exec->select($sql);
		break;
}
?>