
function creerTableFacture(classe) {
	var facture = document.createElement("TABLE"),
		factureStyle = document.createElement("STYLE");
	facture.className = classe;
	facture.id = "facture_" + factureSession;
	factureStyle.property = "display";
	factureStyle.display = "inline-block";
	facture.appendChild(factureStyle);
	return facture;
}

function creerLignefacture(classe, factureId) {
	var ligne = document.createElement("TR");
	ligne.className = classe;
	ligne.id = ligne.className + factureId;
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

function creerTDIncrement(classe) {
	var td = document.createElement("TD");
	td.className = "td_increment";
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