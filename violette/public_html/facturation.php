<?php
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Credentials: true');
header('Content-type: text/xml');
include_once('config.php');
include_once('functions.php');
mb_internal_encoding('UTF-8');
setlocale(LC_CTYPE, 'fr_FR.UTF-8');

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
$xml->writeAttribute("action",$action);

//$xml->writeElement("base64_test_value", base64_encode('{"factureId":"1","employeId":"4","numeroTable":"2","siege":"1","factureIdBD":-1,"commandes":[{"ligneCommandes":[{"menuItemId":"27","quantite":"1"},{"menuItemId":"28","quantite":"1"},{"menuItemId":"21","quantite":"1"}]}]}'));
//$xml->writeElement("post_data", $_REQUEST['DATA']);
//$xml->writeElement("factureID", $data->factureid.'');

switch ($action) {
    case 'insertfacture':
        //Json data: ex {"employeId":"1", "numeroTable":"1","numeroTable":"1","siege":"1"}
        $res = initieFacture($dbConnection, $data->employeId, $data->numeroTable, $data->siege);
        $xml->writeElement("facture_id", $res);
        break;

    case 'factureAjouteItems':
        //jason data: ex: {"factureid":"1","ligneCommandItems":[{"menuItemId":"21", "quantite":"2"}, ... ,{"menuItemId":"34", "quantite":"1"}]}
        $res = ajouterItems($dbConnection, $data->factureid, $data->ligneCommandItems);
        $xml->writeElement("nombre_item_ajouter", $res);
        listeItemIdsFacture($dbConnection, $data->factureid, $xml);
        break;

    case 'effacerFacture':
        //jason data: {"le ID"}, ex: {"factureid":"1"}
        $res = effacerIdDansTable($dbConnection, 'FACTURE', $data->factureid);
        $xml->writeElement("facture_effacer", $res);
        break;

    case 'effacerLigneCMDITem':
        //jason data: {"le ID"}, ex: {"ID":"1"}
        $res = effacerIdDansTable($dbConnection, 'LIGNE_COMMAND_ITEM', $data->ID);
        $xml->writeElement("ligne_cmd_item_effacer", $res);
        break;

    case 'listLigneCMDItem':
        //json data ex: [{"1","2", ..., "n-1", "n"}] : n = id de la lignecommande
        getDetailLigneCommande($dbConnection, $data);
        break;

    case 'printFacture':
        //jason data: {"le ID"}, ex: {"factureid":"1"}
        //test data: http://violette.cabserver.net/facturation.php?ACTION=printFacture&DATA=eyJmYWN0dXJlaWQiOjJ9
        getDetailFacture($dbConnection, $data->factureid, $xml);
        break;
    
    case 'payeFacture':
        completeFacture($dbConnection, $data->factureid, $xml);
        break;
    
    case 'updateLigneCommandeItem':
        //json data ex: [{"id":1,"quantite":3},{"id":2,"quantite":4}, ..., {"id":n-1,"quantite":X}, {"id":n,"quantite":Y}]
        //test fail: http://violette.cabserver.net/facturation.php?ACTION=updateLigneCommandeItem&DATA=W3siaWQiOjEsInF1YW50aXRlIjozfSx7ImlkIjoyLCJxdWFudGl0ZSI6NH1d
        //test reussi: http://violette.cabserver.net/facturation.php?ACTION=updateLigneCommandeItem&DATA=W3siaWQiOjQxLCJxdWFudGl0ZSI6M30seyJpZCI6NDIsInF1YW50aXRlIjo0fV0=
        updateLigneCommandeItem($dbConnection, $data, $xml);
        break;
        
    default:
        $xml->writeElement("Commande_inconue", $action);
        break;
}
$dbConnection->close();
$xml->endElement();
$xml->flush();
?>