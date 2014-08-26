-- phpMyAdmin SQL Dump
-- version 4.1.8
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Mar 26 Août 2014 à 21:06
-- Version du serveur :  5.5.37-cll
-- Version de PHP :  5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `violette_DB`
--

-- --------------------------------------------------------

--
-- Structure de la table `FACTURE`
--

DROP TABLE IF EXISTS `FACTURE`;
CREATE TABLE IF NOT EXISTS `FACTURE` (
  `FACTURE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `EMPLOYE_ID` int(11) NOT NULL,
  `DATE` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `NUMERO_TABLE` tinyint(3) NOT NULL,
  `SIEGE` tinyint(3) NOT NULL,
  `COMPLET` tinyint(1) DEFAULT '0',
  `SOUS_TOTAL` decimal(5,2) DEFAULT NULL,
  `TOTAL` decimal(5,2) DEFAULT NULL,
  `TPS` decimal(5,2) DEFAULT NULL,
  `TVQ` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`FACTURE_ID`),
  KEY `EMPLOYE_ID` (`EMPLOYE_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=3 ;

--
-- Contenu de la table `FACTURE`
--

INSERT INTO `FACTURE` (`FACTURE_ID`, `EMPLOYE_ID`, `DATE`, `NUMERO_TABLE`, `SIEGE`, `COMPLET`, `SOUS_TOTAL`, `TOTAL`, `TPS`, `TVQ`) VALUES
(1, 1, '2014-08-22 20:53:00', 1, 1, 1, '8.99', '10.34', '0.45', '0.90'),
(2, 2, '2014-08-22 20:52:53', 4, 1, 1, '7.25', '8.33', '0.36', '0.72');

--
-- Déclencheurs `FACTURE`
--
DROP TRIGGER IF EXISTS `FACTURE_BDEL`;
DELIMITER //
CREATE TRIGGER `FACTURE_BDEL` BEFORE DELETE ON `FACTURE`
 FOR EACH ROW BEGIN 
	IF (OLD.DATE > NOW() - 157784760000) AND (OLD.COMPLET = true) THEN
		SIGNAL SQLSTATE VALUE '45000' 
        set MESSAGE_TEXT = 'Les facture complete doivent etre garder pour 5 ans.' ;
	END IF;
END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `FACTURE_BUPD`;
DELIMITER //
CREATE TRIGGER `FACTURE_BUPD` BEFORE UPDATE ON `FACTURE`
 FOR EACH ROW BEGIN
	IF (OLD.COMPLET = TRUE) THEN
    	SIGNAL SQLSTATE VALUE '45000'
        SET MESSAGE_TEXT = "Impossible de modifier une facture complete.";
    ELSEIF (NEW.COMPLET = TRUE) THEN
    	update LIGNE_COMMAND_ITEM 
        set SERVI = true
        where FACTURE_ID = NEW.FACTURE_ID and SERVI = false;
    END IF;
END
//
DELIMITER ;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `FACTURE`
--
ALTER TABLE `FACTURE`
  ADD CONSTRAINT `COMMANDE_ibfk_1` FOREIGN KEY (`EMPLOYE_ID`) REFERENCES `EMPLOYE` (`EMPLOYE_ID`);
