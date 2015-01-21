<?php 
/**
* execute SQL query
*/
include ("MyDBfunc.php");

class ExecDB
{
	public $myDB;

	public function __construct()
	{
		$this->myDB = new myDBfunc();
	}

	//Execute select query
	public function select($sql)
	{
		$result = $this->myDB->query($sql);
		$arrayResult = array();
		if($result == FALSE) {
			echo "select DB error";
		}
		else {
			while ($row=mysqli_fetch_array($result)) {
				$arrayResult[]=$row;
			}
			//$arrayResult = mysqli_fetch_all($result, MYSQLI_ASSOC);
		}
		return $json_response=json_encode($arrayResult,JSON_NUMERIC_CHECK);
	}

	//Execute insert query
	public function insert($sql)
	{
		$result = $this->myDB->query($sql);
		if($result) {
			$result = TRUE;
		} else {
			$result = FALSE;
		}
		return $result;
	}

	//Execute update query
	public function update($sql)
	{
		$result = $this->myDB->query($sql);
		if($result) {
			$result = TRUE;
		} else {
			$result = FALSE;
		}
		return $result;
	}

	//Execute delete query
	public function delete($sql)
	{
		$result = $this->myDB->query($sql);
		if($result) {
			$result = TRUE;
		} else {
			$result = FALSE;
		}
		return $result;
	}
}
?>