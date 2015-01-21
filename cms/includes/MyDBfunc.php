<?php
/**
* based on mydb-functions.php by Ali's class
*/
include ("MyDBConfig.php");
class MyDBfunc
{
    public $link;

    public function __construct() {
        $config = new MyDBConfig();
        $this->link = mysqli_connect($config::DBHOST, $config::DBUSER, $config::DBPASS);

        if ($this->link === false) {
            die("Couldn't connect to db");
        }

        if (!mysqli_select_db($this->link, $config::DBNAME)) {
            die("Couldn't select db");
        }
        return true;
    }

    public function query($sql)
    {
        $result = mysqli_query($this->link, $sql);
        return $result;
    }
}

?>