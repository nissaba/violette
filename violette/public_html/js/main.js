/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*le url ici fait référence au localhost, si tout le projet est sur localhost pas besoin de CORS*/
function requeteServeur() {
	//chemins différents selon l'environnement de travail avec easyPHP
	//var SERVER_PATH = "http://127.0.0.1:8888/violette-gh-pages/violette/public_html/;
	var SERVER_PATH = "http://127.0.0.1/projects/projet_final/";
 	var passwd = document.getElementById("passwd").value;
	var user = document.getElementById("user").value;
	hash = Sha1.hash(passwd);
	$.ajax({
		url: SERVER_PATH+"login.php",
		type: 'POST',
		async: false,
		data: "user="+user+"&passwd="+hash,
		datatype: 'xml',
		success: function(response) {
		var resultCode = response.getElementsByTagName("result_code") [0].textContent;
		if (resultCode==0){
		document.getElementById("erreur_login").innerHTML = "Le nom de l'utilisateur ou le mot de passe est erroné!";
		} else {
		var fonctionId = parseInt(response.getElementsByTagName("fonction_id") [0].textContent);
			switch (fonctionId) {
			case 1:
			return window.location.href = SERVER_PATH+"gerance.html";
			break;
			case 2:
			return window.location.href = SERVER_PATH+"cuisine.html";
			break;
			case 3:
			return window.location = SERVER_PATH+"serveuse.html";
			break;
			case 4:
			return document.getElementById("erreur_login").innerHTML = "Vous n'avez pas l'autorisation!";
			break;
			case 5:
			return document.getElementById("erreur_login").innerHTML = "Vous n'avez pas l'autorisation!";
			break;
			}
		}
		return false;
		},
		error: function(response) { document.getElementById("erreur_login").innerHTML = "Problème de connection avec le serveur!";}
    });
	return false;
}

var blabla = "bli bli";