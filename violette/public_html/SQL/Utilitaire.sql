-- phpMyAdmin SQL Dump
-- version 4.1.8
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Ven 22 Août 2014 à 14:27
-- Version du serveur :  5.5.37-cll
-- Version de PHP :  5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `violette_DB`
--

-- --------------------------------------------------------

--
-- Structure de la table `utilitaire`
--

CREATE TABLE IF NOT EXISTS `utilitaire` (
  `id` tinyint(4) NOT NULL,
  `nom` varchar(10) NOT NULL,
  `float_value` float DEFAULT NULL,
  `int_value` int(11) DEFAULT NULL,
  `text_value` text,
  `real_value` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `utilitaire_nom_idx` (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `utilitaire`
--

INSERT INTO `utilitaire` (`id`, `nom`, `float_value`, `int_value`, `text_value`, `real_value`) VALUES
(0, 'tvq', NULL, NULL, NULL, 0.09975),
(1, 'tps', NULL, NULL, NULL, 0.05);

