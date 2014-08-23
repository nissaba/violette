-- phpMyAdmin SQL Dump
-- version 4.1.8
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Ven 22 Août 2014 à 15:48
-- Version du serveur :  5.5.37-cll
-- Version de PHP :  5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `violette_DB`
--

-- --------------------------------------------------------

--
-- Structure de la table `LIGNE_COMMAND_ITEM`
--

CREATE TABLE IF NOT EXISTS `LIGNE_COMMAND_ITEM` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `FACTURE_ID` int(11) NOT NULL,
  `MENU_ITEM_ID` int(11) NOT NULL,
  `QUANTITE` smallint(6) NOT NULL DEFAULT '1',
  `PRIX_UNITAIRE` decimal(4,2) DEFAULT NULL,
  `NOTE` varchar(200) DEFAULT NULL,
  `SERVI` tinyint(1) NOT NULL DEFAULT '0',
  `PRISE_EN_CHARGE` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `FK_EMPLOYE_ID_idx` (`FACTURE_ID`),
  KEY `FK_MENU_ITEM_ID_idx` (`MENU_ITEM_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Contenu de la table `LIGNE_COMMAND_ITEM`
--

INSERT INTO `LIGNE_COMMAND_ITEM` (`ID`, `FACTURE_ID`, `MENU_ITEM_ID`, `QUANTITE`, `PRIX_UNITAIRE`, `NOTE`, `SERVI`, `PRISE_EN_CHARGE`) VALUES
(1, 0, 1, 2, '2.00', NULL, 0, 0),
(2, 1, 1, 1, '1.00', NULL, 0, 0),
(3, 1, 2, 1, '1.00', NULL, 0, 0),
(4, 0, 3, 1, '0.99', NULL, 0, 0),
(5, 1, 5, 1, '0.99', NULL, 0, 0),
(6, 1, 6, 1, '10.22', NULL, 1, 0),
(7, 1, 10, 1, '3.30', NULL, 0, 0),
(8, 1, 12, 1, '4.00', NULL, 0, 0),
(9, 0, 13, 1, '4.00', NULL, 0, 0);

--
-- Déclencheurs `LIGNE_COMMAND_ITEM`
--
DROP TRIGGER IF EXISTS `LIGNE_COMMANDE_ITEM_BDEL`;
DELIMITER //
CREATE TRIGGER `LIGNE_COMMANDE_ITEM_BDEL` BEFORE DELETE ON `LIGNE_COMMAND_ITEM`
 FOR EACH ROW BEGIN
	IF (EXISTS(SELECT FACTURE_ID AS F 
               FROM FACTURE 
               WHERE F.COMPLET = TRUE
              AND F.FACTURE_ID = OLD.FACTURE_ID)) THEN
   		 SIGNAL SQLSTATE VALUE '45000'
         SET MESSAGE_TEXT = "IMPOSSIBLE D'EFFACER UNE LIGNE DANS UNE FACTURE COMPLETE";
    END IF;
END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `LIGNE_COMMAND_ITEM_ADEL`;
DELIMITER //
CREATE TRIGGER `LIGNE_COMMAND_ITEM_ADEL` AFTER DELETE ON `LIGNE_COMMAND_ITEM`
 FOR EACH ROW BEGIN
    UPDATE FACTURE as f 
    SET SOUS_TOTAL = (select sum(PRIX_UNITAIRE*QUANTITE) 
                      from LIGNE_COMMAND_ITEM where FACTURE_ID = f.FACTURE_ID),
        TPS = SOUS_TOTAL * (select real_value from utilitaire where nom = 'tps'),
        TVQ = SOUS_TOTAL * (select real_value from utilitaire where nom = 'tvq'),
        TOTAL = SOUS_TOTAL + TPS + TVQ
	WHERE f.FACTURE_ID = OLD.FACTURE_ID;
END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `LIGNE_COMMAND_ITEM_AINS`;
DELIMITER //
CREATE TRIGGER `LIGNE_COMMAND_ITEM_AINS` AFTER INSERT ON `LIGNE_COMMAND_ITEM`
 FOR EACH ROW BEGIN
    UPDATE FACTURE as f 
    SET SOUS_TOTAL = (select sum(PRIX_UNITAIRE*QUANTITE) 
                      from LIGNE_COMMAND_ITEM where FACTURE_ID = f.FACTURE_ID),
        TPS = SOUS_TOTAL * (select real_value from utilitaire where nom = 'tps'),
        TVQ = SOUS_TOTAL * (select real_value from utilitaire where nom = 'tvq'),
        TOTAL = SOUS_TOTAL + TPS + TVQ
	WHERE f.FACTURE_ID = NEW.FACTURE_ID;
END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `LIGNE_COMMAND_ITEM_AUPD`;
DELIMITER //
CREATE TRIGGER `LIGNE_COMMAND_ITEM_AUPD` AFTER UPDATE ON `LIGNE_COMMAND_ITEM`
 FOR EACH ROW BEGIN
    UPDATE FACTURE as f 
    SET SOUS_TOTAL = (select sum(PRIX_UNITAIRE*QUANTITE) 
                      from LIGNE_COMMAND_ITEM where FACTURE_ID = f.FACTURE_ID),
        TPS = SOUS_TOTAL * (select real_value from utilitaire where nom = 'tps'),
        TVQ = SOUS_TOTAL * (select real_value from utilitaire where nom = 'tvq'),
        TOTAL = SOUS_TOTAL + TPS + TVQ
	WHERE f.FACTURE_ID = NEW.FACTURE_ID;
END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `LIGNE_COMMAND_ITEM_BINS`;
DELIMITER //
CREATE TRIGGER `LIGNE_COMMAND_ITEM_BINS` BEFORE INSERT ON `LIGNE_COMMAND_ITEM`
 FOR EACH ROW BEGIN
IF (EXISTS(SELECT * FROM FACTURE AS F
             WHERE COMPLET = TRUE 
              AND F.FACTURE_ID = NEW.FACTURE_ID)) 
    THEN
		SIGNAL SQLSTATE VALUE '45000'
        SET MESSAGE_TEXT = "Impossible d'ajouter un item a une facutre complete";
	ELSE
	set NEW.PRIX_UNITAIRE = (Select PRIX 
                             from MENU_ITEM as m where 
                             m.MENU_ITEM_ID = NEW.MENU_ITEM_ID);
END IF;
END
//
DELIMITER ;
DROP TRIGGER IF EXISTS `LIGNE_COMMAND_ITEM_BUPD`;
DELIMITER //
CREATE TRIGGER `LIGNE_COMMAND_ITEM_BUPD` BEFORE UPDATE ON `LIGNE_COMMAND_ITEM`
 FOR EACH ROW BEGIN
	IF (EXISTS(SELECT * FROM FACTURE AS F
              WHERE F.FACTURE_ID = OLD.FACTURE_ID
              AND F.COMPLET = TRUE)) THEN
    	SIGNAL SQLSTATE VALUE '45000'
        SET MESSAGE_TEXT = "Impossible de modifier un item d<une facture complete.";
    END IF;
END
//
DELIMITER ;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `LIGNE_COMMAND_ITEM`
--
ALTER TABLE `LIGNE_COMMAND_ITEM`
  ADD CONSTRAINT `FK_MENU_ITEM_ID` FOREIGN KEY (`MENU_ITEM_ID`) REFERENCES `MENU_ITEM` (`MENU_ITEM_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `LIGNE_COMMAND_ITEM_ibfk_1` FOREIGN KEY (`FACTURE_ID`) REFERENCES `FACTURE` (`FACTURE_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;