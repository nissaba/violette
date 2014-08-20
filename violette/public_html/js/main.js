/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
 /*le url ici fait référence au localhost, si tout le projet est sur localhost pas besoin de CORS*/
function requeteServeur() {
	//chemins différents selon l'environnement de travail avec easyPHP
	//var SERVER_PATH = "http://127.0.0.1:8888/violette-gh-pages/violette/public_html/;
	var SERVER_PATH = "http://127.0.0.1/projects/projet_final/",
		passwd = document.getElementById("passwd").value,
		user = document.getElementById("user").value,
		hash = Sha1.hash(passwd);
	$.ajax({
		url: SERVER_PATH + "login.php",
		type: 'POST',
		async: false,
		data: "user=" + user + "&passwd=" + hash,
		datatype: 'xml',
		success: function (response) {
			var resultCode = response.getElementsByTagName("result_code")[0].textContent;
			if (resultCode === 0) {
				document.getElementById("erreur_login").innerHTML = "Le nom de l'utilisateur ou le mot de passe est erroné!";
			} else {
				var fonctionId = parseInt(response.getElementsByTagName("fonction_id")[0].textContent);
				switch (fonctionId) {
				case 1:
					return window.location.href = SERVER_PATH + "gerance.html";
				case 2:
					return window.location.href = SERVER_PATH + "cuisine.html";
				case 3:
					return window.location = SERVER_PATH + "serveuse.html";
				case 4:
					return document.getElementById("erreur_login").innerHTML = "Vous n'avez pas l'autorisation!";
				case 5:
					return document.getElementById("erreur_login").innerHTML = "Vous n'avez pas l'autorisation!";
				}
			}
			return false;
		},
		error: function(response) { document.getElementById("erreur_login").innerHTML = "Problème de connection avec le serveur!";}
    });
	return false;
}

function ajouterFacture(id) {
	var liTable = document.getElementById(id).parentNode,
		facture = document.createElement("TABLE"),
		ligne = document.createElement("TR"),
		nom = document.createElement("TD"),
		espace = document.createElement("TD"),
		td = document.createElement("TD"),
		btnMoins = document.createElement("BUTTON"),
		siege = document.createElement("INPUT"),
		btnPlus = document.createElement("BUTTON");
	facture.className = "barre_facture";
	facture.id = "facture_1";
	ligne.className = "ligne_tableau";
	ligne.id = ligne.className + facture.id;
	nom.className = "nom_facture";
	nom.id = "nom_" + facture.id;
	nom.innerHTML = facture.id.replace("_"," ");
	espace.className = "espace";
	espace.id = "espace_btn_" + facture.id;
	btnMoins.className = "btn_moins";
	btnMoins.id = btnMoins.className + facture.id;
	btnMoins.innerHTML = " - ";
	siege.setAttribute("type", "number");
	siege.required;
	siege.readOnly;
	siege.min = 1;
	siege.max = 20;
	siege.defaultValue = 1;
	btnPlus.className = "btn_plus";
	btnPlus.id = btnPlus.className + facture.id;
	btnPlus.innerHTML = " + ";
	td.appendChild(btnMoins);
	td.appendChild(siege);
	td.appendChild(btnPlus);
	ligne.appendChild(nom);
	ligne.appendChild(espace);
	ligne.appendChild(td);
	facture.appendChild(ligne);
	liTable.appendChild(facture);
}

function rendreVisibleServeuse(pageVisible) {
	//["Saab", "Volvo", "BMW"] exemple tableau
	var pages = document.getElementsByClassName;
	for (var i = 0; i < pageVisible.length; i++) {
	pages [i].style.display = pageVisible [i];
	}
}

function ouvrirTable(id) {
	var table = document.getElementById(id);
	if (table.childNodes > 2) {

	}
}
/*
<table class="barre_facture" id='facture1'>
	<tr class="ligne_tableau" id="ligne_tableau_facture_1">
		<td class="nom_facture" id="nom_facture_1">Facture 1</td>
		<td class="espace" id="espace_btn_facture_1"></td>
		<td><button class="btn_moins"> - </button><input type="text" class="increment_siege"/><button class="btn_plus"> + </button></td>
	</tr>
</table>
*/
var blabla = "bli bli";