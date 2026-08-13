-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 12, 2026 at 11:05 PM
-- Server version: 8.0.46-37
-- PHP Version: 8.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `utavqate_msbsec_wa`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `mobile` varchar(100) NOT NULL DEFAULT '',
  `key` varchar(1000) NOT NULL DEFAULT '',
  `start` date DEFAULT NULL,
  `end` date DEFAULT NULL,
  `log_user` varchar(100) NOT NULL DEFAULT '',
  `log_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `name`, `mobile`, `key`, `start`, `end`, `log_user`, `log_date`) VALUES
(1, 'Hamza', '7044730121', '6fee9cb2-e48b-4e8c-94e6-d662d8622aa4', '2022-05-23', '2022-06-22', 'admin', '2022-05-23'),
(2, 'Burhanuddin', '8961043773', 'ee24d13c-edd7-4185-ab8e-cb6343e2f526', '2022-05-23', '2022-06-22', 'admin', '2022-05-23'),
(4, 'One Solutions', '8910113878', '8aa48fd8-1cc5-4063-9be6-28f83a3971e0', '2022-05-26', '2022-06-25', 'admin', '2022-05-26'),
(5, 'Hussain Kanchwala', '9748127352', 'b1629592-780f-4bf2-b6e1-c61a8be993e0', '2022-06-05', '2022-07-05', 'admin', '2022-06-05'),
(6, 'Faiz ul Mawaid il Burhaniyah', '8420621480', '2cf04ed7-0e75-4924-8cb4-ca2a6626de98', '2022-06-25', '2022-07-25', 'admin', '2022-06-25'),
(7, 'Marafiq Burhaniyah', '7003732046', 'b28b7815-0eaf-4bc0-8fb9-5198195f78b8', '2022-07-07', '2022-08-06', 'admin', '2022-07-07'),
(9, 'Anjuman', '6291844213', '4e5710fd-126d-4271-a5b2-09b098468878', '2022-07-25', '2022-08-24', 'admin', '2022-07-25'),
(10, 'Dot Com Solutions', '9330941043', 'ec775f7f-4e57-4cea-ba08-3cf71fc9468c', '2022-08-17', '2022-09-16', 'admin', '2022-08-17'),
(11, 'Burhanuddin', '7003541353', 'c5903f20-590a-4e84-8230-63a0037e74b7', '2022-10-09', '2022-11-08', 'admin', '2022-10-09'),
(12, 'Burhanuddin Alirajpurwala', '8981691506', 'fd9bc776-7226-4a39-9edc-8a069f11b771', '2022-10-10', '2022-11-09', 'admin', '2022-10-10'),
(13, 'Burhani', '123456', '5fed4a70-08d0-47cb-b6ad-ba40e639f0dc', '2022-10-14', '2022-11-13', 'admin', '2022-10-14');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(256) NOT NULL,
  `mobile` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `userlevel` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `password`, `mobile`, `email`, `userlevel`) VALUES
(1, 'MSB Secunderabad', 'admin', '4e1e3a10ec80deba48a8a5286bd8dea7b72c20f6', '', '', 'sadmin_df56fdg');

-- --------------------------------------------------------

--
-- Table structure for table `wa_messages`
--

CREATE TABLE `wa_messages` (
  `id` int NOT NULL,
  `message_id` varchar(100) NOT NULL DEFAULT '',
  `mobile` varchar(100) NOT NULL DEFAULT '',
  `message` longtext NOT NULL,
  `url` longtext NOT NULL,
  `pdf` longtext NOT NULL,
  `image` longtext NOT NULL,
  `priority` varchar(100) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
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

-- --------------------------------------------------------

--
-- Table structure for table `wa_template`
--

CREATE TABLE `wa_template` (
  `id` int NOT NULL,
  `message` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `wa_template`
--

INSERT INTO `wa_template` (`id`, `message`) VALUES
(1, '{name},\n\nThis is to inform you about the overdue installment for your child {child_name}, ITS {its} studying in class {class} {section}, for the academic year 2025-2026.\n\nDue fees: {custom_1}\nDue Amount: INR {custom_2}/-\nDue Date: {custom_3}\n\nYou are required to clear the outstanding dues immediately to ensure that your child\\\'s academic progress is not hampered. \n\nThank you for your understanding and cooperation.\n\nDirect Pay Link http://su.eduqfix.com/dNDJTUdMWSWB and use Registration Code: {its} to make your fee payment.\n\nShukran\n\nWassalaam\nMSB Administration');

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp`
--

CREATE TABLE `whatsapp` (
  `id` int NOT NULL,
  `provider` varchar(20) NOT NULL DEFAULT 'meta',
  `access_token` text NOT NULL,
  `phone_number_id` varchar(64) NOT NULL DEFAULT '',
  `waba_id` varchar(64) NOT NULL DEFAULT '',
  `api_version` varchar(16) NOT NULL DEFAULT 'v22.0',
  `token` varchar(100) NOT NULL DEFAULT '',
  `instance_id` varchar(100) NOT NULL DEFAULT '',
  `url` longtext NOT NULL,
  `account` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `secret` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `whatsapp`
--

INSERT INTO `whatsapp` (`id`, `provider`, `access_token`, `phone_number_id`, `waba_id`, `api_version`, `token`, `instance_id`, `url`, `account`, `secret`) VALUES
(1, 'meta', '', '', '', 'v22.0', '', '', 'https://graph.facebook.com', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wa_messages`
--
ALTER TABLE `wa_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wa_template`
--
ALTER TABLE `wa_template`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whatsapp`
--
ALTER TABLE `whatsapp`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `wa_messages`
--
ALTER TABLE `wa_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8071;

--
-- AUTO_INCREMENT for table `wa_template`
--
ALTER TABLE `wa_template`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `whatsapp`
--
ALTER TABLE `whatsapp`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
