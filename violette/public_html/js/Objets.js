
// Objet Facture et fonctions associées

function Facture(factureId, numeroTable, siege, employeId) {
	this.factureId = factureId;
	this.employeId = employeId;
	this.numeroTable = numeroTable;
	this.siege = siege;
	this.factureIdBD = -1;
	this.commandes = [];
}
Facture.prototype.ajouterCommande = function() {
	this.commandes.push(new Commande());
};
Facture.prototype.toString = function() {
	return '{"employeId":' + this.employeId + ', "numeroTable":' + this.numeroTable + ', "siege":' + this.siege + '}';
};
// Objet commande

function Commande() {
	this.modifie = false;
	this.ligneCommandes = [];
}
Commande.prototype.ajouterLigneCommande = function(menuItemId, quantite) {
	this.ligneCommandes.push(new LigneCommande(menuItemId, quantite));
};
// validation this.ligneCommandes[i].modifie = false
Commande.prototype.toString = function(factureIdBD) {
	var strJSON = '{"factureid":'+factureIdBD+',"ligneCommandItems":[';
	for ( i = 0; i < this.ligneCommandes.length; i++) {
		strJSON += this.ligneCommandes[i].toString();
		if (i < this.ligneCommandes.length - 1) {
			strJSON += ",";
		}
	}
	strJSON += "]}";
	return strJSON;
};

// Objet LigneCommande

function LigneCommande(menuItemId, quantite) {
	this.envoye = false;
	this.menuItemId = menuItemId;
	this.quantite = quantite;
	this.note = null;
}
LigneCommande.prototype.toString = function() {
	return '{"menuItemId":"' + this.menuItemId + '", "quantite":"' + this.quantite + '"}';
};