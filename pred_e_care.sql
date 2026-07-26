-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 22, 2026 at 02:27 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pred_e_care`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `action`, `detail`, `timestamp`) VALUES
(1, 'Added Patient', 'Added Bato Dela Rosa (Risk: Low)', '2026-05-20 08:13:37'),
(2, 'Added Patient', 'Added Imee Marcos (Risk: High)', '2026-05-25 14:27:10'),
(3, 'Added Patient', 'Added Rodrigo Duterte (Risk: Low)', '2026-05-25 14:29:15'),
(4, 'Added Patient', 'Added Dora   (Risk: Low)', '2026-05-25 19:45:49'),
(5, 'Added Patient', 'Added Pia Cayetano (Risk: Low)', '2026-05-25 19:52:04'),
(6, 'Added Patient', 'Added Duterte (Risk: Low)', '2026-05-25 20:21:19'),
(7, 'Deleted Patient', 'Removed Duterte', '2026-05-25 20:21:39'),
(8, 'Added Patient', 'Added Grace (Risk: Low)', '2026-05-27 16:08:04'),
(9, 'Supply Registry', 'Added paracetamol 500g (Qty: 500)', '2026-05-28 05:17:35'),
(10, 'BHW Assignment', 'Assigned Jeilo to Purok 6 (Alerts: 15)', '2026-05-28 05:19:07'),
(11, 'Report Exported', 'System overview report downloaded by user', '2026-06-04 07:47:33'),
(12, 'Report Exported', 'System overview report downloaded by user', '2026-06-04 07:48:05'),
(13, 'BHW Assignment', 'Assigned Bato Dela Rosa to Purok 2 & 6 (Alerts: 12)', '2026-06-04 07:50:32');

-- --------------------------------------------------------

--
-- Table structure for table `alert_funnel`
--

CREATE TABLE `alert_funnel` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `value` int(11) NOT NULL DEFAULT 0,
  `fill_color` varchar(20) NOT NULL DEFAULT '#8b5e3c'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alert_funnel`
--

INSERT INTO `alert_funnel` (`id`, `name`, `value`, `fill_color`) VALUES
(1, 'Alerts Generated', 120, '#8b5e3c'),
(2, 'Dispatched', 95, '#c4a882'),
(3, 'Outreach Done', 68, '#3d7a45');

-- --------------------------------------------------------

--
-- Table structure for table `bhw_assignments`
--

CREATE TABLE `bhw_assignments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `zone` varchar(100) NOT NULL,
  `alerts` int(11) NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL DEFAULT 'Active',
  `logged_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bhw_assignments`
--

INSERT INTO `bhw_assignments` (`id`, `name`, `zone`, `alerts`, `status`, `logged_at`) VALUES
(1, 'Maria Santos', 'Purok 1 & 2', 8, 'Active', '2026-05-27 14:22:50'),
(2, 'Juan Dela Cruz', 'Purok 3', 2, 'Active', '2026-05-27 14:22:50'),
(3, 'Elena Ramos', 'Purok 4', 14, 'Overloaded', '2026-05-27 14:22:50'),
(4, 'Pedro Garcia', 'Purok 5 & 6', 5, 'Active', '2026-05-27 14:22:50'),
(5, 'Sarah Duterte', 'Purok 1', 24, 'Overloaded', '2026-05-27 15:18:54'),
(6, 'Jeilo', 'Purok 6', 15, 'Overloaded', '2026-05-28 05:19:07'),
(7, 'Bato Dela Rosa', 'Purok 2 & 6', 12, 'Overloaded', '2026-06-04 07:50:32');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_forecast`
--

