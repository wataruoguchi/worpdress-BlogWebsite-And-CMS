<?php 
require_once("../cms/lib/vendor/htmlpurifier/HTMLPurifier.standalone.php");
$purifier = new HTMLPurifier();

include ("../cms/includes/ExecDB.php");
$exec = new ExecDB();

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		// query
		// SELECT
		if(isset($_GET['postId']) && is_numeric($_GET['postId'])) {
			$postId = $purifier->purify(addslashes($_GET['postId']));
			$zeroPadPostId = str_pad($postId, 6, "0", STR_PAD_LEFT);

			$sql = "SELECT p.postId, p.replyId, p.header, p.body, p.views, p.updatedDate, "
			."p.path, length(p.path) - length(replace(p.path, '.', '')) -1 as level, u.displayName, "
			."u.URL, h.imageUrl FROM post p "
			."LEFT JOIN (SELECT postId, imageUrl FROM headerimage) h ON p.postId = h.postId "
			."LEFT JOIN (SELECT userId, displayName, URL FROM user) u ON p.authorId = u.userId "
			."WHERE p.postId = '".$postId."' OR p.path LIKE '".$zeroPadPostId.".%' "
			."AND ((p.replyId IS NULL AND p.isPublishedFlag = 1 AND p.isDeletedFlag = 0) "
			."OR (p.replyId IS NOT NULL AND p.isApprovedFlag = 1)) "
			."ORDER BY concat(p.path, LPAD(p.postId, 6, '0')) ";
			echo $exec->select($sql);
			break;
		} else {
			return;
		}
	case 'POST':
		$inputs = json_decode(file_get_contents('php://input'), true);
		$input = $inputs[0];
		
		$replyId = $purifier->purify(addslashes($input['replyId']));
		$name = $purifier->purify(addslashes($input['name']));
		$email = $purifier->purify(addslashes($input['email']));
		if(isset($input['url'])) {
			$url = $purifier->purify(addslashes($input['url']));
		}
		else {
			$url = null;
		}
		$message = $purifier->purify(addslashes($input['message']));

		$sql = "INSERT INTO user (`displayName`,`Email`,`URL`) VALUES ('".$name."','".$email."','".$url."') ";
		$exec->insert($sql);

		$authorId = mysqli_insert_id($exec->myDB->link);

		$sql = "INSERT INTO post (`replyId`,`path`,`body`,`authorId`) (SELECT postId, CASE WHEN path IS NULL THEN concat(LPAD(postId, 6, '0'),'.') WHEN path IS NOT NULL THEN concat(path,LPAD(postId, 6, '0'),'.') END, '".$message."', '".$authorId."' FROM post WHERE postId = '".$replyId."') ";
		$exec->insert($sql);
		break;
	case 'PUT':
		// UPDATE
		$postId = $purifier->purify(addslashes($_GET['postId']));

		$sql = "UPDATE post SET views = views + 1 WHERE postId='".$postId."' ";
		$exec->update($sql);
		break;
}
?>