-- Persist Google Sheet student rows for dashboard listing.
-- Run against: utavqate_msbsec_wa

CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sn` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL DEFAULT '',
  `its` varchar(50) NOT NULL DEFAULT '',
  `father_name` varchar(255) NOT NULL DEFAULT '',
  `father_mobile` varchar(50) NOT NULL DEFAULT '',
  `mother_name` varchar(255) NOT NULL DEFAULT '',
  `mother_mobile` varchar(50) NOT NULL DEFAULT '',
  `class` varchar(50) NOT NULL DEFAULT '',
  `section` varchar(50) NOT NULL DEFAULT '',
  `custom_1` varchar(255) NOT NULL DEFAULT '',
  `custom_2` varchar(255) NOT NULL DEFAULT '',
  `custom_3` varchar(255) NOT NULL DEFAULT '',
  `custom_4` varchar(255) NOT NULL DEFAULT '',
  `custom_5` varchar(255) NOT NULL DEFAULT '',
  `synced_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_its` (`its`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
