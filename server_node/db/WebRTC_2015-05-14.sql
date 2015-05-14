# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Hôte: localhost (MySQL 5.6.23)
# Base de données: WebRTC
# Temps de génération: 2015-05-14 20:19:55 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Affichage de la table CallRecord
# ------------------------------------------------------------

DROP TABLE IF EXISTS `CallRecord`;

CREATE TABLE `CallRecord` (
  `start_time` datetime NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `comment` varchar(1000) NOT NULL DEFAULT '',
  `staff_id` int(11) unsigned NOT NULL,
  `end_time` datetime NOT NULL,
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `location` varchar(100) DEFAULT NULL,
  `wait_time` int(11) DEFAULT NULL COMMENT 'in seconds',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `callrecord_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `callrecord_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `CallRecord` WRITE;
/*!40000 ALTER TABLE `CallRecord` DISABLE KEYS */;

INSERT INTO `CallRecord` (`start_time`, `user_id`, `comment`, `staff_id`, `end_time`, `id`, `location`, `wait_time`)
VALUES
	('2015-05-13 12:00:00',2,'test',2,'2015-05-13 12:12:00',3,'phone',120);

/*!40000 ALTER TABLE `CallRecord` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table Staff
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Staff`;

CREATE TABLE `Staff` (
  `email` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(50) NOT NULL DEFAULT '',
  `first_name` varchar(50) NOT NULL DEFAULT '',
  `passphrase` binary(16) NOT NULL,
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `Staff` WRITE;
/*!40000 ALTER TABLE `Staff` DISABLE KEYS */;

INSERT INTO `Staff` (`email`, `name`, `first_name`, `passphrase`, `id`, `date_created`)
VALUES
	('admin@admin.fr','admin','admin',X'31323334353600000000000000000000',2,'2015-05-12 00:00:00');

/*!40000 ALTER TABLE `Staff` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table User
# ------------------------------------------------------------

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `email` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(50) NOT NULL DEFAULT '',
  `first_name` varchar(50) NOT NULL DEFAULT '',
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `passphrase` varchar(32) NOT NULL DEFAULT '',
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;

INSERT INTO `User` (`email`, `name`, `first_name`, `id`, `passphrase`, `date_created`)
VALUES
	('a@a.a','a','a',2,'3ad550c0a82e2a4ce1ad83c612cf602a','2015-05-12 21:53:08');

/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
