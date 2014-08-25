/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var blabla = "bli bli",
	//chemins différents selon l'environnement de travail avec easyPHP
	//SERVER_PATH = "http://127.0.0.1:8888/violette/public_html/";
	SERVER_PATH = "http://127.0.0.1:80/projects/projet_final/public_html/",
	// DOM cache
	employeId = 3,
	factureSession = 0,
	factures = [],
	tableOuverte = "null";

// Objet Facture et fonctions associées

function Facture(factureId, numeroTable, siege, date, employeId) {
	this.factureId = factureId;
	this.employeId = employeId;
	this.numeroTable = numeroTable;
	this.siege = siege;
	this.date = date;
	this.commandes = [];
	this.ajouterCommande = function() {
		this.commandes.push(new Commande());
    };
}

function trouverFacture(factureId) {
	var i;
	for (i = 0; i < factures.length; i++) {
		if (factures[i].factureId === factureId) {
			return factures[i];
		}
	}
	return -1;
}

// Objet commande

function Commande() {
	this.ligneCommandes = [];
	this.ajouterLigneCommande = function(menuItemId, quantite) {
		this.ligneCommandes.push(new LigneCommande(menuItemId, quantite));
	} 
}
// Objet LigneCommande

function LigneCommande(menuItemId, quantite) {
	this.menuItemId = menuItemId;
	this.quantite = quantite;
}

function creerFacture(id) {
	numeroTable = document.getElementById("facture_" + id).parentNode.id.substring(6);
	siege = document.getElementById("siegefacture_" + id).value;
	date = new Date();
	factures.push(new Facture(id, numeroTable, siege, date, employeId));
	factures[factures.length - 1].ajouterCommande();
	return factures[factures.length - 1];
}

function afficherEnteteCommande(factureId) {
	var numeroTableSpan = document.getElementById("entete_no_table"),
		factureSpan = document.getElementById("entete_no_facture"),
		siegeSpan = document.getElementById("entete_no_siege"),
		commandeSpan = document.getElementById("entete_no_commande"),
		f = trouverFacture(factureId);
	if (f == -1) {
		f = creerFacture(factureId);
	}
	gererVisibilite(["none", "block", "none", "none"]);
	numeroTableSpan.textContent = numeroTableSpan.textContent.slice(0,9) + f.numeroTable;
	factureSpan.textContent = factureSpan.textContent.slice(0,12) + f.factureId;
	siegeSpan.textContent = siegeSpan.textContent.slice(0,10) + f.siege;
	commandeSpan.textContent = commandeSpan.textContent.slice(0,13) + f.commandes.length;
}

function ajouterCommandeBouton() {
	var factureSpan = document.getElementById("entete_no_facture"),
		commandeSpan = document.getElementById("entete_no_commande"),
		f = trouverFacture(factureSpan.textContent.substring(12));
	prendreCommande(); //retour boolean?
	f.ajouterCommande();
	commandeSpan.textContent = commandeSpan.textContent.slice(0,13) + f.commandes.length;
}

function prendreCommande() {
	var items = document.getElementsByClassName("quantite"),
		i,
		factureSpan = document.getElementById("entete_no_facture"),
		f = trouverFacture(factureSpan.textContent.substring(12));
	for (i = 0; i < items.length; i++) {
		if (items[i].value > 0) {
			f.commandes[f.commandes.length - 1].ajouterLigneCommande(items[i].id.substring(8), items[i].value);
		}
	}
}

function afficherConfirmation() {
	gererVisibilite(['none','none','block','none']);
	prendreCommande();
}

 /*
  * Function qui permet de gérer les pages de l'interface serveuse.html.
  * Elle reçoit un tableau de valeurs assigné au display des différentes pages.
  */
function gererVisibilite(pageVisible) {
	var pages = document.getElementsByClassName("page"), i;
	for (i = 0; i < pages.length; i++) {
		pages[i].style.display = pageVisible[i];
	}
}

/*
 * Function qui gere le "collapse/expand" d'une table.
 * Elle vérifie la valeur de la pastille, pour ainsi trouver
 * les factures associées à cette table, puis affecte le display
 * de celles-ci selon le cas.
 */
function ouvrirTable(tableId) {
	var valeur = parseInt(document.getElementById("pastille_" + tableId).innerHTML),
		table = document.getElementById(tableId),
		i,
		visibilite;
	if (valeur > 0) {
		if ((tableOuverte !== tableId) && (tableOuverte !== "null")) {
			ouvrirTable(tableOuverte);
		}
		lesFactures = table.getElementsByClassName("barre_facture");
		visibilite = (lesFactures[0].style.display === "none") ? "block" : "none";
		for (i = 0; i < lesFactures.length; i++) {
			lesFactures[i].style.display = visibilite;
		}
		tableOuverte = (visibilite === "block") ? tableId : "null";
	}
}

/* Function qui gere le "collapse/expand" d'une section du 
 * menu.  C'est le div "barre_item" qui est le parent des éléments
 * du menu.
 */
