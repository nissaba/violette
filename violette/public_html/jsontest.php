<html>
    <header>
        
    </header>
    <body>
        <?php

$jfacture = '{"employeId":4, "numeroTable":3, "siege":2}';
$jcommande = '[{"menuItemId":21, "quantite":2},{"menuItemId":3, "quantite":1},{"menuItemId":32, "quantite":3},{"menuItemId":34, "quantite":1}]';

$result = json_decode($jfacture);
$tabItems = json_decode($jcommande);

echo 'Facture:<br>';
echo "Employe ID = " . $result->employeId ."<br>";
echo "Numero Table = ". $result->numeroTable ."<br>";
echo "Siege = ". $result->siege ."<br>";

echo 'Items:<br>';
foreach ($tabItems as $item) {
    echo '<p>';
    echo 'Item ID = '. $item->menuItemId.'<br>';
    echo 'Quantite = '.$item->quantite.'<br>';
    echo '</p>';
}
?>
    </body>
</html>
