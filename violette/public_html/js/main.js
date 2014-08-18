/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function envoyerEmploye(id) {
	var passwd = document.getElementById("passwd");
	hash = Sha1.hash(passwd.value);
	passwd.value = hash;
	requeteServeur();
}
/*le url ici fait référence au localhost, si tout le projet est sur localhost pas besoin de CORS*/
function requeteServeur() {
	var passwd = document.getElementById("passwd");
	hash = Sha1.hash(passwd.value);
	passwd.value = hash;
	alert(passwd.value);
	$.ajax({
		url: 'http://127.0.0.1/projects/projet_final/login.php',
		type: 'POST',
		async: false,
		data: $('#login_form').serialize(),
		datatype: 'xml',
		success: function(response) { return alert('success : '+response.getElementsByTagName("result_code") [0].nodeValue);},
		error: function(response) { return alert('error : '+response.value);},
		complete: function(response) { return alert('complete : '+response.value);}
    });
	return false;
}

var blabla = "bli bli";