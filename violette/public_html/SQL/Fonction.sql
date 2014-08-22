-- phpMyAdmin SQL Dump
-- version 4.1.8
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Ven 22 Août 2014 à 14:24
-- Version du serveur :  5.5.37-cll
-- Version de PHP :  5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `violette_DB`
--

-- --------------------------------------------------------

--
-- Structure de la table `FONCTION`
--

CREATE TABLE IF NOT EXISTS `FONCTION` (
  `FONCTION_ID` int(11) NOT NULL AUTO_INCREMENT,
  `TITRE` varchar(30) NOT NULL,
  PRIMARY KEY (`FONCTION_ID`),
  UNIQUE KEY `titre` (`TITRE`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Contenu de la table `FONCTION`
--

INSERT INTO `FONCTION` (`FONCTION_ID`, `TITRE`) VALUES
(4, 'Busboy'),
(2, 'Cuisinier'),
(1, 'Gérant'),
(5, 'Plongeur'),
(3, 'Serveur');