function ouvrirSection(sectionId) {
	var section = document.getElementById(sectionId),
		visibilite,
		i;
	menuItems = section.getElementsByClassName("barre_item");
	visibilite = (menuItems[0].style.display === "none") ? "block" : "none";
	for (i = 0; i < menuItems.length; i++) {
		menuItems[i].style.display = visibilite;
	}
}

/*
 * Function pour incrémenter/décrémenter (selon inc) la valeur numérique
 * dans la pastille à la table passer en paramètre. La pastille ne sera
 * affichée seulement si elle contient une valeur plus grande que zéro.
 */
function incrementerPastille(table, inc) {
	var textePastille = document.getElementById("pastille_" + table.id),
		valeur = parseInt(textePastille.textContent);
	valeur += inc;
	if (valeur > 0) {
		textePastille.parentNode.style.display = "inline";
	} else {
		textePastille.parentNode.style.display = "none";
	}
	textePastille.innerHTML = " " + valeur + " ";
}

/*
 * Function pour la sélection du siège payant pour une facture donnée.
 * Ici inc est un boolean pour incrémenter/décrémenter.
 */
function incrementerSiege(facture, inc) {
	var siege = document.getElementById("siege" + facture);
	if ((parseInt(siege.value) > 1) && !(inc)) {
		siege.value = parseInt(siege.value) - 1;
	} else if ((parseInt(siege.value) < 20) && (inc)) {
		siege.value = parseInt(siege.value) + 1;
	}
}

function incrementerQuantite(index, inc) {
	var quantite = document.getElementById("quantite" + index);
	if ((parseInt(quantite.value) > 0) && !(inc)) {
		quantite.value = parseInt(quantite.value) - 1;
	} else if ((parseInt(quantite.value) < 20) && (inc)) {
		quantite.value = parseInt(quantite.value) + 1;
	}
}

// début de la création d'un élément facture dans le DOM.

function creerTableFacture() {
	var facture = document.createElement("TABLE"),
		factureStyle = document.createElement("STYLE");
	facture.className = "barre_facture";
	facture.id = "facture_" + factureSession;
	factureStyle.property = "display";
	factureStyle.display = "block";
	facture.appendChild(factureStyle);
	return facture;
}

function creerLignefacture(factureId) {
	var ligne = document.createElement("TR");
	ligne.className = "ligne_tableau";
	ligne.id = ligne.className + factureId;
	return ligne;
}

function creerNomFacture(factureId) {
	var nom = document.createElement("TD");
	nom.className = "nom_facture";
	nom.id = "nom_" + factureId;
	nom.setAttribute("facture_id", factureId.substring(8));
	nom.innerHTML = factureId.replace("_", " ");
	return nom;
}

function creerEspaceFacture(factureId) {
	var espace = document.createElement("TD");
	espace.className = "espace";
	espace.id = "espace_btn_" + factureId;
	return espace;
}

function creerBoutonIncrementFacture(factureId, isPlus) {
	var bouton = document.createElement("BUTTON");
	bouton.className = (isPlus) ? "btn_plus" : "btn_moins";
	bouton.id = bouton.className + factureId;
	bouton.innerHTML = (isPlus) ? " + " : " - ";
	return bouton;
}

function creerInputSiegeFacture(factureId) {
	var siege = document.createElement("INPUT");
	siege.setAttribute("type", "text");
	siege.required = true;
	siege.disabled = true;
	siege.defaultValue = 1;
	siege.className = "siege";
	siege.id = siege.className + factureId;
	return siege;
}

function ajouterFacture(id) {
	var liTable = document.getElementById(id).parentNode,
		td = document.createElement("TD");
	td.className = "td_increment";
	if ((tableOuverte !== liTable.id) && (tableOuverte !== "null")) {
		ouvrirTable(tableOuverte);
	}
	tableOuverte = liTable.id;
	factureSession++;
	facture = creerTableFacture();
	ligne = creerLignefacture(facture.id);
	nom = creerNomFacture(facture.id);
	btnMoins = creerBoutonIncrementFacture(facture.id, false);
	btnPlus = creerBoutonIncrementFacture(facture.id, true);
	td.appendChild(btnMoins);
	td.appendChild(creerInputSiegeFacture(facture.id));
	td.appendChild(btnPlus);
	ligne.appendChild(nom);
	ligne.appendChild(creerEspaceFacture(facture.id));
	ligne.appendChild(td);
	facture.appendChild(ligne);
	liTable.appendChild(facture);
	incrementerPastille(liTable, 1);
	nom.addEventListener("click", function (e) {
		e.preventDefault();
		afficherEnteteCommande(e.currentTarget.getAttribute("facture_id"));
	}, false);
	btnPlus.addEventListener("click", function (e) {
		e.preventDefault();
		msg = e.currentTarget.id.substring(8);
		incrementerSiege(msg, true);
	}, false);
	btnMoins.addEventListener("click", function (e) {
		e.preventDefault();
		msg = e.currentTarget.id.substring(9);
		incrementerSiege(msg, false);
	}, false);
}

// fin de la création d'un élément facture dans le DOM.

// début de la création du menu dans le DOM.

