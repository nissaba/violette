<?php
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Credentials: true');
header('Content-type: text/xml');
include_once("config.php");


 
$dbConnection = new mysqli($host, $database_user, $database_password, $database_name);
 
if($dbConnection->connect_errno){
    //gerer erreur
    exit();
}
 
$user = @$_POST['user'];
$passwd = @$_POST['passwd'];
 
$query = "SELECT EMPLOYE_ID, FONCTION_ID FROM EMPLOYE WHERE USERNAME = ? AND PASSWORD = ?;";

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
    $xml->writeElement("user", $user);
    $xml->writeElement("passwd",$passwd);
    $xml->writeElement("employe_id", $row['EMPLOYE_ID']);
    $xml->writeElement("fonction_id",$row['FONCTION_ID']);
}
$xml->endElement();
$xml->flush();
?>
