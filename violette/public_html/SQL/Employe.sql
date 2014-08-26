-- phpMyAdmin SQL Dump
-- version 4.1.8
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Mar 26 Août 2014 à 21:05
-- Version du serveur :  5.5.37-cll
-- Version de PHP :  5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `violette_DB`
--

-- --------------------------------------------------------

--
-- Structure de la table `EMPLOYE`
--

DROP TABLE IF EXISTS `EMPLOYE`;
CREATE TABLE IF NOT EXISTS `EMPLOYE` (
  `EMPLOYE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `USERNAME` varchar(10) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  `NOM` varchar(20) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  `PRENOM` varchar(10) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  `PASSWORD` varchar(40) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  `FONCTION_ID` int(11) NOT NULL,
  `COMMANTAIRE` varchar(300) CHARACTER SET armscii8 COLLATE armscii8_bin DEFAULT NULL,
  PRIMARY KEY (`EMPLOYE_ID`),
  UNIQUE KEY `nom` (`NOM`),
  KEY `FONCTION_ID` (`FONCTION_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=11 ;

--
-- Contenu de la table `EMPLOYE`
--

INSERT INTO `EMPLOYE` (`EMPLOYE_ID`, `USERNAME`, `NOM`, `PRENOM`, `PASSWORD`, `FONCTION_ID`, `COMMANTAIRE`) VALUES
(1, 'desjus', 'Desjardins', 'Justin', 'b1b3773a05c0ed0176787a4f1574ff0075f7521e', 2, 'qwerty'),
(2, 'tanclau', 'Tanguy', 'Claude', '1fc854110e5532480000542834f453de31936c2f', 2, 'q1w2e3r4'),
(3, 'beausy', 'Beaulieu', 'Sylvie', 'e65bf6213845058ee6dcca0db8a18cd17cc70fe7', 3, 'a273RG'),
(4, 'clynan', 'Clyde', 'Nancy', 'da0be7ff80b86061d7925b25185f9c045aa1e511', 3, 'FD222t'),
(5, 'sanrod', 'Sanchez', 'Rodrigue', '664feb877ee7b5854a400c7b0c73b68d4556df9c', 1, 'R8v68x'),
(6, 'lesa', 'Leclerc', 'Sabine', '111813730153a9e18067d45eaf3ef3c082f670fc', 3, 'FBBy9r'),
(7, 'pouri', 'Pouliot', 'Richard', 'c8d451b0e1f6d1b8c09fbf6d3c62e0b2a7566ede', 5, '2PNHwG'),
(8, 'mowen', 'Moreau', 'Wendy', 'bec5e15e613a79d8dfe0fe39b8c12eea67df15c3', 3, 'JY7s4g'),
(9, 'pouchan', 'Poulain', 'Chantale', '8671fb07d5e293742f3270c9bcf4aa40788e411d', 1, 'KXX5bU'),
(10, 'armar', 'Arcand', 'Marc', '49971187fe3a57e6644341648867dc765f76c4ff', 4, 'dp3yuS');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `EMPLOYE`
--
ALTER TABLE `EMPLOYE`
  ADD CONSTRAINT `EMPLOYE_ibfk_1` FOREIGN KEY (`FONCTION_ID`) REFERENCES `FONCTION` (`FONCTION_ID`);