<?php
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Credentials: true');
header('Content-type: text/xml');
include_once("config.php");
mb_internal_encoding('UTF-8');
setlocale(LC_CTYPE, 'fr_FR.UTF-8');

$dbConnection = new mysqli($host, $database_user, $database_password, $database_name);
 
if($dbConnection->connect_errno){
    //gerer erreur
    exit();
}

$sql_section = "select * from SECTION;";
$sql_menu_item = "select MENU_ITEM_ID, TITRE, DESCRIPTION, PRIX from MENU_ITEM where section_id = ?";

$res = $dbConnection->query($sql_section);

$xml = new XMLWriter();
$xml->openURI("php://output");
$xml->startDocument('1.0', "UTF-8");
$xml->setIndent(true);
$xml->startElement('menu');

while($row = $res->fetch_assoc()){
    $xml->startElement('section');
    @$xml->writeAttribute('nom', iconv("ISO-8859-1", "UTF-8",$row['TITRE']));    
    
    
    $stmt = $dbConnection->prepare($sql_menu_item);
    $stmt->bind_param("s", $row['SECTION_ID']);
    $stmt->execute();
    $stmt->bind_result($menuItemID, $titre, $description, $prix);
        
    while($stmt->fetch()){
        $xml->startElement('item');
            $xml->writeElement("id", $menuItemID);
            $xml->writeElement("titre", iconv("ISO-8859-1", "UTF-8",$titre));
            $xml->writeElement("description", iconv("ISO-8859-1", "UTF-8", $description));
            $xml->writeElement("prix", $prix);        
        $xml->endElement();
    }
    $xml->endElement();
}

$xml->endElement();
//header('Content-type: text/xml');
$xml->flush();
$stmt->close();
?>