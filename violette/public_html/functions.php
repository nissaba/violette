<?php

function initieFacture($db, $empID, $numTable, $siege){
    $db->pre
    return 1;
}

function updateData($param){
    
}

function selectData($param) {
    
}

function insertCursorToXML($res) {
    $xml = new XMLWriter();
    $xml->openMemory();
    $xml->startDocument('1.0');
    $xml->setIndent(true);
    $xml->startElement('login');
    
     $xml->endElement();
     return $xml->outputMemory();
}

function sendDataFromResult($res) {
    $xml = new XMLWriter();
    $xml->openURI("php://output");
    $xml->startDocument('1.0');
    $xml->setIndent(true);
    $xml->startElement('login');
    
    
    foreach($result_array as $key => $value)
    {
        $xml->writeElement("$key", $value);      
    }
    $xml->endElement();
}

?>