
<?php

$host = "sql3.freemysqlhosting.net";
$database_name = "sql348994";
$database_user = "sql348994";
$database_password = "xZ6*uK6!";
$port_number = "3306";
 
$dbConnection = new mysqli($host, $database_user, $database_password, $database_name);
 
if($dbConnection->connect_errno){
    //gerer erreur
    exit();
}
 
$user = $POST['user'];
$passwd = sha1($POST['passwd']);
 
$query = "SELECT EMPLOYE_ID, FONCTION_ID FROM EMPLOYE WHERE NOM = ? AND PASSWORD = ?;";

$stmt = $dbConnection->prepare($query);
$stmt->bind_param("ss", $user, $passwd);
$stmt->execute();
$stmt->store_result();
$row = mysqli_fetch_row($stmt);
    
if($stmt->num_rows==0){
 //login rejeter   
}else{
 //le login est bon  
 //envoyer la reponse employe_id et fonction_id 

    $xml = new XMLWriter();

    $xml->openURI("php://output");
    $xml->startDocument('1.0');

    $xml->setIndent(true);
    $xml->startElement('login');
    $xml->writeElement("employe_id", $row[0]);
    $xml->writeElement("fonction_id",$row[1]);
    $xml->endElement();

    header('Content-type: text/xml');
    $xml->flush();
}

?>