CREATE TABLE `inventory_forecast` (
  `id` int(11) NOT NULL,
  `day_label` varchar(50) NOT NULL,
  `supply` int(11) NOT NULL DEFAULT 0,
  `projected_demand` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_forecast`
--

INSERT INTO `inventory_forecast` (`id`, `day_label`, `supply`, `projected_demand`) VALUES
(1, 'Day 1', 500, 40),
(2, 'Day 5', 420, 80),
(3, 'Day 10', 320, 150),
(4, 'Day 15', 200, 210),
(5, 'Day 20', 80, 300),
(6, 'Day 25', 0, 380),
(7, 'Day 30', 0, 450);

-- --------------------------------------------------------

--
-- Table structure for table `map_zones`
--

CREATE TABLE `map_zones` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `risk` varchar(20) NOT NULL,
  `cases` int(11) NOT NULL DEFAULT 0,
  `trend` varchar(20) NOT NULL DEFAULT '0%'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `map_zones`
--

INSERT INTO `map_zones` (`id`, `name`, `risk`, `cases`, `trend`) VALUES
(1, 'Purok 1', 'high', 24, '+12%'),
(2, 'Purok 2', 'medium', 15, '+5%'),
(3, 'Purok 3', 'low', 4, '-2%'),
(4, 'Purok 4', 'high', 31, '+18%'),
(5, 'Purok 5', 'low', 2, '0%'),
(6, 'Purok 6', 'medium', 12, '+8%');

-- --------------------------------------------------------

--
-- Table structure for table `medicine_inventory`
--

CREATE TABLE `medicine_inventory` (
  `item_id` int(11) NOT NULL,
  `medicine_name` varchar(100) NOT NULL,
  `quantity_added` int(11) NOT NULL DEFAULT 0,
  `date_received` date NOT NULL,
  `logged_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicine_inventory`
--

INSERT INTO `medicine_inventory` (`item_id`, `medicine_name`, `quantity_added`, `date_received`, `logged_at`) VALUES
(1, 'Paracetamol 500mg', 500, '2026-05-10', '2026-05-25 17:26:12'),
(2, 'Amoxicillin 250mg Suspension', 200, '2026-05-15', '2026-05-25 17:26:12'),
(3, 'Oral Rehydration Salts (ORS)', 600, '2026-05-20', '2026-05-25 17:26:12'),
(4, 'Paracetamol', 3, '2026-05-26', '2026-05-25 18:02:43'),
(5, 'Amino Acid', 500, '2026-05-26', '2026-05-25 19:45:00'),
(6, 'Protein Powder 500g', 650, '2026-05-27', '2026-05-27 14:32:15'),
(7, 'paracetamol 500g', 500, '2026-05-28', '2026-05-28 05:17:35');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `symptoms` text NOT NULL,
  `risk` varchar(50) NOT NULL DEFAULT 'Low',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `zone` varchar(100) DEFAULT 'Purok 1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `name`, `age`, `symptoms`, `risk`, `created_at`, `zone`) VALUES
(1, 'Rosa Ramos', 67, 'high fever, severe headache', 'High', '2026-05-19 23:11:19', 'Purok 1'),
(2, 'Carmen Torres', 38, 'fever, rash, joint pain', 'High', '2026-05-16 10:27:15', 'Purok 4'),
(3, 'Jose Reyes', 34, 'sore throat, cough, fever', 'Low', '2026-05-15 11:52:40', 'Purok 4'),
(4, 'Luis Reyes', 68, 'sore throat, cough, fever', 'Low', '2026-05-21 19:01:41', 'Purok 1'),
(5, 'Carlos Torres', 23, 'body aches, fever, chills', 'Low', '2026-05-15 05:41:32', 'Purok 4'),
(6, 'Ana Bautista', 5, 'sore throat, cough, fever', 'Low', '2026-05-23 07:13:41', 'Purok 4'),
(7, 'Luis Cruz', 38, 'fever, vomiting, rash', 'High', '2026-05-16 06:23:32', 'Purok 4'),
(8, 'Elena Ramos', 72, 'high fever, severe headache', 'High', '2026-05-13 07:15:21', 'Purok 4'),
(9, 'Carmen Ramos', 11, 'fever, cough, fatigue', 'Low', '2026-05-17 23:29:42', 'Purok 4'),
(10, 'Maria Ramos', 29, 'high fever, severe headache', 'High', '2026-05-19 04:04:44', 'Purok 4'),
(11, 'Juan Cruz', 41, 'fever, vomiting, rash', 'High', '2026-05-13 23:49:21', 'Purok 4'),
(12, 'Carlos Santos', 30, 'sore throat, cough, fever', 'Low', '2026-05-22 17:10:38', 'Purok 4'),
(13, 'Maria Ramos', 56, 'fever, vomiting, rash', 'High', '2026-05-23 17:42:30', 'Purok 4'),
(14, 'Carmen Torres', 13, 'fever, rash, joint pain', 'High', '2026-05-16 11:43:12', 'Purok 1'),
(15, 'Ana Ramos', 74, 'fever, rash, joint pain', 'High', '2026-05-22 15:35:48', 'Purok 1'),
(16, 'Rosa Bautista', 9, 'high fever, severe headache', 'High', '2026-05-12 05:52:19', 'Purok 1'),
(17, 'Elena Ramos', 39, 'fever, rash, joint pain', 'High', '2026-05-09 21:29:12', 'Purok 4'),
(18, 'Carmen Garcia', 29, 'fever, rash, joint pain', 'High', '2026-05-11 18:20:47', 'Purok 1'),
(19, 'Luis Torres', 60, 'fever, cough, fatigue', 'Low', '2026-05-18 19:01:33', 'Purok 4'),
(20, 'Ana Reyes', 26, 'body aches, fever, chills', 'Low', '2026-05-20 07:19:24', 'Purok 4'),
(21, 'Ana Cruz', 75, 'high fever, severe headache', 'High', '2026-05-13 23:15:28', 'Purok 4'),
(22, 'Pedro Ramos', 13, 'sore throat, cough, fever', 'Low', '2026-05-12 12:56:03', 'Purok 1'),
(23, 'Juan Dela Cruz', 6, 'fever, vomiting, rash', 'High', '2026-05-15 06:55:20', 'Purok 1'),
(24, 'Ana Cruz', 47, 'body aches, fever, chills', 'Low', '2026-05-16 21:32:23', 'Purok 4'),
(25, 'Carmen Reyes', 54, 'fever, cough, fatigue', 'Low', '2026-05-15 04:21:26', 'Purok 4'),
(26, 'Luis Cruz', 10, 'fever, vomiting, rash', 'High', '2026-05-21 19:21:27', 'Purok 1'),
(27, 'Elena Reyes', 29, 'high fever, severe headache', 'High', '2026-05-23 07:49:30', 'Purok 1'),
(28, 'Luis Garcia', 34, 'fever, vomiting, rash', 'High', '2026-05-10 07:38:03', 'Purok 1'),
(29, 'Elena Garcia', 24, 'high fever, severe headache', 'High', '2026-05-22 14:09:06', 'Purok 4'),
(30, 'Carlos Bautista', 74, 'fever, cough, fatigue', 'Low', '2026-05-11 22:49:58', 'Purok 1'),
(31, 'Luis Torres', 32, 'high fever, severe headache', 'High', '2026-04-15 23:22:37', 'Purok 5'),
(32, 'Carmen Dela Cruz', 28, 'high fever, severe headache', 'High', '2026-04-13 19:28:59', 'Purok 6'),
(33, 'Juan Ramos', 42, 'fever, diarrhea, weakness', 'High', '2026-04-24 23:04:58', 'Purok 5'),
(34, 'Elena Cruz', 64, 'body aches, fever, chills', 'Low', '2026-04-24 22:58:28', 'Purok 5'),
(35, 'Ana Dela Cruz', 68, 'fever, diarrhea, weakness', 'High', '2026-04-21 10:44:02', 'Purok 3'),
(36, 'Elena Garcia', 31, 'fever, diarrhea, weakness', 'High', '2026-05-08 15:34:26', 'Purok 4'),
(37, 'Carmen Torres', 36, 'high fever, severe headache', 'High', '2026-04-29 10:07:34', 'Purok 3'),
(38, 'Carmen Cruz', 14, 'sneezing, sore throat', 'Low', '2026-04-19 20:32:37', 'Purok 5'),
(39, 'Pedro Garcia', 19, 'runny nose, mild cough', 'Low', '2026-04-28 09:35:22', 'Purok 4'),
(40, 'Ana Garcia', 36, 'high fever, severe headache', 'High', '2026-04-29 15:54:17', 'Purok 6'),
(41, 'Rosa Reyes', 5, 'fever, vomiting, rash', 'High', '2026-04-06 16:10:52', 'Purok 5'),
(42, 'Rosa Reyes', 12, 'sneezing, sore throat', 'Low', '2026-04-24 18:03:56', 'Purok 3'),
(43, 'Carlos Torres', 38, 'sore throat, cough, fever', 'Low', '2026-04-22 19:21:57', 'Purok 4'),
(44, 'Rosa Ramos', 41, 'fever, diarrhea, weakness', 'High', '2026-04-17 13:10:34', 'Purok 6'),
(45, 'Pedro Ramos', 70, 'sore throat, cough, fever', 'Low', '2026-03-29 23:06:55', 'Purok 1'),
(46, 'Elena Santos', 38, 'fever, cough, fatigue', 'Low', '2026-04-21 16:52:45', 'Purok 1'),
(47, 'Carmen Garcia', 11, 'sore throat, cough, fever', 'Low', '2026-04-07 12:27:57', 'Purok 4'),
(48, 'Carlos Torres', 60, 'body aches, fever, chills', 'Low', '2026-04-27 00:22:02', 'Purok 6'),
(49, 'Carmen Dela Cruz', 16, 'fever, cough, fatigue', 'Low', '2026-04-03 23:34:40', 'Purok 5'),
(50, 'Carlos Reyes', 39, 'sore throat, cough, fever', 'Low', '2026-04-15 14:10:30', 'Purok 5'),
(51, 'Carmen Cruz', 6, 'runny nose, mild cough', 'Low', '2026-04-19 00:12:27', 'Purok 3'),
(52, 'Ana Reyes', 22, 'fever, diarrhea, weakness', 'High', '2026-04-11 06:16:22', 'Purok 4'),
(53, 'Maria Garcia', 12, 'high fever, severe headache', 'High', '2026-04-24 17:19:09', 'Purok 3'),
(54, 'Elena Torres', 26, 'sneezing, sore throat', 'Low', '2026-04-03 11:53:28', 'Purok 5'),
(55, 'Elena Torres', 32, 'runny nose, mild cough', 'Low', '2026-04-30 10:21:52', 'Purok 2'),
(56, 'Jose Dela Cruz', 71, 'sore throat, cough, fever', 'Low', '2026-05-06 08:28:06', 'Purok 1'),
(57, 'Elena Dela Cruz', 26, 'body aches, fever, chills', 'Low', '2026-04-01 03:52:34', 'Purok 1'),
(58, 'Carlos Torres', 23, 'body aches, fever, chills', 'Low', '2026-04-24 10:07:34', 'Purok 5'),
(59, 'Jose Santos', 39, 'stomach pain, fever, diarrhea', 'High', '2026-04-16 15:26:36', 'Purok 4'),
(60, 'Luis Dela Cruz', 53, 'fever, cough, fatigue', 'Low', '2026-03-28 21:28:14', 'Purok 3'),
(61, 'Jose Dela Cruz', 6, 'fever, rash, joint pain', 'High', '2026-04-14 22:24:41', 'Purok 1'),
(62, 'Maria Torres', 56, 'fever, vomiting, rash', 'High', '2026-04-25 17:31:30', 'Purok 2'),
(63, 'Carlos Ramos', 26, 'high fever, severe headache', 'High', '2026-04-02 13:41:29', 'Purok 5'),
(64, 'Carmen Torres', 8, 'stomach pain, fever, diarrhea', 'High', '2026-04-02 12:03:52', 'Purok 5'),
(65, 'Carlos Bautista', 38, 'sore throat, cough, fever', 'Low', '2026-05-03 13:02:14', 'Purok 3'),
(66, 'Ana Bautista', 25, 'fever, cough, fatigue', 'Low', '2026-05-03 05:17:38', 'Purok 3'),
(67, 'Pedro Reyes', 29, 'fever, cough, fatigue', 'Low', '2026-04-18 22:57:48', 'Purok 2'),
(68, 'Pedro Ramos', 56, 'body aches, fever, chills', 'Low', '2026-04-26 02:55:15', 'Purok 5'),
(69, 'Ana Reyes', 55, 'fever, vomiting, rash', 'High', '2026-04-26 20:59:52', 'Purok 2'),
(70, 'Maria Cruz', 61, 'sore throat, cough, fever', 'Low', '2026-03-27 07:16:48', 'Purok 3'),
(71, 'Juan Santos', 21, 'fever, cough, fatigue', 'Low', '2026-03-28 13:31:14', 'Purok 4'),
(72, 'Carlos Ramos', 58, 'fever, diarrhea, weakness', 'High', '2026-04-17 06:58:33', 'Purok 1'),
(73, 'Carmen Garcia', 36, 'runny nose, mild cough', 'Low', '2026-04-15 12:52:18', 'Purok 2'),
(74, 'Carmen Ramos', 23, 'sore throat, cough, fever', 'Low', '2026-04-30 05:06:41', 'Purok 6'),
(75, 'Carlos Cruz', 41, 'sore throat, cough, fever', 'Low', '2026-03-30 21:44:42', 'Purok 4'),
(76, 'Elena Reyes', 72, 'body aches, fever, chills', 'Low', '2026-04-18 23:08:39', 'Purok 2'),
(77, 'Carlos Torres', 64, 'sneezing, sore throat', 'Low', '2026-04-21 14:58:12', 'Purok 4'),
(78, 'Elena Garcia', 13, 'fever, rash, joint pain', 'High', '2026-04-20 17:47:58', 'Purok 5'),
(79, 'Elena Bautista', 50, 'fever, diarrhea, weakness', 'High', '2026-03-27 15:02:14', 'Purok 4'),
(80, 'Elena Torres', 52, 'sneezing, sore throat', 'Low', '2026-05-02 15:25:10', 'Purok 6'),
(81, 'Rosa Bautista', 11, 'fever, cough, fatigue', 'Low', '2026-05-06 19:15:49', 'Purok 2'),
(82, 'Pedro Garcia', 8, 'runny nose, mild cough', 'Low', '2026-05-06 18:47:27', 'Purok 5'),
(83, 'Rosa Bautista', 24, 'sore throat, cough, fever', 'Low', '2026-05-05 11:36:24', 'Purok 4'),
(84, 'Maria Cruz', 31, 'stomach pain, fever, diarrhea', 'High', '2026-03-29 01:57:15', 'Purok 3'),
(85, 'Rosa Cruz', 21, 'runny nose, mild cough', 'Low', '2026-04-29 10:45:49', 'Purok 2'),
(86, 'Carmen Garcia', 6, 'fever, diarrhea, weakness', 'High', '2026-04-01 23:11:34', 'Purok 5'),
(87, 'Jose Torres', 74, 'sneezing, sore throat', 'Low', '2026-04-17 18:49:47', 'Purok 6'),
(88, 'Pedro Cruz', 15, 'sore throat, cough, fever', 'Low', '2026-04-01 14:13:08', 'Purok 1'),
(89, 'Juan Torres', 17, 'fever, cough, fatigue', 'Low', '2026-04-20 16:09:18', 'Purok 2'),
(90, 'Rosa Ramos', 34, 'runny nose, mild cough', 'Low', '2026-04-02 22:51:36', 'Purok 6'),
(91, 'Carmen Cruz', 21, 'fever, diarrhea, weakness', 'High', '2026-03-28 17:49:25', 'Purok 3'),
(92, 'Ana Cruz', 65, 'sore throat, cough, fever', 'Low', '2026-04-29 03:10:24', 'Purok 4'),
(93, 'Rosa Bautista', 62, 'fever, rash, joint pain', 'High', '2026-04-06 08:08:50', 'Purok 1'),
(94, 'Jose Santos', 14, 'fever, vomiting, rash', 'High', '2026-04-11 09:11:35', 'Purok 3'),
(95, 'Luis Garcia', 23, 'sneezing, sore throat', 'Low', '2026-05-01 18:23:41', 'Purok 4'),
(96, 'Juan Dela Cruz', 55, 'fever, diarrhea, weakness', 'High', '2026-04-03 07:43:58', 'Purok 2'),
(97, 'Pedro Garcia', 58, 'sneezing, sore throat', 'Low', '2026-03-25 19:45:57', 'Purok 6'),
(98, 'Carlos Santos', 64, 'high fever, severe headache', 'High', '2026-04-18 22:52:07', 'Purok 5'),
(99, 'Ana Dela Cruz', 11, 'fever, diarrhea, weakness', 'High', '2026-04-05 18:45:59', 'Purok 2'),
(100, 'Luis Dela Cruz', 52, 'high fever, severe headache', 'High', '2026-05-03 05:13:45', 'Purok 6'),
(102, 'Grace', 46, 'Hyper tension', 'Low', '2026-05-27 16:08:04', 'Purok 1');

-- --------------------------------------------------------

--
-- Table structure for table `predicted_illnesses`
--

CREATE TABLE `predicted_illnesses` (
  `id` int(11) NOT NULL,
  `disease` varchar(100) NOT NULL,
  `prediction` text NOT NULL,
  `severity` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `predicted_illnesses`
--

INSERT INTO `predicted_illnesses` (`id`, `disease`, `prediction`, `severity`) VALUES
(1, 'Dengue', '+45% spike in Zone 2 & 4 next month due to high rainfall', 'high'),
(2, 'Influenza', '+20% increase barangay-wide in 14 days', 'medium'),
(3, 'Typhoid', 'Isolated cases in Zone 1. Monitor water supply.', 'medium');

-- --------------------------------------------------------

--
-- Table structure for table `system_audit_logs`
--

CREATE TABLE `system_audit_logs` (
  `log_id` int(11) NOT NULL,
  `user_username` varchar(100) NOT NULL,
  `action_performed` varchar(255) NOT NULL,
  `target_table` varchar(100) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('health_worker','nurse','admin','BHW') NOT NULL DEFAULT 'health_worker',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(5, 'Jeilo', 'jeilo123@gmail.com', '$2y$10$pZzQADWQ6RkF4fdozJr/5eEHHyceixYNbzxeB0bw2m56kIvo9nRO.', 'admin', '2026-05-24 01:54:14', '2026-05-24 01:54:14'),
(9, 'Test BHW Insert', 'testbhw@sta-rita.gov.ph', '$2y$10$MK4gh1TZffluiE1gkxefze7Gecq/ku0v5bXihFpSq0cBmKWiPKoyi', 'BHW', '2026-05-25 22:21:37', '2026-05-25 22:21:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `alert_funnel`
--
ALTER TABLE `alert_funnel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bhw_assignments`
--
ALTER TABLE `bhw_assignments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory_forecast`
--
ALTER TABLE `inventory_forecast`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `map_zones`
--
ALTER TABLE `map_zones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medicine_inventory`
--
ALTER TABLE `medicine_inventory`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `predicted_illnesses`
--
ALTER TABLE `predicted_illnesses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `system_audit_logs`
--
ALTER TABLE `system_audit_logs`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `alert_funnel`
--
ALTER TABLE `alert_funnel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bhw_assignments`
--
ALTER TABLE `bhw_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `inventory_forecast`
--
ALTER TABLE `inventory_forecast`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `map_zones`
--
ALTER TABLE `map_zones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `medicine_inventory`
--
ALTER TABLE `medicine_inventory`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `predicted_illnesses`
--
ALTER TABLE `predicted_illnesses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `system_audit_logs`
--
ALTER TABLE `system_audit_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
