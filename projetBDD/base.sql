CREATE DATABASE IF NOT EXISTS `gestionUtilisateurs` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `gestionUtilisateurs`;


DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE `utilisateur` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `adresse_mail` varchar(80) NOT NULL UNIQUE,
  `mdp` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
