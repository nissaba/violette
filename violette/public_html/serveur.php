<?php
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Credentials: true');
header('Content-type: text/xml');
include_once("config.php");
include_once 'functions.php';

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
// Param "Le quoi", "Le comment", "Le Data".

$action = $_POST['ACTION'];
$res;

if($action == 'insert'){
  $res = inserData();
}else if($action == 'update'){
  $res = updateData();  
}else if($action == 'getinfo'){
    $res = selectData();
}

sendDataFromResult($res,);

?>