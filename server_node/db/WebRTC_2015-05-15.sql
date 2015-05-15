# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Hôte: localhost (MySQL 5.6.23)
# Base de données: WebRTC
# Temps de génération: 2015-05-15 14:21:51 +0000
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
  CONSTRAINT `callrecord_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`),
  CONSTRAINT `callrecord_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `Staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `CallRecord` WRITE;
/*!40000 ALTER TABLE `CallRecord` DISABLE KEYS */;

INSERT INTO `CallRecord` (`start_time`, `user_id`, `comment`, `staff_id`, `end_time`, `id`, `location`, `wait_time`)
VALUES
	('2015-05-13 12:00:00',2,'No Comment',2,'2015-05-13 12:10:00',8,'phone',10),
	('2015-05-13 12:00:00',2,'No Comment',2,'2015-05-13 12:10:00',9,'phone',10),
	('2015-05-13 12:00:00',2,'No Comment',2,'2015-05-13 12:10:00',10,'phone',10),
	('2015-05-13 12:00:00',2,'No Comment',2,'2015-05-13 12:10:00',11,'phone',10),
	('2015-05-13 12:00:00',2,'No Comment',2,'2015-05-13 12:10:00',12,'phone',10),
	('2015-05-13 12:00:00',2,'No Comment',2,'2015-05-13 12:10:00',13,'phone',10),
	('2015-05-13 12:00:00',2,'No Comment',2,'2015-05-13 12:10:00',14,'phone',10),
	('2015-05-13 12:00:00',2,'No Comment',2,'2015-05-13 12:10:00',15,'phone',10),
	('2015-05-13 12:00:00',2,'No Comment',2,'2015-05-13 12:10:00',16,'phone',10),
	('2015-05-13 12:00:00',2,'No Comment',2,'2015-05-13 12:10:00',17,'phone',10),
	('2015-05-13 12:00:00',2,'No Comment',2,'2015-05-13 12:10:00',18,'phone',10),
	('2015-05-13 12:00:00',2,'No Comment',2,'2015-05-13 12:10:00',19,'phone',10),
	('2015-05-13 12:00:00',2,'Yes Comment',2,'2015-05-13 18:00:00',20,'phone',10),
	('2015-05-13 12:00:00',2,'No Comment',2,'2015-05-13 12:10:00',21,'phone',10);

/*!40000 ALTER TABLE `CallRecord` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table Staff
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Staff`;

CREATE TABLE `Staff` (
  `email` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(50) NOT NULL DEFAULT '',
  `first_name` varchar(50) NOT NULL DEFAULT '',
  `passphrase` varchar(32) NOT NULL DEFAULT '',
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `Staff` WRITE;
/*!40000 ALTER TABLE `Staff` DISABLE KEYS */;

INSERT INTO `Staff` (`email`, `name`, `first_name`, `passphrase`, `id`, `date_created`)
VALUES
	('admin@admin.fr','admin','admin','123456\0\0\0\0\0\0\0\0\0\0',2,'2015-05-12 00:00:00'),
	('staff@a.a','staff1','staff1','d1677c6faed893b983ee5057cb66e851',3,'2015-05-15 15:24:04');

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
	('a@a.a','a','a',2,'1e778afe62f3e846a1e234b8dc8f3233','2015-05-12 21:53:08'),
	('test@test.fr','test','test',3,'a3de45ef8521ca59050a8513e8b6f9d8','2015-05-15 14:44:07'),
	('tes1t@test.fr','test','test',11,'372b029a899019b340d95530349151ec','2015-05-15 14:48:56');

/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
