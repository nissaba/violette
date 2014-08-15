<?php

include_once("config.php");


$dbConnection = new mysqli($host, $database_user, $database_password, $database_name);
 
if($dbConnection->connect_errno){
    //gerer erreur
    exit();
}

$sql_section = "select * from SECTION;";
$sql_menu_item = "select * from MENU_ITEM where section_id = ?";

$res = $dbConnection->query($sql_section);

$xml = new XMLWriter();
$xml->openURI("php://output");
$xml->startDocument('1.0', "UTF-8");
$xml->setIndent(true);
$xml->startElement('menu');

while($row = $res->fetch_assoc()){
    $xml->startElement('section');
    @$xml->writeAttribute('nom', $row['TITRE']);    
    
    
    $stmt = $dbConnection->prepare($sql_menu_item);
    $stmt->bind_param("s", $row['SECTION_ID']);
    $stmt->execute();
    $resMenuItem = $stmt->get_result();
    $stmt->close();
        
    while($rowMenuItem = $resMenuItem->fetch_assoc()){
        $xml->startElement('item');
            $xml->writeElement("id", $rowMenuItem['MENU_ITEM_ID']);
            $xml->writeElement("titre", $rowMenuItem['TITRE']);
            $xml->writeElement("description", $rowMenuItem['DESCRIPTION']);
            $xml->writeElement("prix", $rowMenuItem['PRIX']);        
        $xml->endElement();
    }
    $xml->endElement();
}

$xml->endElement();
//header('Content-type: text/xml');
$xml->flush();

$res->close();
?>