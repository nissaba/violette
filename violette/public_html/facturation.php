<?php
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Credentials: true');
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

$action = $_POST['ACTION']; $employeID = $_POST['employe_id'];
$factureID = $_POST['facture_id'];
$numTable = $_POST['num_table'];
$siege = $_POST['siege'];
$complet = $_POST['complet'];
$itemID =  $_POST['item_id'];
$qteItem = $_POST['qte_item'];
$noteItem = $_POST['note_item'];
$prixUnitaireItem = $_POST['prix_unitaire_item'];
$servi = $_POST['servi'];
$priseEnCharge = $_POST['charge'];

$res;

if($action == 'insert'){
  $res = inserData();
}else if($action == 'update'){
  $res = updateData();  
}else if($action == 'getinfo'){
    $res = selectData();
}



?>