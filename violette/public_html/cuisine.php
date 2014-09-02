<?php

//header('Access-Control-Allow-Origin:*');
//header('Access-Control-Allow-Credentials: true');
header('Content-type: text/xml');
include_once('config.php');
include_once('functions.php');

$dbConnection = new mysqli($host, $database_user, $database_password, $database_name);

if ($dbConnection->connect_errno) {
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

$action = $_REQUEST['ACTION'];
$data = json_decode(base64_decode($_REQUEST['DATA']));

$xml = new XMLWriter();
$xml->openURI("php://output");
$xml->startDocument('1.0');
$xml->setIndent(true);
$xml->startElement('cuisine');
$xml->writeAttribute("action", $action);


switch ($action) {
    case 'ligneCommandeAFaire':

        break;

    case 'priseEnChargeFacture':

        break;

    case 'ligneCommandePrete':

        break;

    default:
        $xml->writeElement("Commande_inconue", $action);
        break;
}

$dbConnection->close();
$xml->endElement();
$xml->flush();
?>