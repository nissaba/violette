/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
var blabla = "bli bli",
	factureSession = 0;
 
function gererVisibilite(pageVisible) {
	var pages = document.getElementsByClassName("page");
	for (var i = 0; i < pages.length; i++) {
		pages[i].style.display = pageVisible[i];
	}
}
 
function incrementerPastille(table,inc) {
	var pastille = document.getElementById("cercle_"+table.id.substring(6)),
		valeur = parseInt(pastille.textContent);
	valeur += inc;
	if (valeur > 0) {
			pastille.style.display = "inline";
		} else {
			pastille.style.display = "none";
		}
	pastille.innerHTML = " " + valeur + " ";
}

function incrementerSiege(facture,inc) {
	var siege = document.getElementById("siege"+facture);
	if ((parseInt(siege.value) > 1) && !(inc)) {
		siege.value = parseInt(siege.value) - 1;
	} else if ((parseInt(siege.value) < 20) && (inc)) {
		siege.value = parseInt(siege.value) + 1;
	}
}

function creerFacture(id) {
	gererVisibilite(["none","block","none"]);
}

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
		error: function (response) { document.getElementById("erreur_login").innerHTML = "Problème de connection avec le serveur!"; }
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
	factureSession++;
	facture.className = "barre_facture";
	facture.id = "facture_" + factureSession;
	ligne.className = "ligne_tableau";
	ligne.id = ligne.className + facture.id;
	nom.className = "nom_facture";
	nom.id = "nom_" + facture.id;
	nom.innerHTML = facture.id.replace("_", " ");
	espace.className = "espace";
	espace.id = "espace_btn_" + facture.id;
	btnMoins.className = "btn_moins";
	btnMoins.id = btnMoins.className + facture.id;
	btnMoins.innerHTML = " - ";
	siege.setAttribute("type", "text");
	siege.required = true;
	siege.disabled = true;
	siege.defaultValue = 1;
	siege.className = "siege";
	siege.id = siege.className+facture.id;
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
	incrementerPastille(liTable,1);
	nom.addEventListener("click",function(e) {
		e.preventDefault();
		msg = e.currentTarget.id;
		creerFacture(msg);
	}, false);
	btnPlus.addEventListener("click",function(e) {
		e.preventDefault();
		msg = e.currentTarget.id.substring(8);
		incrementerSiege(msg,true);
	}, false);
	btnMoins.addEventListener("click",function(e) {
		e.preventDefault();
		msg = e.currentTarget.id.substring(9);
		incrementerSiege(msg,false);
	}, false);
}

function ouvrirTable(id) {
	var table = document.getElementById(id);
	alert(table.id);
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