<?php
foreach($_GET as $k=>$v){if(is_array($v)){die();}else{$v=mysql_real_escape_string($v);$_GET[$k]=$v;}}
//mysql
mysql_connect("localhost","root","");
mysql_select_db("test");
$table="server2";
$salt=$_SERVER["SERVER_SOFTWARE"];
/*
Table:
CREATE TABLE `server2` (
  `id` int(11) NOT NULL auto_increment,
  `key` text NOT NULL,
  `update` text NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
*/

if(isset($_GET["act"]) and $_GET["act"]=="set"){
	header("Content-type: text/javascript");
	$q=mysql_query("SELECT * FROM `".$table."` WHERE `key`='".$_GET["key"]."'");
	$row = mysql_fetch_array($q, MYSQL_NUM);
	if(isset($row[2])){
		$v=$_GET["value"]; $v=str_replace("\r","",$v); $v=str_replace("\n","",$v);
		$q=mysql_query("UPDATE `".$table."` SET `value`='".trim($v)."', `update`='".time()."' WHERE `key`='".$_GET["key"]."'") or die(mysql_error());
		echo "utils.backup_server2('done','');";
	}else{echo "alert('Check you server key!');";}
}elseif(isset($_GET["act"]) and $_GET["act"]=="get"){
	header("Content-type: text/javascript");
	$q=mysql_query("SELECT * FROM `".$table."` WHERE `key`='".$_GET["key"]."'");
	$row = mysql_fetch_array($q, MYSQL_NUM);
	if(isset($row[3])){echo "utils.backup_server2('get','".$row[3]."');";}
}else{
if(isset($_GET["nick"]) and !is_array($_GET["nick"])){
		$key=md5($_GET["nick"].base64_encode($salt));
		echo "Your key: <b>".$key."</b><br />";
		$q=mysql_query("SELECT * FROM `".$table."` WHERE `key`='".$key."'");
		$row = mysql_fetch_array($q, MYSQL_NUM);
		if(!isset($row[2])){mysql_query("INSERT INTO `".$table."` VALUES(null,'$key',".time().",'');") or die(mysql_error());}
	}else{
		echo "<form method='GET'>Nickname:<input type='text' name='nick'/><br /><input type='submit' value='Get Key'></form>";
	}
}
?>