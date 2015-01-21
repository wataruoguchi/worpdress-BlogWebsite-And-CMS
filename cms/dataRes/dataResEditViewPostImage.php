<?php 
/*
http://www.sitepoint.com/html5-ajax-file-upload/
http://stackoverflow.com/questions/13771777/javascript-objects-xmlhttprequest-setrequestheader-method-doesnt-work
*/
require_once("../lib/vendor/htmlpurifier/HTMLPurifier.standalone.php");
$purifier = new HTMLPurifier();

include ("../includes/ExecDB.php");
$exec = new ExecDB();

//if there is a new photo successfully uploaded
$fileName = (isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false);
if ($fileName) {
	//AJAX call

	$prefixDate = date("dmYGHis");
	$filePath = "./img/" . $prefixDate . $fileName.".jpg";
	file_put_contents("../" . $filePath, 
		file_get_contents('php://input')
	);

	$postId = $purifier->purify(addslashes($_SERVER['HTTP_POSTID']));

	//get old file
	$sql_getOldData = "SELECT postId, imageUrl FROM headerimage WHERE `postId` = '" . $postId."' ";
	$result = $exec->select($sql_getOldData);
	$data = json_decode($result);
	
	if (count($data) > 0) {
		//delete old data
		$deleteOldDataSql = "DELETE FROM headerimage WHERE `postId` = '" . $postId."' ";
		$exec->delete($deleteOldDataSql);

		//delete old image
		//TODO: Warning: unlink(./): Permission denied
		unlink("../" . $data[0]['imageUrl']);
	}

	//insert
	$insertSql = "INSERT INTO headerimage (`postId`,`imageUrl`) VALUES ('".$postId."','".$filePath."') ";
	$exec->insert($insertSql);

	exit();
} else {
	echo '<script>console.log("server is connected, but file is not uploaded")</script>';
}
?>