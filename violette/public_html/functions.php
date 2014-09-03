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

function effacerIdDansTable($db, $table, $id) {
    $query = "delete from ? where FACTURE_ID = ?;";

    try {
        $stmt = $db->prepare($query);
        $stmt->bind_param('si', $table, $id);
        $stmt - execute();
        $res = $db->affected_rows;
        $stmt->close();
    } catch (mysqli_sql_exception $e) {
        return -1;
    }
    return $res;
}

function getDetailLigneCommande($db, $idArray, $xml) {
    $query = 'select TITRE, QUANTITE, PRIX_UNITAIRE, (PRIX_UNITAIRE*QUANTITE)as ligne_total '
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
            $xml->writeElement('titre', $row['TITRE']);
            $xml->writeElement('quantite', $row['QUANTITE']);
            $xml->writeElement('prix', $row['PRIX_UNITAIRE']);
            $xml->writeElement('total', $row['ligne_total']);
            $xml->endElement();
        }
        $xml->endElement();
        mysqli_close($res);
    } catch (mysqli_sql_exception $e) {
        $xml->writeElement('database_error', $e->getMessage());
    }
}

function getDetailFacture($db, $factureID, $xml) {
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
            $xml->writeElement("nom", $nom);
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
                    $xml->writeElement("titre", $titre);
                    $xml->writeElement('quantite', $quantite);
                    $xml->writeElement('prix', $prix);
                    $xml->writeElement("ligne_total", $prix * $quantite);
                    $xml->endElement();
                }
                $xml->endElement();
            }
            $ligne->close();
            $xml->writeElement('sous_total', $sousTotal);
            $xml->writeElement('tps', $tps);
            $xml->writeElement('tvq', $tvq);
            $xml->writeElement('total', $total);
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
    $query = 'update FACTURE set COMPLET = ? '
            . 'where FACTURE_ID = ?;';

    try {
        $stmt = $db->prepare($query);
        $stmt->bind_param('si', 'true', $factureID);
        $stmt->execute();
        $res = $db->affected_rows;
        $xml->writeElement('facture_complete', $res);
        $stmt->close();
    } catch (mysqli_sql_exception $e) {
        $xml->writeElement('database_error', $e->
                        getMessage());
    }
}

function updateLigneCommandeItem($db, $items, $xml) {
    $query = 'update LIGNE_COMMAND_ITEM '
            . 'set QUANTITE = ? '
            . 'where ID = ?;';

    foreach ($items as $item) {
        try {
            $stmt = $db->prepare($query);
            $stmt->bind_param('ii', $item->id, $item->quantite);
            $stmt->execute();
            $res = $db->affected_rows;
            $xml->startElement('update');
            $xml->writeAttribute('id, $item-id');
            $xml->text('réussi');
            $xml->endElement();
        } catch (mysqli_sql_exception $ex) {
            $xml->writeElement('database_error', 'Can not update row id: ' . $item->id . ' error: ' . $e->getMessage());
        }
    }
}

?>