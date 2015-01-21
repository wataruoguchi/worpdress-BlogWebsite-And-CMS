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
			$postId = $purifier->purify(addslashes($_GET['postId']));
			$sql = "SELECT p.*, imageUrl FROM post p "
			."LEFT JOIN (SELECT postId, imageUrl FROM headerimage) hi ON p.postId = hi.postId "
			."WHERE p.postId = '".$postId."' ";
			echo $exec->select($sql);		
		} else {
			// INSERT
			$userId = $purifier->purify(addslashes($_GET['userId']));
			$sql = "INSERT INTO post (`authorId`,`updatedDate`) VALUES ('".$userId."',now())";	//inser default record
			$exec->insert($sql);

			// SELECT
			$postId = mysqli_insert_id($exec->myDB->link);
			$sql = "SELECT p.*, imageUrl FROM post p "
			."LEFT JOIN (SELECT postId, imageUrl FROM headerimage) hi ON p.postId = hi.postId "
			."WHERE p.postId = '".$postId."' ";
			echo $exec->select($sql);
		}
		break;
	case 'PUT':
		// UPDATE
		$input = json_decode(file_get_contents('php://input'), true);
		$header = $purifier->purify(addslashes($input['header']));
		$body = $purifier->purify(addslashes($input['body']));
		$postId = $purifier->purify(addslashes($input['postId']));
		$isPublishedFlag = $purifier->purify(addslashes($input['isPublishedFlag']));
		$sql = "UPDATE post SET header = '".$header."', body = '".$body
		."', isPublishedFlag = ".$isPublishedFlag
		.", isDeletedFlag = 0 "
		.", updatedDate = NOW() WHERE postId='".$postId."';";
		$exec->update($sql);
		break;
	case 'DELETE':
		// DELETE
		$postId = $purifier->purify(addslashes($_GET['postId']));
		$sql = "UPDATE post SET isDeletedFlag = true WHERE postId=".$postId;
		$exec->delete($sql);
		break;
}
?>