function creerSectionMenu(index) {
	var ligne = document.createElement("LI");
	ligne.className = "section";
	ligne.id = ligne.className + index;
	return ligne;
}

function creerTitreSectionMenu(index, text) {
	var ligne = document.createElement("H3");
	ligne.className = "section_titre";
	ligne.id = ligne.className + index;
	ligne.textContent = text;
	return ligne;
}

function creerDivItem(index) {
	var ligne = document.createElement("DIV"),
		ligneStyle = document.createElement("STYLE");
	ligne.className = "barre_item";
	ligne.id = ligne.className + index;
	ligneStyle.property = "display";
	ligneStyle.display = "none";
	ligne.appendChild(ligneStyle);
	return ligne;
}

function creerTitreItem(index, text) {
	var ligne = document.createElement("H5");
	ligne.className = "menu_item";
	ligne.id = ligne.className + index;
	ligne.textContent = text.textContent;
	ligne.setAttribute("prix",text.getAttribute("prix"));
	ligne.setAttribute("description",text.getAttribute("description"));
	return ligne;
}

function creerEspaceItem(index) {
	var espace = document.createElement("SPAN");
	espace.className = "espace_menu";
	espace.id = espace.className + index;
	return espace;
}

function creerDivBoutons(index) {
	var ligne = document.createElement("DIV");
	ligne.className = "menu_boutons";
	ligne.id = ligne.className + index;
	return ligne;
}

function creerBoutonIncrementMenu(index, isPlus) {
	var bouton = document.createElement("BUTTON");
	bouton.className = (isPlus) ? "btn_plus_menu" : "btn_moins_menu";
	bouton.id = bouton.className + index;
	bouton.innerHTML = (isPlus) ? " + " : " - ";
	return bouton;
}

function creerInputQuantiteMenu(index) {
	var input = document.createElement("INPUT");
	input.setAttribute("type", "text");
	input.disabled = true;
	input.defaultValue = 0;
	input.className = "quantite";
	input.id = input.className + index;
	return input;
}

function construireMenu(menuXML) {
	var sections = menuXML.getElementsByTagName("section"),
		listeMenu = document.getElementById("liste_menu_sections"),
		i,
		j;
	for (i = 0; i < sections.length; i++) {
		section = creerSectionMenu(i);
		titre = creerTitreSectionMenu(i, sections[i].getAttribute("nom"));
		items = sections[i].getElementsByTagName("item");
		section.appendChild(titre);
		for (j = 0; j < items.length; j++) {
			id = items[j].firstChild.nextSibling;
			textItem = id.nextSibling.nextSibling;
			descItem = textItem.nextSibling.nextSibling;
			textItem.setAttribute("description", descItem.textContent);
			prixItem = descItem.nextSibling.nextSibling;
			textItem.setAttribute("prix", prixItem.textContent);
			divItem = creerDivItem(id);
			menuItem = creerTitreItem(id.textContent, textItem);
			espace = creerEspaceItem(id.textContent);
			divBoutons = creerDivBoutons(id.textContent);
			btnMoins = creerBoutonIncrementMenu(id.textContent, false);
			quantite = creerInputQuantiteMenu(id.textContent);
			btnPlus = creerBoutonIncrementMenu(id.textContent, true);
			divBoutons.appendChild(btnMoins);
			divBoutons.appendChild(quantite);
			divBoutons.appendChild(btnPlus);
			divItem.appendChild(menuItem);
			divItem.appendChild(espace);
			divItem.appendChild(divBoutons);
			section.appendChild(divItem);
			btnPlus.addEventListener("click", function (e) {
				e.preventDefault();
				incrementerQuantite(e.currentTarget.id.substring(13), true);
			}, false);
			btnMoins.addEventListener("click", function (e) {
				e.preventDefault();
				incrementerQuantite(e.currentTarget.id.substring(14), false);
			}, false);
		}
		listeMenu.appendChild(section);
		titre.addEventListener("click", function (e) {
			e.preventDefault();
			ouvrirSection(e.currentTarget.parentNode.id);
		}, false);
		ouvrirSection(section.id);
	}
}

function message(msg) {
	boite = document.createElement("DIV");
	boite.className = "message";
	boite.textContent = msg;
	document.getElementById("serveuse").appendChild(boite);
	boite.addEventListener("click", function (e) {
		e.preventDefault();
		body = document.getElementById("serveuse");
		body.removeChild(body.lastChild);
	}, false);
}

// fin de la création du menu dans le DOM.

/*
 * Function pour la requête au serveur pour vérifier l'employé accédant à 
 * l'application et charge le bon HTML selon la fonction de l'employé.
 * le url ici fait référence au localhost, si tout le projet est sur localhost pas besoin de CORS
 */
function requeteLogin() {
	var	passwd = document.getElementById("passwd").value,
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

//TODO: modifier error
function requeteMenu() {
	$.ajax({
		url: SERVER_PATH + "menu.php",
		type: 'POST',
		async: false,
		datatype: 'xml',
		success: function (response) {
			construireMenu(response);
		},
		error: function (response) { return alert("erreur : " + response.responseText); }
    });
	return false;
}