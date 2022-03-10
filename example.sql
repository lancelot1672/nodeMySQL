--
-- Table structure for table `author`
--
 
 
CREATE TABLE `author` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `profile` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `author`
--
 
INSERT INTO `author` VALUES (1,'egoing','developer');
INSERT INTO `author` VALUES (2,'duru','database administrator');
INSERT INTO `author` VALUES (3,'taeho','data scientist, developer');
 
--
-- Table structure for table `topic`
--
 
CREATE TABLE `topic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  `description` text,
  `created` datetime NOT NULL,
  `author_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
 
--
-- Dumping data for table `topic`
--
 
INSERT INTO `topic` VALUES (1,'MySQL','MySQL is...','2018-01-01 12:10:11','lancelot1672');
INSERT INTO `topic` VALUES (2,'Oracle','Oracle is ...','2018-01-03 13:01:10','lancelot1672');
INSERT INTO `topic` VALUES (3,'SQL Server','SQL Server is ...','2018-01-20 11:01:10','weak1331');
INSERT INTO `topic` VALUES (4,'PostgreSQL','PostgreSQL is ...','2018-01-23 01:03:03','kdr8749');
INSERT INTO `topic` VALUES (5,'MongoDB','MongoDB is ...','2018-01-30 12:31:03','lancelot1672');
INSERT INTO `topic` VALUES (6,'CSS','CSS is ...','2018-01-30 12:31:05','lancelot1672');

CREATE TABLE `member` (
  `user_id` varchar(15) NOT NULL,
  `user_pw` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `profile` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
);
--
-- Dumping data for table `member`
--
 
INSERT INTO `member` VALUES ('lancelot1672','1111','Dore','developer');
INSERT INTO `member` VALUES ('weak1331','1111','duru','database administrator');
INSERT INTO `member` VALUES ('kdr8749','1111','taeho','data scientist, developer');