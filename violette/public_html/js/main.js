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

function requeteServeur() {
	var passwd = document.getElementById("passwd");
	hash = Sha1.hash(passwd.value);
	passwd.value = hash;
	alert(passwd.value);
	$.ajax({
		url: 'https://github.com/nissaba/violette/tree/gh-pages/violette/public_html/login.php',
		type: 'POST',
		async: false,
		data: $('#login_form').serialize(),
		datatype: 'text',
		success: function(response) { return alert('success : '+response.value);},
		error: function(response) { return alert('error : '+response.value);},
		complete: function(response) { return alert('complete : '+response.value);}
    });
	return false;
}

var blabla = "bli bli";