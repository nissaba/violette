
 var blabla = "bli bli",
	//chemins différents selon l'environnement de travail avec easyPHP
	SERVER_PATH = "http://violette.cabserver.net/";
	//SERVER_PATH = "http://127.0.0.1:8888/violette/public_html/",
	//SERVER_PATH = "http://127.0.0.1/projects/projet_final/public_html/",
	// DOM cache
	employeId = -1,
	factureSession = 0,
	factures = [],
	tableOuverte = "null",
	sectionOuverte = "null";

function trouverFacture(factureId) {
	var i;
	for (i = 0; i < factures.length; i++) {
		if (factures[i].factureId === factureId) {
			return factures[i];
		}
	}
	return -1;
}

function getFactureInterface() {
	var factureSpan = document.getElementById("entete_no_facture"),
		f = trouverFacture(factureSpan.textContent.substring(9));
	return f;
}

function getCommandeInterface() {
	var f = getFactureInterface(),
		commandeSpan = document.getElementById("entete_no_commande"),
		commande = f.commandes[commandeSpan.textContent.substring(10) - 1];
	return commande;
}

/*
 * Créeation d'une facture prenant la table et le siège du DOM et crée 
 * un nouvel objet Facture dans le tableau factures. La fonction
 * retourne la dernière facture créée.
 */
function initialiserFacture(id) {
	numeroTable = document.getElementById("facture_" + id).parentNode.id.substring(6);
	siege = document.getElementById("siegefacture_" + id).value;
	factures.push(new Facture(id, numeroTable, siege, employeId));
	factures[factures.length - 1].ajouterCommande();
	return factures[factures.length - 1];
}

/* Function pour afficher l'information de la facture sélectionnée
 * les slice correpondent à la longueur du texte dans serveuse.html
 * aux Ids correspondant.  Si l'objet Facture n'existe pas un nouveau est
 * créé.
 */
function afficherEnteteCommande(facture, factureId, numCommande) {
	var numeroTableSpan = document.getElementById("entete_no_table"),
		factureSpan = document.getElementById("entete_no_facture"),
		siegeSpan = document.getElementById("entete_no_siege"),
		commandeSpan = document.getElementById("entete_no_commande");
	viderInputQuantite();
	desactiverBoutonFacture(true);
		if (facture.factureIdBD > -1) {
			desactiverBoutonFacture(false);
		}
		if (numCommande > 0) {
			afficherInputQuantite(facture.commandes[numCommande - 1]);
			commandeSpan.textContent = commandeSpan.textContent.slice(0,10) + numCommande;
		} else {
			afficherInputQuantite(facture.commandes[facture.commandes.length-1]);
			commandeSpan.textContent = commandeSpan.textContent.slice(0,10) + facture.commandes.length;
		}
		verifierQuantiteVide();
	gererVisibilite(["none", "block", "none", "none"]);
	numeroTableSpan.textContent = numeroTableSpan.textContent.slice(0,7) + facture.numeroTable;
	factureSpan.textContent = factureSpan.textContent.slice(0,9) + facture.factureId;
	siegeSpan.textContent = siegeSpan.textContent.slice(0,7) + facture.siege;
}

function onClickRetourTable() {
	gererVisibilite(['block','none','none','none']);
	prendreCommande();
}

function onClickAjouterCommande() {
	var f = getFactureInterface(),
		commandeSpan = document.getElementById("entete_no_commande");
	prendreCommande();
	f.ajouterCommande();
	commandeSpan.textContent = commandeSpan.textContent.slice(0,10) + f.commandes.length;
	viderInputQuantite();
}

/*
 * Change la page visible, ici la confirmation de la commande sélectionnée.
 * Elle invoque prendreCommande pour enregistrer celle-ci dans l'objet commande
 * de la facture active.
 */
function onClickConfirmation() {
	var factureConfirmation = document.getElementById("entete_no_facture_id"),
		tableConfirmation = document.getElementById("entete_no_table_id"),
		f = getFactureInterface();
	gererVisibilite(['none','none','block','none']);
	prendreCommande();
	factureConfirmation.textContent = factureConfirmation.textContent.slice(0,9) + f.factureId;
	tableConfirmation.textContent = tableConfirmation.textContent.slice(0,7) + f.numeroTable;
	construireDOMCommande(f);
}

