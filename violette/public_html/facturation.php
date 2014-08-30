<?php
//header('Access-Control-Allow-Origin:*');
//header('Access-Control-Allow-Credentials: true');
header('Content-type: text/xml');
include_once('config.php');
include_once('functions.php');

$dbConnection = new mysqli($host, $database_user, $database_password, $database_name);
 
if($dbConnection->connect_errno){
    $xml = new XMLWriter();
    $xml->openURI("php://output");
    $xml->startDocument('1.0');
    $xml->setIndent(true);
    $xml->startElement('facturation');
    $xml->writeElement("error_code", "-1");
    $xml->endElement();
    $xml->flush();
    exit();
}
// Param "Le quoi", "Le comment", "Le Data".
// nouvel facture, mise a jour sur une facture, canceller une facture,
// ajouter un item, enlever un item, changer la quantiter d'un item

$action = $_REQUEST['ACTION']; 
$data = json_decode(base64_decode($_REQUEST['DATA']));
//$data = $tab_data[0];



$xml = new XMLWriter();
$xml->openURI("php://output");
$xml->startDocument('1.0');
$xml->setIndent(true);
$xml->startElement('facturation');
//$xml->writeElement("base64_test_value", base64_encode('{"factureId":"1","employeId":"4","numeroTable":"2","siege":"1","factureIdBD":-1,"commandes":[{"ligneCommandes":[{"menuItemId":"27","quantite":"1"},{"menuItemId":"28","quantite":"1"},{"menuItemId":"21","quantite":"1"}]}]}'));
//$xml->writeElement("action",$action);
//$xml->writeElement("post_data", $_REQUEST['DATA']);
//$xml->writeElement("factureID", $data->factureid.'');


if($action == 'insertfacture'){
  $res = initieFacture($dbConnection, $data->employeId, $data->numeroTable, $data->siege);
  $xml->writeElement("facture_id", $res);
}elseif($action == 'facutreAjouteItems'){
  $res = ajouterItems($dbConnection, $data->factureid, $data->ligneCommandItems);  
  $xml->writeElement("nombre_item_ajouter", $res);
}elseif($action == 'getinfo'){
    $res = selectData();
}
$xml->endElement();
$xml->flush();

?>