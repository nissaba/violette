<?php

$driver = new mysqli_driver();
$driver->report_mode = MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT;

function initieFacture($db, $empID, $numTable, $siege) {

    $sql = "insert into FACTURE (EMPLOYE_ID, NUMERO_TABLE, SIEGE) values(?,?,?);";

    try {
        $stmt = $db->prepare($sql);
        $stmt->bind_param("iii", $empID, $numTable, $siege);
        $stmt->execute();
        $id = mysqli_insert_id($db);
    } catch (mysqli_sql_exception $e) {
        return -1;
    }
    return $id;
}

function ajouterItems($db, $factureId, $dattaArray) {

    $query = "insert into LIGNE_COMMAND_ITEM (FACTURE_ID, MENU_ITEM_ID, QUANTITE) values(";

    try {
        foreach ($dattaArray as $item) {
            $query .= $factureId . ', ' . $item->menuItemId . ', ' . $item->quantite . '),(';
        }
        $query = substr($query, 0, -2);
        $query .= ";";

        $res = $db->query($query);
        if ($res) {
            $res = $db->affected_rows;
        } else {
            $res = 0;
        }
    } catch (mysqli_sql_exception $e) {
        return -1;
    }
    return $res;
}

function listeItemIdsFacture($db, $factureID, $xml) {
    $query = "Select ID from LIGNE_COMMAND_ITEM where FACTURE_ID = ?;";

    try {
        $stmt = $db->prepare($query);
        $stmt->bind_param('i', $factureID);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($id);
        $xml->startElement("contenue_facture");
        $xml->writeAttribute("facture_id", $factureID);
        while ($stmt->fetch()) {
            $xml->writeElement("id", $id);
        }
        $xml->endElement();
        $stmt->close();
    } catch (mysqli_sql_exception $e) {
        $xml->writeElement('database_error', $e->getMessage());
    }
}

function effacerFacture($db, $id) {    
    $query = 'DELETE FROM FACTURE WHERE FACTURE_ID = ?;';
    
    $res = 0;
    $stmt = $db->prepare($query);
    try {        
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res = $db->affected_rows;        
    } catch (mysqli_sql_exception $e) {
        $res = -1;
    }
    $stmt->close();
    return $res;
}

function effacerLigneCommandItem($db, $id) {    
    $query = 'DELETE FROM LIGNE_COMMAND_ITEM WHERE ID = ?;';
    
    $res = 0;
    $stmt = $db->prepare($query);
    try {        
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res = $db->affected_rows;        
    } catch (mysqli_sql_exception $e) {
        $res = -1;
    }
    $stmt->close();
    return $res;
}

function getDetailLigneCommande($db, $idArray, $xml) {
    $query = 'select ID, TITRE, QUANTITE, PRIX_UNITAIRE, (PRIX_UNITAIRE*QUANTITE)as ligne_total '
            . 'from LIGNE_COMMAND_ITEM '
            . 'inner join MENU_ITEM using(MENU_ITEM_ID) '
            . 'where ID in (';

    foreach ($idArray as $value) {
        $query .= $value . ',';
    }

    $query = $query = substr($query, 0, -1) . ');';    
    try {
        $res = $db->query($query);
        $xml->startElement('items');
        while ($row = $res->fetch_assoc()) {
            $xml->startElement('item');
            $xml->writeElement('id', $row['ID']);
            $xml->writeElement('titre', iconv("ISO-8859-1", "UTF-8",$row['TITRE']));
            $xml->writeElement('quantite', $row['QUANTITE']);
            $xml->writeElement('prix', number_format((float)$row['PRIX_UNITAIRE'], 2, ',', ' '));
            $xml->writeElement('total', number_format((float)$row['ligne_total'], 2, ',', ' '));
            $xml->endElement();
        }
        $xml->endElement();
        $res->close();
    } catch (mysqli_sql_exception $e) {
        $xml->writeElement('database_error', $e->getMessage());
    }
}

