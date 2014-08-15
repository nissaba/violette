<?php

include_once("config.php");

//$host = "sql3.freemysqlhosting.net";
//$database_name = "sql348994";
//$database_user = "sql348994";
//$database_password = "xZ6*uK6!";
//$port_number = "3306";
 
$dbConnection = new mysqli($host, $database_user, $database_password, $database_name);
 
if($dbConnection->connect_errno){
    //gerer erreur
    exit();
}
 
$user = @$_REQUEST['user'];
$passwd = sha1(@$_REQUEST['passwd']);
 
$query = "SELECT EMPLOYE_ID, FONCTION_ID FROM EMPLOYE WHERE NOM = ? AND PASSWORD = ?;";

$stmt = $dbConnection->prepare($query);
$stmt->bind_param("ss", $user, $passwd);
$stmt->execute();
$res = $stmt->get_result();
$stmt->close();
$row = $res->fetch_assoc();

$xml = new XMLWriter();

$xml->openURI("php://output");
$xml->startDocument('1.0');

$xml->setIndent(true);
$xml->startElement('login');

if($res->num_rows > 0){
 //le login est bon  
 //envoyer la reponse employe_id et fonction_id 
    $xml->writeElement("result_code", "1");
    $xml->writeElement("employe_id", $row['EMPLOYE_ID']);
    $xml->writeElement("fonction_id",$row['FONCTION_ID']); 
}else{
    //login rejeter 
    $xml->writeElement("result_code", "0");
}
$xml->endElement();
header('Content-type: text/xml');
$xml->flush();
?>