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

function listeItemIdsFacture($db, $factureID, $xml) {
    $query = "Select ID from LIGNE_COMMAND_ITEM where FACTURE_ID = ?;";
    $stmt = $db->prepare($query);
    $stmt->bind_param('i', $factureID);
    $stmt->execute();
    $stmt->bind_result($id);
    $xml->startElement("contenue_facture");
    $xml->writeAttribute("facture_id", $factureID);
    while ($stmt->fetch()){
        $xml->writeElement("id", $id);
    }
    $xml->endElement();
}

function effacerIdDansTable($db, $table, $id) {
    $query = "delete from ? where FACTURE_ID = ?;";
    $stmt = $db->prepare($query);
    $stmt->bind_param('si', $table, $id);
    $stmt-execute();
    $res = $db->affected_rows;
    return $res;   
}

function listIdTable($db, $table, $id) {
    
}

function functionName($param) {
    
}
?>