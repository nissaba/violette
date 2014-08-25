<?php
header('Content-type: text/xml');
include_once("config.php");

 
$dbConnection = new mysqli($host, $database_user, $database_password, $database_name);
 
if($dbConnection->connect_errno){
    $xml = new XMLWriter();
    $xml->openURI("php://output");
    $xml->startDocument('1.0');
    $xml->setIndent(true);
    $xml->startElement('login');
    $xml->writeElement("erreur_code", "-1");
    $xml->endElement();
    $xml->flush();
    exit();
}
 
$user = @$_POST['user'];
$passwd = @$_POST['passwd'];
 
$query = "SELECT EMPLOYE_ID, FONCTION_ID FROM EMPLOYE WHERE USERNAME = ? AND PASSWORD = ?;";

$stmt = $dbConnection->prepare($query);
$stmt->bind_param("ss", $user, $passwd);
$stmt->execute();
$stmt->bind_result($empID, $foncID);
$stmt->fetch();

$xml = new XMLWriter();
$xml->openURI("php://output");
$xml->startDocument('1.0');
$xml->setIndent(true);
$xml->startElement('login');

if($stmt->num_rows > 0){
 //le login est bon  
 //envoyer la reponse employe_id et fonction_id 
    $xml->writeElement("result_code", "1");
    $xml->writeElement("employe_id", $empID);
    $xml->writeElement("fonction_id",$foncID); 
}else{
    //login rejeter 
    $xml->writeElement("result_code", "0");
    $xml->writeElement("user", $user);
    $xml->writeElement("passwd",$passwd);
    $xml->writeElement("employe_id", $empID);
    $xml->writeElement("fonction_id",$foncID); 
}

$xml->endElement();
$xml->flush();
$stmt->close();
?>
