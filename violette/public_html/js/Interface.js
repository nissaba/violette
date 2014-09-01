
// Interface d'une barre facture

function creerTableFacture() {
	var facture = document.createElement("TABLE"),
		factureStyle = document.createElement("STYLE");
	facture.className = "barre_facture";
	facture.id = "facture_" + factureSession;
	factureStyle.property = "display";
	factureStyle.display = "inline-block";
	facture.appendChild(factureStyle);
	return facture;
}

function creerLignefacture(id) {
	var ligne = document.createElement("TR");
	ligne.className = "ligne_tableau";
	ligne.id = ligne.className + id;
	ligne.appendChild(creerNomFacture("nom_facture", id));
	ligne.appendChild(creerEspaceFacture("espace", id));
	ligne.appendChild(creerTDIncrement(id));
	return ligne;
}

function creerNomFacture(classe, factureId) {
	var nom = document.createElement("TD");
	nom.className = classe;
	nom.id = "nom_" + factureId;
	nom.setAttribute("facture_id", factureId.substring(8));
	nom.innerHTML = factureId.replace("_", " ");
	return nom;
}

function creerEspaceFacture(classe, factureId) {
	var espace = document.createElement("TD");
	espace.className = classe;
	espace.id = "espace_btn_" + factureId;
	return espace;
}

function creerTDIncrement(id) {
	var td = document.createElement("TD");
	td.className = "td_increment";
	td.appendChild(creerBoutonIncrementFacture(id, false));
	td.appendChild(creerInputSiegeFacture("siege", id));
	td.appendChild(creerBoutonIncrementFacture(id, true));
	return td;
}

function creerBoutonIncrementFacture(factureId, isPlus) {
	var bouton = document.createElement("BUTTON");
	bouton.className = (isPlus) ? "btn_plus" : "btn_moins";
	bouton.id = bouton.className + factureId;
	bouton.innerHTML = (isPlus) ? " + " : " - ";
	return bouton;
}

function creerInputSiegeFacture(classe, factureId) {
	var siege = document.createElement("INPUT");
	siege.setAttribute("type", "text");
	siege.required = true;
	siege.disabled = true;
	siege.defaultValue = 1;
	siege.className = classe;
	siege.id = siege.className + factureId;
	return siege;
}

// Interface menu/commande

function creerSectionMenu(index, nom) {
	var ligne = document.createElement("LI");
	ligne.className = "section";
	ligne.id = ligne.className + index;
	ligne.appendChild(creerTitreSectionMenu("section_titre", index, nom));
	return ligne;
}

function creerTitreSectionMenu(classe, index, text) {
	var ligne = document.createElement("H3");
	ligne.className = classe;
	ligne.id = ligne.className + index;
	ligne.textContent = text;
	return ligne;
}

function creerDivItem(index, textItem) {
	var ligne = document.createElement("DIV"),
		ligneStyle = document.createElement("STYLE");
	ligne.className = "barre_item";
	ligne.id = ligne.className + index;
	ligneStyle.property = "display";
	ligneStyle.display = "none";
	ligne.appendChild(ligneStyle);
	ligne.appendChild(creerTitreItem("menu_item", index, textItem));
	ligne.appendChild(creerEspaceItem("espace_menu", index));
	ligne.appendChild(creerDivBoutons("menu_boutons", index));
	return ligne;
}

function creerTitreItem(classe, index, text) {
	var ligne = document.createElement("H5");
	ligne.className = classe;
	ligne.id = ligne.className + index;
	ligne.textContent = text.textContent;
	ligne.setAttribute("prix",text.getAttribute("prix"));
	ligne.setAttribute("description",text.getAttribute("description"));
	return ligne;
}

function creerEspaceItem(classe, index) {
	var espace = document.createElement("SPAN");
	espace.className = classe;
	espace.id = espace.className + index;
	return espace;
}

function creerDivBoutons(classe, index) {
	var ligne = document.createElement("DIV");
	ligne.className = classe;
	ligne.id = ligne.className + index;
	ligne.appendChild(creerBoutonIncrementMenu(index, false));
	ligne.appendChild(creerInputQuantiteMenu("quantite", index));
	ligne.appendChild(creerBoutonIncrementMenu(index, true));
	return ligne;
}

function creerBoutonIncrementMenu(index, isPlus) {
	var bouton = document.createElement("BUTTON");
	bouton.className = (isPlus) ? "btn_plus_menu" : "btn_moins_menu";
	bouton.id = bouton.className + index;
	message(bouton.id);
	bouton.innerHTML = (isPlus) ? " + " : " - ";
	if (bouton.className === "btn_plus_menu") {
	bouton.addEventListener("click", function (e) {
			e.preventDefault();
			incrementerQuantite(e.currentTarget.id.substring(13), true);
		}, false);
	} else {
	bouton.addEventListener("click", function (e) {
			e.preventDefault();
			incrementerQuantite(e.currentTarget.id.substring(14), false);
		}, false);
	}
	return bouton;
}

function creerInputQuantiteMenu(classe, index) {
	var input = document.createElement("INPUT");
	input.setAttribute("type", "text");
	input.disabled = true;
	input.defaultValue = 0;
	input.className = classe;
	input.id = input.className + index;
	return input;
}