function getDetailFacture($db, $factureID, XMLWriter $xml) {
    $query = "select Concat(NOM, ' ', PRENOM)as employe_name, NUMERO_TABLE, "
            . "SIEGE, DATE, SOUS_TOTAL, TPS, TVQ, TOTAL "
            . "from FACTURE "
            . "inner join EMPLOYE using (EMPLOYE_ID) "
            . "where FACTURE_ID = ?;";

    try {
        $stmt = $db->prepare($query);
        $stmt->bind_param('i', $factureID);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $stmt->bind_result($nom, $numTable, $siege, $date, $sousTotal, $tps, $tvq, $total);
            $stmt->fetch();
            $xml->startElement("raport_facture");
            $xml->writeAttribute("facture_id", $factureID);
            $xml->writeElement("nom", iconv("ISO-8859-1", "UTF-8",$nom));
            $xml->writeElement('numero_table', $numTable);
            $xml->writeElement('siege', $siege);
            $xml->writeElement('date', $date);
            
            $ligneQuery = "select TITRE, QUANTITE, PRIX_UNITAIRE "
                    . "from LIGNE_COMMAND_ITEM "
                    . "inner join MENU_ITEM using(MENU_ITEM_ID) "
                    . "where FACTURE_ID = ?;";

            $ligne = $db->prepare($ligneQuery);
            $ligne->bind_param('i', $factureID);
            $ligne->execute();
            $ligne->store_result();
            if ($ligne->num_rows > 0) {
                $ligne->bind_result($titre, $quantite, $prix);
                $xml->startElement('items');
                while ($ligne->fetch()) {
                    $xml->startElement('item');
                    $xml->writeElement("titre", iconv("ISO-8859-1", "UTF-8",$titre));
                    $xml->writeElement('quantite', $quantite);
                    $xml->writeElement('prix', number_format((float)$prix, 2, ',', ' '));
                    $xml->writeElement("ligne_total", number_format((float)($prix * $quantite), 2, ',', ' '));
                    $xml->endElement();
                }
                $xml->endElement();
            }
            $ligne->close();
            $xml->writeElement('sous_total', $sousTotal);
            $xml->writeElement('tps', number_format((float)$tps, 2, ',', ' '));
            $xml->writeElement('tvq', number_format((float)$tvq, 2, ',', ' '));
            $xml->writeElement('total', number_format((float)$total, 2, ',', ' '));
            $xml->endElement();
        } else {
            $xml->writeElement('error', 'aucun résultat trouver pour facture id: ' . $factureID);
        }
        $stmt->close();
    } catch (mysqli_sql_exception $e) {
        $xml->writeElement('database_error', $e->
                        getMessage());
    }
}

function completeFacture($db, $factureID, $xml) {
    $query = 'update FACTURE set COMPLET = true '
            . 'where FACTURE_ID = ?;';
    
    $stmt = $db->prepare($query);
    try {        
        $stmt->bind_param('i', $factureID);
        $stmt->execute();
        $res = $db->affected_rows;
        $xml->writeElement('facture_complete', $res);        
    } catch (mysqli_sql_exception $e) {
        $xml->writeElement('database_error', $e->
                        getMessage());
    }
    $stmt->close();
}

function updateLigneCommandeItem($db, $items, $xml) {
    $query = 'update LIGNE_COMMAND_ITEM '
            . 'set QUANTITE = ? '
            . 'where ID = ?;';
    
    $stmt;
    foreach ($items as $item) {
        try {
            $stmt = $db->prepare($query);
            $stmt->bind_param('ii', $item->quantite, $item->id);
            $stmt->execute();
            $res = $db->affected_rows;
            $xml->startElement('update');
            $xml->writeAttribute('id', $item->id);
            $xml->text('réussi');
            $xml->endElement();
            $stmt->close(); 
        } catch (mysqli_sql_exception $ex) {
            $xml->startElement('update');
            $xml->writeAttribute('id', $item->id);
            $xml->text('Erreur: '. $ex->getMessage());
            $xml->endElement(); 
            $stmt->close();          
        }
    }
    
}

?>