-- phpMyAdmin SQL Dump
-- version 4.1.8
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Mar 26 Août 2014 à 21:08
-- Version du serveur :  5.5.37-cll
-- Version de PHP :  5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `violette_DB`
--

-- --------------------------------------------------------

--
-- Structure de la table `MENU_ITEM`
--

DROP TABLE IF EXISTS `MENU_ITEM`;
CREATE TABLE IF NOT EXISTS `MENU_ITEM` (
  `MENU_ITEM_ID` int(11) NOT NULL AUTO_INCREMENT,
  `TITRE` varchar(40) COLLATE utf8_bin NOT NULL,
  `SECTION_ID` int(11) NOT NULL,
  `DESCRIPTION` varchar(300) COLLATE utf8_bin NOT NULL,
  `PRIX` decimal(4,2) NOT NULL,
  PRIMARY KEY (`MENU_ITEM_ID`),
  UNIQUE KEY `TITRE` (`TITRE`),
  KEY `SECTION_ID` (`SECTION_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=36 ;

--
-- Contenu de la table `MENU_ITEM`
--

INSERT INTO `MENU_ITEM` (`MENU_ITEM_ID`, `TITRE`, `SECTION_ID`, `DESCRIPTION`, `PRIX`) VALUES
(1, 'SOUPE AUX POIS', 1, 'Soupe aux pois avec morceaux de jambon', '2.99'),
(2, 'SOUPE AUX NOUILLES ET POULET', 1, 'Avec nouilles aux oeufs et morceaux de poulet', '2.50'),
(3, 'GASPACHO', 1, 'Soupe froide aux tomates', '3.99'),
(4, 'SOUPE MINESTRONE', 1, 'Soupe aux légumes (pois, carottes, céleri, oignons)', '2.25'),
(5, 'AILES DE POULET', 2, 'Poulet avec sauce piquante', '4.75'),
(6, 'NACHOS ', 2, 'chips mexicasa avec fromage fondu, salsa, crème sûre et jalapeno', '6.99'),
(7, 'BÂTONS DE FROMAGE', 2, 'Bâtonnets de fromage mozzarella pannés', '4.15'),
(8, 'RONDELLES D’OIGNON', 2, 'Rondelles d''oignons rouges assaisonnés', '3.25'),
(9, 'SALADE CÉSAR', 3, 'Laitue romaine avec vinaigrette césar à l''ail', '5.00'),
(10, 'SALADE CÉSAR AU POULET', 3, 'Laitue romaine avec vinaigrette césar à l''ail, et lani`res de poulet grillé', '8.00'),
(11, 'SALADE GRECQUE', 3, 'Laitue verte avec fromage feta, olives noires et basilic', '6.00'),
(12, 'SALADE JARDINIÈRE', 3, 'Laitue verte avec huile d''olives et estragon', '4.00'),
(13, 'HAMBURGER', 4, 'Ambourgeois original avec laitue et tomate', '4.00'),
(14, 'CHEESEBURGER', 4, 'Bœuf haché servi avec fromage cheddar, laitue et tomate', '5.50'),
(15, 'SANDWICH ''SMOKED MEAT''', 4, 'Sandwich à la viande fumée, servi avec cornichon et choucroute', '6.99'),
(16, 'CLUB SANDWICH', 4, 'Avec bacon, laitue, tomate et mayonnaise', '4.99'),
(17, 'SPAGHETTI NAPOLITANA', 4, 'Sauce aux tomates', '5.00'),
(18, 'SPAGHETTI BOLOGNAISE', 4, 'Sauce à la viande', '5.99'),
(19, 'LASAGNE', 4, 'Gratinée au four avec sauce à la viande et sauce béchamel', '8.00'),
(20, 'PÂTÉ CHINOIS', 4, 'Steak, blé d''inde, patates', '6.50'),
(21, 'COUPE GLACÉE', 5, 'Crème glacée à la vanille, sauce chocolat, arachides et cerise', '3.99'),
(22, 'GÂTEAU AU FROMAGE', 5, 'Style ''New York'', avec sauce aux cerises', '4.00'),
(23, 'BROWNIE AU CHOCOLAT', 5, 'Servi avec sauce au chocolat bien chaude. Contient des arachides', '3.25'),
(24, 'TARTE AUX POMMES', 5, 'Avec pommes Courtland du Québec', '3.75'),
(25, 'POUDING CHÔMEUR', 5, 'Avec sauce à la cassonade', '3.00'),
(26, 'THÉ', 6, 'Thé Earl Grey', '2.00'),
(27, 'CAFÉ', 6, 'Café de Colombie', '2.00'),
(28, 'LAIT', 6, 'Lait de vache 2%', '2.00'),
(29, 'COLA', 6, 'Coca-Cola', '1.99'),
(30, 'EAU MINÉRALE', 6, 'Eau Perrier', '3.00'),
(31, 'EAU EN BOUTEILLE', 6, 'Eau Labrador', '1.99'),
(32, 'PATATES FRITES', 7, 'Pommes de terre du Québec bien grasses', '3.00'),
(33, 'POUTINE', 7, 'Frites, fromage cottage, sauve brune', '5.00'),
(34, 'PAIN À L''AIL', 7, 'Baguette de pain avec beurre à l''ail', '2.00'),
(35, 'BACON', 7, 'Tranches de bacon fumé', '2.00');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `MENU_ITEM`
--
ALTER TABLE `MENU_ITEM`
  ADD CONSTRAINT `MENU_ITEM_ibfk_1` FOREIGN KEY (`SECTION_ID`) REFERENCES `SECTION` (`SECTION_ID`);
