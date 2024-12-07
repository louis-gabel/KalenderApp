-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server-Version:               11.6.2-MariaDB - mariadb.org binary distribution
-- Server-Betriebssystem:        Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Exportiere Struktur von Tabelle calendar.calendarevent
DROP TABLE IF EXISTS `calendarevent`;
CREATE TABLE IF NOT EXISTS `calendarevent` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `calendarevent_ibfk_1_idx` (`session_id`),
  KEY `fk_room` (`room_id`),
  KEY `fk_user` (`user_id`) USING BTREE,
  CONSTRAINT `calendarevent_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `coursesession` (`session_id`),
  CONSTRAINT `fk_room` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `registration` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle calendar.calendarevent: ~6 rows (ungefähr)
DELETE FROM `calendarevent`;
INSERT INTO `calendarevent` (`event_id`, `session_id`, `user_id`, `start_time`, `end_time`, `room_id`) VALUES
	(1, 13, 15, '2024-12-10 08:00:00', '2024-12-10 16:00:00', 1),
	(2, 13, 15, '2024-12-11 09:00:00', '2024-12-11 16:00:00', 2),
	(3, 14, 15, '2024-12-21 09:00:00', '2024-12-21 15:00:00', 2),
	(4, 14, 15, '2024-12-23 09:00:00', '2024-12-23 15:00:00', 6),
	(5, 13, 14, '2024-12-10 08:00:00', '2024-12-10 16:00:00', 1),
	(6, 13, 14, '2024-12-11 09:00:00', '2024-12-11 16:00:00', 2);

-- Exportiere Struktur von Tabelle calendar.category
DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle calendar.category: ~4 rows (ungefähr)
DELETE FROM `category`;
INSERT INTO `category` (`category_id`, `category_name`) VALUES
	(1, 'Technik'),
	(2, 'Wirtschaft'),
	(3, 'Sozialwesen'),
	(4, 'Gesundheitswesen');

-- Exportiere Struktur von Tabelle calendar.course
DROP TABLE IF EXISTS `course`;
CREATE TABLE IF NOT EXISTS `course` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `max_participants` int(11) NOT NULL,
  `duration` int(11) DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle calendar.course: ~6 rows (ungefähr)
DELETE FROM `course`;
INSERT INTO `course` (`course_id`, `title`, `description`, `category_id`, `max_participants`, `duration`) VALUES
	(10, 'Bwl Einführung', 'Grundlagen der Wirtschaftslehre', 2, 20, 30),
	(11, 'Vwl Fortgeschritten', 'Krassere Themen der Wirtschaftslehre', 2, 15, 45),
	(12, 'Mobile Computing', 'Entwicklung einer Web App', 1, 15, 100),
	(13, 'Programmieren', 'Programmierung in Java und Html', 1, 24, 24),
	(14, 'Humanmedizin', 'Lehre der Organe', 4, 25, 10),
	(15, 'Reden im Studium', 'Wie unterhalte ich mich mit anderen Leuten?', 3, 4, 14);

-- Exportiere Struktur von Tabelle calendar.coursesession
DROP TABLE IF EXISTS `coursesession`;
CREATE TABLE IF NOT EXISTS `coursesession` (
  `session_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `course_id` (`course_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `coursesession_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  CONSTRAINT `coursesession_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle calendar.coursesession: ~2 rows (ungefähr)
DELETE FROM `coursesession`;
INSERT INTO `coursesession` (`session_id`, `course_id`, `teacher_id`, `start_date`, `end_date`) VALUES
	(13, 10, 15, '2024-12-10', '2024-12-11'),
	(14, 11, 15, '2024-12-21', '2024-12-23');

-- Exportiere Struktur von Tabelle calendar.registration
DROP TABLE IF EXISTS `registration`;
CREATE TABLE IF NOT EXISTS `registration` (
  `registration_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `session_id` int(11) DEFAULT NULL,
  `status` enum('angemeldet','abgemeldet') DEFAULT 'angemeldet',
  PRIMARY KEY (`registration_id`),
  KEY `user_id` (`user_id`),
  KEY `registration_ibfk_2_idx` (`session_id`),
  CONSTRAINT `registration_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `registration_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `coursesession` (`session_id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle calendar.registration: ~2 rows (ungefähr)
DELETE FROM `registration`;
INSERT INTO `registration` (`registration_id`, `user_id`, `session_id`, `status`) VALUES
	(72, 15, 13, 'angemeldet'),
	(73, 15, 14, 'angemeldet'),
	(74, 14, 13, 'angemeldet');

-- Exportiere Struktur von Tabelle calendar.role
DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle calendar.role: ~3 rows (ungefähr)
DELETE FROM `role`;
INSERT INTO `role` (`role_id`, `role_name`) VALUES
	(1, 'Admin'),
	(2, 'Dozent'),
	(3, 'Student');

-- Exportiere Struktur von Tabelle calendar.room
DROP TABLE IF EXISTS `room`;
CREATE TABLE IF NOT EXISTS `room` (
  `room_id` int(11) NOT NULL AUTO_INCREMENT,
  `room_name` varchar(50) NOT NULL,
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle calendar.room: ~8 rows (ungefähr)
DELETE FROM `room`;
INSERT INTO `room` (`room_id`, `room_name`) VALUES
	(1, 'Room A'),
	(2, 'Room B'),
	(3, 'Room C'),
	(4, 'Room D'),
	(5, 'Room E'),
	(6, 'Room F'),
	(7, 'Room G'),
	(8, 'Room H');

-- Exportiere Struktur von Tabelle calendar.teachercourse
DROP TABLE IF EXISTS `teachercourse`;
CREATE TABLE IF NOT EXISTS `teachercourse` (
  `teacher_course_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`teacher_course_id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `teachercourse_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `teachercourse_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle calendar.teachercourse: ~6 rows (ungefähr)
DELETE FROM `teachercourse`;
INSERT INTO `teachercourse` (`teacher_course_id`, `user_id`, `course_id`) VALUES
	(1, 15, 10),
	(2, 15, 11),
	(3, 15, 12),
	(4, 15, 13),
	(5, 17, 14),
	(6, 17, 15);

-- Exportiere Struktur von Tabelle calendar.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `titel` varchar(50) DEFAULT NULL,
  `prename` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle calendar.user: ~4 rows (ungefähr)
DELETE FROM `user`;
INSERT INTO `user` (`user_id`, `email`, `titel`, `prename`, `surname`, `role_id`, `password`) VALUES
	(14, 'student@test.de', NULL, 'student', 'test', 3, '$2b$10$kTK8Hab0BpdcoEfm8EDuauxLWdYscGhZGkO1Vik.FXMFl7BgAPe96'),
	(15, 'dozent@test.de', 'Dr.', 'dozent', 'test', 2, '$2b$10$L0xqkFsak.gpe0tbbdCUc.dnAeNLdom/VzjBkRQq10qk3YDotn1uO'),
	(16, 'admin@test.de', NULL, 'admin', 'test', 1, '$2b$10$n2aNG5QAaFtmsFYOxtZXQ.7dkJeLqQPaLlnh3uI/GJ6na1wDjJNCq'),
	(17, 'dozent@2.de', 'Prof.', 'dozent', 'zwei', 2, '$2b$10$09gZrCKv.vSape5KYJU03eXvxB3qLohx6F.cVWPEkFjow7SWUDYBS');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
