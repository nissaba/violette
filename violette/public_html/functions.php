<?php

function initieFacture($db, $empID, $numTable, $siege){
    
    $sql = "insert into FACTURE (EMPLOYE_ID, NUMERO_TABLE, SIEGE) values(?,?,?);";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("iii", $empID, $numTable, $siege);
    $stmt->execute();
    $id = mysqli_insert_id($db);
    return $id;
}

function ajouterItems($db, $factureId, $dattaArray ){
    
    $query = "insert into LIGNE_COMMAND_ITEM (FACTURE_ID, MENU_ITEM_ID, QUANTITE) values(";
    foreach ($dattaArray as $item) {
        $query .= $factureId . ', ' .$item->menuItemId . ', '. $item->quantite .'),(';
    }
    $query = substr($query, 0, -2);
    $query .= ";";
    
    $res = $db->query($query);
    if ($res){
        $res = $db->affected_rows;
    }else{
        $res = 0;
    }
    return $res;
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