function onClickCommandeSuivante(isSuivant){
	var f = getFactureInterface(),
		commandeSpan = document.getElementById("entete_no_commande"),
		numCommande = commandeSpan.textContent.substring(10);
	if ((isSuivant) && (f.commandes.length > numCommande)) {
		numCommande++;
	} else if ((!isSuivant) && (numCommande > 0)){
		numCommande--;
	}
	afficherEnteteCommande(f, f.factureId, numCommande);
}

function onClickCuisine() {
	var f = getFactureInterface();
	if ((f.factureIdBD != -1) && (getCommandeInterface().modifie)){
		requeteNouvelleCommande(f);
	} else {
		requeteNouvelleFacture(f);
	}
}

/*
 * Cette function récupère du DOM les inputs de class quantite et la facture active.
 * Tous les inputs ayant une valeur plus grande de zéro sont ajoutés à une ligneCommande.
 * Les inputs ayant un id finnissant par le menuItem_id de la BD, elle le récupère
 * avec un substring.
 */
function prendreCommande() {
	var items = document.getElementsByClassName("quantite"),
		i,
		facture = getFactureInterface(),
		commandeSpan = document.getElementById("entete_no_commande").textContent.substring(10),
		commandeTemp = new Commande();
		for (i = 0; i < items.length; i++) {
			if (items[i].value > 0) {
				commandeTemp.ajouterLigneCommande(items[i].id.substring(8), items[i].value);
			}
		}
		if (!facture.commandes[commandeSpan-1].equals(commandeTemp)) {
			facture.commandes[commandeSpan-1] = commandeTemp;
			facture.commandes[commandeSpan-1].modifie = true;
			desactiverBoutonCuisine(false);
		} else {
			facture.commandes[commandeSpan-1].modifie = false;
			desactiverBoutonCuisine(true);
		}
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
		visibilite = (lesFactures[0].style.display === "none") ? "inline-block" : "none";
		for (i = 0; i < lesFactures.length; i++) {
			lesFactures[i].style.display = visibilite;
		}
		tableOuverte = (visibilite === "inline-block") ? tableId : "null";
	}
}

/*
 * Function qui gere le "collapse/expand" d'une section du 
 * menu.  C'est le div "barre_item" qui est le parent des éléments
 * du menu.
 */
function ouvrirSection(sectionId) {
	var section = document.getElementById(sectionId),
		visibilite,
		i;
		if ((sectionOuverte !== sectionId) && (sectionOuverte !== "null")) {
			ouvrirSection(sectionOuverte);
		}
		menuItems = section.getElementsByClassName("barre_item");
		visibilite = (menuItems[0].style.display === "none") ? "block" : "none";
		for (i = 0; i < menuItems.length; i++) {
			menuItems[i].style.display = visibilite;
		}
		sectionOuverte = (visibilite === "block") ? sectionId : "null";
}

/*
 * Cette function ferme toutes les sections du menu.
 */
