-- phpMyAdmin SQL Dump
-- version 4.1.8
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Mar 26 Août 2014 à 21:09
-- Version du serveur :  5.5.37-cll
-- Version de PHP :  5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `violette_DB`
--

-- --------------------------------------------------------

--
-- Structure de la table `SECTION`
--

DROP TABLE IF EXISTS `SECTION`;
CREATE TABLE IF NOT EXISTS `SECTION` (
  `SECTION_ID` int(11) NOT NULL AUTO_INCREMENT,
  `TITRE` varchar(30) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`SECTION_ID`),
  UNIQUE KEY `TITRE` (`TITRE`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=8 ;

--
-- Contenu de la table `SECTION`
--

INSERT INTO `SECTION` (`SECTION_ID`, `TITRE`) VALUES
(6, 'Boissons'),
(5, 'Desserts'),
(2, 'Entrées'),
(7, 'Les À-Côtés'),
(4, 'Plats'),
(3, 'Salades'),
(1, 'Soupes');
