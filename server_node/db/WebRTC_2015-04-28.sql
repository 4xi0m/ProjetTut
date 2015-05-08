# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Hôte: localhost (MySQL 5.6.23)
# Base de données: WebRTC
# Temps de génération: 2015-04-28 14:00:29 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Affichage de la table Staff
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Staff`;

CREATE TABLE `Staff` (
  `login` varchar(100) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(50) DEFAULT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `passphrase` varchar(100) NOT NULL DEFAULT '',
  `id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `Staff` WRITE;
/*!40000 ALTER TABLE `Staff` DISABLE KEYS */;

INSERT INTO `Staff` (`login`, `email`, `name`, `firstname`, `passphrase`, `id`)
VALUES
	('yanchaowang@gmail.com','yanchaowang@gmail.com','wang','yanchao','123456',0),
	('admin@admin.fr','admin@admin.fr','Admin','chief','123456',1);

/*!40000 ALTER TABLE `Staff` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table User
# ------------------------------------------------------------

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `email` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(50) DEFAULT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `passphrase` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;

INSERT INTO `User` (`email`, `name`, `firstName`, `id`, `passphrase`)
VALUES
	('a@b.c','User','abc',2222,'abc'),
	('abc@gmail.com','wang','yanchao',1,'simplepassword'),
	('yanchaowang2@gmail.com','wang','yanchao',2,'123456'),
	('yanchaowang@gmail.com','wang','yanchao',3,'123456'),
	('yanchaowang3@gmail.com','wang','yanchao',123460,'123456'),
	('yancha2owang3@gmail.com','wang','yanchao',123461,'123456'),
	('yancha2owang4@gmail.com','wang','yanchao',123463,'123456'),
	('yancha22owang4@gmail.com','wang','yanchao',123465,'123456'),
	('yancha222owang4@gmail.com','wang','yanchao',123467,'123456'),
	('yancdha222owang4@gmail.com','wang','yanchao',123469,'123456'),
	('yancddha222owang4@gmail.com','wang','yanchao',123470,'123456'),
	('yadha222owang4@gmail.com','wang','yanchao',123471,'123456'),
	('yaa222owang4@gmail.com','wang','yanchao',123474,'123456'),
	('yaa422owang4@gmail.com','wang','yanchao',123475,'123456'),
	('yaa4fdfs22owang4@gmail.com','wang','yanchao',123476,'123456'),
	('yandfdchaowang@gmail.com','wang','yanchao',123480,'123456'),
	('yanchaodfwang@gmail.com','wang','yanchao',123482,'123456');

/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