function fermerSections() {
	var menuItems = document.getElementsByClassName("barre_item"),
		i;
		for (i = 0; i < menuItems.length; i++) {
			menuItems[i].style.display = "none";
		}
		sectionOuverte = "null";
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

/*
 * function pour incrémenter/décrémenter la quantité
 * pour un item du menu.
 */
function incrementerQuantite(index, inc) {
	var quantite = document.getElementById("quantite" + index);
	if ((parseInt(quantite.value) > 0) && !(inc)) {
		quantite.value = parseInt(quantite.value) - 1;
	} else if ((parseInt(quantite.value) < 20) && (inc)) {
		quantite.value = parseInt(quantite.value) + 1;
	}
	if(verifierQuantiteVide()) {
		desactiverBoutonResume(true);
	}
}

function afficherInputQuantite(commande) {
	var i;
	for (i = 0; i < commande.ligneCommandes.length; i++){
		item = commande.ligneCommandes[i].menuItemId;
		document.getElementById("quantite"+item).value = commande.ligneCommandes[i].quantite;
	}
}

function viderInputQuantite() {
	var inputs = document.getElementsByClassName("quantite"),
		i;
	for (i = 0; i < inputs.length; i++) {
		inputs[i].value = 0;
	}
	fermerSections();
	desactiverBoutonResume(true);
	desactiverBoutonAjoutCommande(true);
}

function verifierQuantiteVide() {
	var inputs = document.getElementsByClassName("quantite"),
		i;
	for (i = 0; i < inputs.length; i++) {
		if (inputs[i].value > 0) {
			desactiverBoutonResume(false);
			desactiverBoutonAjoutCommande(false);
			return false;
		}
	}
	return true;
}

function viderDOMCommande() {
	var divDetail = document.getElementById("detail_commande_id"),
		i;
	childs = divDetail.childNodes;
	while(divDetail.firstChild) {
		divDetail.removeChild(divDetail.firstChild);
	}
}

function desactiverBoutonFacture(isInactif) {
	var btnCommande = document.getElementById("btn_facture_commande");
		btnConfirmation = document.getElementById("btn_facture_confirmation");
	btnCommande.disabled = isInactif;
	btnConfirmation.disabled = isInactif;
} 

function desactiverBoutonResume(isInactif) {
	document.getElementById("btn_confirmation").disabled = isInactif;
}

function desactiverBoutonAjoutCommande(isInactif) {
	document.getElementById("btn_commande_plus").disabled = isInactif;
}

function desactiverBoutonCuisine(isInactif) {
	document.getElementById("btn_cuisine").disabled = isInactif;
}

// Début de la création du DOM pour la confirmation d'une commnde

function creerTitreCommande(numCommande) {
	var divTitre = document.createElement("DIV"),
		titre = document.createElement("H2");
	divTitre.className = "titre_commande_div";
	divTitre.id = divTitre.className+numCommande;
	titre.className = "titre_commande_h";
	titre.id = titre.className + numCommande;
	titre.textContent = "Commande " + numCommande;
	divTitre.appendChild(titre);
	return divTitre;
}

function creerItemCommande(facture) {
	var tableItem = document.createElement("TABLE"),
		i;
	tableItem.className = "table_commande";
	tableItem.id = tableItem.className + "_id";
	for (i = 0; i < facture.commandes[facture.commandes.length - 1].ligneCommandes.length; i++) {
		tr = document.createElement("TR");
		tr.className = "tr_commande_item";
		tr.id = tr.className + i;
		btnEnlever = document.createElement("BUTTON");
		btnEnlever.className = "btn_enlever_commande";
		btnEnlever.id = btnEnlever+i;
		btnEnlever.textContent = "X";
		tdItem = document.createElement("TD");
		tdItem.className = "td_item_commande";
		tdItem.id = tdItem.className + i;
		menuItemId = facture.commandes[facture.commandes.length - 1].ligneCommandes[i].menuItemId;
		tdItem.textContent = document.getElementById("menu_item"+menuItemId).textContent;
		tdQte = document.createElement("TD");
		tdQte.className = "td_quantite_commande";
		tdQte.id = tdQte.className + i;
		tdQte.textContent = facture.commandes[facture.commandes.length - 1].ligneCommandes[i].quantite;
		tdPrix = document.createElement("TD");
		tdPrix.className = "td_prix_commande";
		tdPrix.id = tdPrix.className + i;
		menuItemId = facture.commandes[facture.commandes.length - 1].ligneCommandes[i].menuItemId;
		tdPrix.textContent = document.getElementById("menu_item"+menuItemId).getAttribute("prix");
		tr.appendChild(btnEnlever);
		tr.appendChild(tdItem);
		tr.appendChild(tdQte);
		tr.appendChild(tdPrix);
		tableItem.appendChild(tr);
	}
	return tableItem;
}

function construireDOMCommande(facture) {
	var divDetail = document.getElementById("detail_commande_id");
	viderDOMCommande();
	divDetail.appendChild(creerTitreCommande(facture.commandes.length));
	divDetail.appendChild(creerItemCommande(facture));
}

// Fin de la création du DOM pour la confirmation d'une commnde

// Début de la création d'un élément facture dans le DOM.

function ajouterFacture(id) {
	var liTable = document.getElementById(id).parentNode;
	if ((tableOuverte !== liTable.id) && (tableOuverte !== "null")) {
		ouvrirTable(tableOuverte);
	}
	tableOuverte = liTable.id;
	factureSession++;
	viderInputQuantite();
	facture = creerTableFacture();
	facture.appendChild(creerLignefacture(facture.id));
	liTable.appendChild(facture);
	incrementerPastille(liTable, 1);
	document.getElementById("nom_"+facture.id).addEventListener("click", function (e) {
		e.preventDefault();
		f = initialiserFacture(e.currentTarget.getAttribute("facture_id"));
		afficherEnteteCommande(f, e.currentTarget.getAttribute("facture_id"), -1);
	}, false);
	document.getElementById("btn_plus"+facture.id).addEventListener("click", function (e) {
		e.preventDefault();
		incrementerSiege(e.currentTarget.id.substring(8), true);
	}, false);
	document.getElementById("btn_moins"+facture.id).addEventListener("click", function (e) {
		e.preventDefault();
		incrementerSiege(e.currentTarget.id.substring(9), false);
	}, false);
}

// Fin de la création d'un élément facture dans le DOM.

// Début de la création du menu dans le DOM.

function construireMenu(menuXML) {
	var sections = menuXML.getElementsByTagName("section"),
		listeMenu = document.getElementById("liste_menu_sections"),
		i,
		j;
	for (i = 0; i < sections.length; i++) {
		section = creerSectionMenu(i, sections[i].getAttribute("nom"));
		items = sections[i].getElementsByTagName("item");
		for (j = 0; j < items.length; j++) {
			id = items[j].firstChild.nextSibling;
			textItem = id.nextSibling.nextSibling;
			descItem = textItem.nextSibling.nextSibling;
			textItem.setAttribute("description", descItem.textContent);
			prixItem = descItem.nextSibling.nextSibling;
			textItem.setAttribute("prix", prixItem.textContent);
			section.appendChild(creerDivItem(id.textContent, textItem));
		}
		listeMenu.appendChild(section);
		document.getElementById("section_titre"+i).addEventListener("click", function (e) {
			e.preventDefault();
			ouvrirSection(e.currentTarget.parentNode.id);
		}, false);
		ouvrirSection(section.id);
	}
	desactiverBoutonFacture(true);
	desactiverBoutonCuisine(true);
}

// Fin de la création du menu dans le DOM.

/*
 * Function pour les résultats de tests.  Le message s'ajoute en bas de
 * page et s'efface en cliquant dessus.
 */
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

// Section des requêtes au serveur

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
				window.name = response.getElementsByTagName("employe_id")[0].textContent;
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

//TODO: modifier error et window.name
function requeteMenu() {
	$.ajax({
		url: SERVER_PATH + "menu.php",
		type: 'POST',
		async: false,
		datatype: 'xml',
		success: function (response) {
			construireMenu(response);
			window.name = "4";
			employeId = window.name;
		},
		error: function (response) { return alert("erreur : " + response.responseText); }
    });
	return false;
}

function requeteNouvelleFacture(facture) {
	$.ajax({
		url: SERVER_PATH + "facturation.php",
		type: 'POST',
		async: false,
		data: "ACTION=insertfacture&DATA=" + btoa(facture.toString()),
		datatype: 'xml',
		success: function (response) {
			facture.factureIdBD = response.getElementsByTagName("facture_id")[0].textContent;
			requeteNouvelleCommande(facture);
			desactiverBoutonFacture(false);
		},
		error: function (response) { 
			return alert("erreur : nouvelle facture"); 
		}
    });
	return false;
}

function requeteNouvelleCommande(facture) {
	var i;
	$.ajax({
		url: SERVER_PATH + "facturation.php",
		type: 'POST',
		async: false,
		data: "ACTION=facutreAjouteItems&DATA=" + btoa(facture.commandes[facture.commandes.length - 1].toString(facture.factureIdBD)),
		datatype: 'xml',
		success: function (response) {
			reponses = response.getElementsByTagName("id");
			for (i = 0; i < reponses.length; i++) {
				facture.commandes[facture.commandes.length-1].ligneCommandes[i].menuItemIdBD = reponses[i].textContent;
				message(facture.commandes[facture.commandes.length-1].ligneCommandes[i].envoye + facture.commandes[facture.commandes.length-1].ligneCommandes[i].menuItemIdBD+response.getElementsByTagName("nombre_item_ajouter")[0].textContent+reponses.length);
			}
		},
		error: function (response) { return alert("erreur : nouvelle commande" + response.responseText); }
    });
	return false;
}