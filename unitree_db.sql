-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 01, 2025 at 06:08 AM
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
-- Database: `unitree_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`) VALUES
(1, 'Tech'),
(2, 'Craft'),
(3, 'Necessity');

-- --------------------------------------------------------

--
-- Table structure for table `listings`
--

CREATE TABLE `listings` (
  `listing_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `status` enum('available','sold','removed') DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `notes` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `order_id`, `user_id`, `status`, `notes`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 47, 0, 'shipped', 'Your order has been shipped', 0, '2025-10-19 05:05:53', '2025-10-19 10:33:21'),
(2, 52, 36, 'shipped', 'Your order status has been updated to shipped', 0, '2025-10-19 10:34:25', '2025-10-19 10:34:25'),
(3, 53, 40, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-19 10:53:13', '2025-10-19 11:16:45'),
(4, 54, 40, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-19 11:02:39', '2025-10-19 11:16:45'),
(5, 55, 40, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-19 11:30:04', '2025-10-19 11:39:47'),
(6, 56, 40, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-19 11:40:35', '2025-10-19 11:40:48'),
(7, 59, 80, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-22 01:06:26', '2025-10-22 01:06:47'),
(8, 61, 40, 'shipped', 'Your order status has been updated to shipped', 0, '2025-10-22 01:09:46', '2025-10-22 01:09:46'),
(9, 63, 39, 'shipped', 'Your order status has been updated to shipped', 0, '2025-10-22 01:32:49', '2025-10-22 01:32:49'),
(10, 64, 82, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-22 04:12:20', '2025-10-22 04:26:59'),
(11, 65, 82, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-22 04:18:05', '2025-10-22 04:26:59'),
(12, 66, 82, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-22 04:22:35', '2025-10-22 04:26:59'),
(13, 68, 82, 'pending', 'Your order status has been updated to pending', 0, '2025-10-22 04:59:37', '2025-10-22 04:59:37'),
(14, 68, 82, 'shipped', 'Your order status has been updated to shipped', 0, '2025-10-22 04:59:48', '2025-10-22 04:59:48'),
(15, 69, 34, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-24 04:39:09', '2025-10-24 08:51:32'),
(16, 70, 84, 'shipped', 'Your order status has been updated to shipped', 0, '2025-10-24 04:41:04', '2025-10-24 04:41:04'),
(17, 71, 84, 'shipped', 'Your order status has been updated to shipped', 0, '2025-10-24 04:42:38', '2025-10-24 04:42:38'),
(18, 72, 34, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-24 09:01:22', '2025-10-24 09:03:24'),
(19, 72, 34, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-24 09:01:29', '2025-10-24 09:03:24'),
(20, 73, 34, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-24 09:02:46', '2025-10-24 09:03:24'),
(21, 74, 85, 'shipped', 'Your order status has been updated to shipped', 0, '2025-10-28 05:58:26', '2025-10-28 05:58:26'),
(22, 75, 86, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-28 08:19:23', '2025-10-28 08:19:34'),
(23, 76, 86, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-28 08:23:17', '2025-11-01 03:35:57'),
(24, 77, 86, 'shipped', 'Your order status has been updated to shipped', 1, '2025-10-28 08:33:09', '2025-11-01 03:35:57'),
(25, 79, 86, 'shipped', 'Your order status has been updated to shipped', 0, '2025-11-01 04:15:38', '2025-11-01 04:15:38'),
(26, 80, 86, 'shipped', 'Your order status has been updated to shipped', 0, '2025-11-01 04:44:13', '2025-11-01 04:44:13');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `date_placed` datetime DEFAULT current_timestamp(),
  `date_shipped` datetime DEFAULT NULL,
  `status` enum('pending','received','cancelled','shipped') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `discount_percent` decimal(5,2) DEFAULT 0.00 COMMENT 'Discount percentage (e.g., 15.00)',
  `discount_amount` decimal(10,2) DEFAULT 0.00 COMMENT 'Discount amount in PHP',
  `discount_code` varchar(50) DEFAULT NULL COMMENT 'Display code like "15% OFF"',
  `payment_method` varchar(50) DEFAULT 'cod',
  `reward_id` int(11) DEFAULT NULL COMMENT 'Foreign key to rewards table'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_amount`, `date_placed`, `date_shipped`, `status`, `created_at`, `discount_percent`, `discount_amount`, `discount_code`, `payment_method`, `reward_id`) VALUES
(16, 7, 0.00, '2025-10-03 23:25:25', NULL, 'cancelled', '2025-10-03 15:25:25', 0.00, 0.00, NULL, 'cod', NULL),
(17, 7, 0.00, '2025-10-04 16:06:51', NULL, 'cancelled', '2025-10-04 08:06:51', 0.00, 0.00, NULL, 'cod', NULL),
(18, 7, 0.00, '2025-10-04 16:20:50', NULL, 'cancelled', '2025-10-04 08:20:50', 0.00, 0.00, NULL, 'cod', NULL),
(19, 7, 0.00, '2025-10-04 16:44:57', NULL, 'received', '2025-10-04 08:44:57', 0.00, 0.00, NULL, 'cod', NULL),
(20, 7, 0.00, '2025-10-04 16:45:54', NULL, 'cancelled', '2025-10-04 08:45:54', 0.00, 0.00, NULL, 'cod', NULL),
(21, 7, 0.00, '2025-10-04 19:27:10', NULL, 'cancelled', '2025-10-04 11:27:10', 0.00, 0.00, NULL, 'cod', NULL),
(22, 7, 0.00, '2025-10-04 19:29:58', NULL, 'cancelled', '2025-10-04 11:29:58', 0.00, 0.00, NULL, 'cod', NULL),
(23, 7, 0.00, '2025-10-04 19:32:00', '2025-10-19 12:53:55', 'shipped', '2025-10-04 11:32:00', 0.00, 0.00, NULL, 'cod', NULL),
(24, 5, 0.00, '2025-10-04 19:38:34', NULL, 'pending', '2025-10-04 11:38:34', 0.00, 0.00, NULL, 'cod', NULL),
(25, 7, 0.00, '2025-10-04 19:49:42', NULL, 'pending', '2025-10-04 11:49:42', 0.00, 0.00, NULL, 'cod', NULL),
(26, 7, 0.00, '2025-10-04 20:53:48', NULL, 'pending', '2025-10-04 12:53:48', 0.00, 0.00, NULL, 'cod', NULL),
(27, 39, 0.00, '2025-10-07 09:12:00', '2025-10-07 09:15:31', 'received', '2025-10-07 01:12:00', 0.00, 0.00, NULL, 'cod', NULL),
(28, 7, 0.00, '2025-10-08 20:55:35', '2025-10-08 20:56:33', 'received', '2025-10-08 12:55:35', 0.00, 0.00, NULL, 'cod', NULL),
(29, 7, 0.00, '2025-10-08 21:03:23', '2025-10-08 21:03:37', 'received', '2025-10-08 13:03:23', 0.00, 0.00, NULL, 'cod', NULL),
(30, 7, 0.00, '2025-10-08 21:07:26', '2025-10-08 21:07:37', 'received', '2025-10-08 13:07:26', 0.00, 0.00, NULL, 'cod', NULL),
(31, 7, 24.00, '2025-10-08 21:11:09', '2025-10-08 21:11:22', 'received', '2025-10-08 13:11:09', 0.00, 0.00, NULL, 'cod', NULL),
(32, 7, 12.00, '2025-10-11 17:59:05', '2025-10-11 17:59:20', 'received', '2025-10-11 09:59:05', 0.00, 0.00, NULL, 'cod', NULL),
(33, 7, 12.00, '2025-10-11 19:29:03', '2025-10-11 19:29:41', 'received', '2025-10-11 11:29:03', 0.00, 0.00, NULL, 'cod', NULL),
(34, 7, 36.00, '2025-10-11 19:30:22', '2025-10-11 19:30:38', 'received', '2025-10-11 11:30:22', 0.00, 0.00, NULL, 'cod', NULL),
(35, 39, 200.00, '2025-10-14 21:35:04', NULL, 'pending', '2025-10-14 13:35:04', 0.00, 0.00, NULL, 'cod', NULL),
(36, 39, 200.00, '2025-10-14 21:46:20', '2025-10-14 21:46:59', 'received', '2025-10-14 13:46:20', 0.00, 0.00, NULL, 'cod', NULL),
(37, 78, 300.00, '2025-10-15 20:20:07', '2025-10-15 20:20:21', 'received', '2025-10-15 12:20:07', 0.00, 0.00, NULL, 'cod', NULL),
(38, 78, 360.00, '2025-10-15 20:34:00', '2025-10-15 20:34:11', 'received', '2025-10-15 12:34:00', 0.00, 0.00, NULL, 'cod', NULL),
(39, 78, 10000.00, '2025-10-15 21:14:33', NULL, 'pending', '2025-10-15 13:14:33', 0.00, 0.00, NULL, 'cod', NULL),
(40, 40, 560.00, '2025-10-19 11:19:53', '2025-10-19 11:20:22', 'received', '2025-10-19 03:19:53', 0.00, 0.00, NULL, 'cod', NULL),
(41, 40, 540.00, '2025-10-19 11:26:08', '2025-10-19 11:26:26', 'received', '2025-10-19 03:26:08', 0.00, 0.00, NULL, 'cod', NULL),
(42, 40, 5000.00, '2025-10-19 11:28:33', NULL, 'pending', '2025-10-19 03:28:33', 0.00, 0.00, NULL, 'cod', NULL),
(43, 40, 50.00, '2025-10-19 11:47:12', NULL, 'pending', '2025-10-19 03:47:12', 0.00, 0.00, NULL, 'cod', NULL),
(44, 40, 50.00, '2025-10-19 11:48:04', '2025-10-19 11:48:14', 'received', '2025-10-19 03:48:04', 0.00, 0.00, NULL, 'cod', NULL),
(45, 40, 90.00, '2025-10-19 11:52:46', '2025-10-19 11:53:04', 'received', '2025-10-19 03:52:46', 0.00, 0.00, NULL, 'cod', NULL),
(46, 40, 180.00, '2025-10-19 12:52:53', '2025-10-19 12:53:47', 'received', '2025-10-19 04:52:53', 0.00, 0.00, NULL, 'cod', NULL),
(47, 40, 180.00, '2025-10-19 13:05:42', '2025-10-19 13:05:53', 'received', '2025-10-19 05:05:42', 0.00, 0.00, NULL, 'cod', NULL),
(48, 40, 90.00, '2025-10-19 14:23:47', '2025-10-19 14:24:20', 'received', '2025-10-19 06:23:47', 0.00, 0.00, NULL, 'cod', NULL),
(49, 40, 100.00, '2025-10-19 17:49:34', '2025-10-19 17:49:44', 'received', '2025-10-19 09:49:34', 0.00, 0.00, NULL, 'cod', NULL),
(50, 40, 180.00, '2025-10-19 18:21:55', '2025-10-19 18:22:08', 'shipped', '2025-10-19 10:21:55', 0.00, 0.00, NULL, 'cod', NULL),
(51, 36, 180.00, '2025-10-19 18:23:41', '2025-10-19 18:24:12', 'received', '2025-10-19 10:23:41', 0.00, 0.00, NULL, 'cod', NULL),
(52, 36, 180.00, '2025-10-19 18:34:14', '2025-10-19 18:34:25', 'received', '2025-10-19 10:34:14', 0.00, 0.00, NULL, 'cod', NULL),
(53, 40, 50.00, '2025-10-19 18:52:58', '2025-10-19 18:53:13', 'shipped', '2025-10-19 10:52:58', 0.00, 0.00, NULL, 'cod', NULL),
(54, 40, 180.00, '2025-10-19 19:02:29', '2025-10-19 19:02:39', 'shipped', '2025-10-19 11:02:29', 0.00, 0.00, NULL, 'cod', NULL),
(55, 40, 90.00, '2025-10-19 19:29:49', '2025-10-19 19:30:04', 'received', '2025-10-19 11:29:49', 0.00, 0.00, NULL, 'cod', NULL),
(56, 40, 50.00, '2025-10-19 19:40:21', '2025-10-19 19:40:35', 'received', '2025-10-19 11:40:21', 0.00, 0.00, NULL, 'cod', NULL),
(57, 40, 5000.00, '2025-10-20 14:25:58', NULL, 'pending', '2025-10-20 06:25:58', 0.00, 0.00, NULL, 'cod', NULL),
(58, 80, 240.00, '2025-10-22 09:03:36', NULL, 'pending', '2025-10-22 01:03:36', 0.00, 0.00, NULL, 'cod', NULL),
(59, 80, 300.00, '2025-10-22 09:03:59', '2025-10-22 09:06:26', 'received', '2025-10-22 01:03:59', 0.00, 0.00, NULL, 'cod', NULL),
(60, 40, 600.00, '2025-10-22 09:09:09', NULL, 'pending', '2025-10-22 01:09:09', 0.00, 0.00, NULL, 'cod', NULL),
(61, 40, 150.00, '2025-10-22 09:09:30', '2025-10-22 09:09:46', 'received', '2025-10-22 01:09:30', 0.00, 0.00, NULL, 'cod', NULL),
(62, 40, 300.00, '2025-10-22 09:22:25', NULL, 'pending', '2025-10-22 01:22:25', 0.00, 0.00, NULL, 'cod', NULL),
(63, 39, 150.00, '2025-10-22 09:32:09', '2025-10-22 09:32:49', 'received', '2025-10-22 01:32:09', 50.00, 150.00, '50%', 'cod', 1),
(64, 82, 300.00, '2025-10-22 12:10:57', '2025-10-22 12:12:20', 'received', '2025-10-22 04:10:57', 0.00, 0.00, NULL, 'cod', NULL),
(65, 82, 600.00, '2025-10-22 12:17:47', '2025-10-22 12:18:05', 'received', '2025-10-22 04:17:47', 0.00, 0.00, NULL, 'cod', NULL),
(66, 82, 285.00, '2025-10-22 12:22:11', '2025-10-22 12:22:35', 'received', '2025-10-22 04:22:11', 5.00, 15.00, '5%', 'cod', 11),
(67, 82, 95.00, '2025-10-22 12:33:55', NULL, 'pending', '2025-10-22 04:33:55', 5.00, 5.00, '5%', 'cod', 13),
(68, 82, 300.00, '2025-10-22 12:59:17', '2025-10-22 12:59:48', 'shipped', '2025-10-22 04:59:17', 0.00, 0.00, NULL, 'cod', NULL),
(69, 34, 360.00, '2025-10-24 12:37:43', '2025-10-24 12:39:08', 'received', '2025-10-24 04:37:43', 0.00, 0.00, NULL, 'cod', NULL),
(70, 84, 360.00, '2025-10-24 12:40:37', '2025-10-24 12:41:04', 'received', '2025-10-24 04:40:37', 0.00, 0.00, NULL, 'cod', NULL),
(71, 84, 171.00, '2025-10-24 12:42:13', '2025-10-24 12:42:38', 'received', '2025-10-24 04:42:13', 5.00, 9.00, '5%', 'cod', 15),
(72, 34, 560.00, '2025-10-24 17:00:56', '2025-10-24 17:01:29', 'received', '2025-10-24 09:00:56', 0.00, 0.00, NULL, 'cod', NULL),
(73, 34, 95.00, '2025-10-24 17:02:29', '2025-10-24 17:02:46', 'received', '2025-10-24 09:02:29', 5.00, 5.00, '5%', 'cod', 16),
(74, 85, 100.00, '2025-10-28 13:58:11', '2025-10-28 13:58:26', 'received', '2025-10-28 05:58:11', 0.00, 0.00, NULL, 'cod', NULL),
(75, 86, 600.00, '2025-10-28 16:18:54', '2025-10-28 16:19:23', 'received', '2025-10-28 08:18:54', 0.00, 0.00, NULL, 'cod', NULL),
(76, 86, 190.00, '2025-10-28 16:23:02', '2025-10-28 16:23:17', 'received', '2025-10-28 08:23:02', 5.00, 10.00, '5%', 'cod', 18),
(77, 86, 900.00, '2025-10-28 16:32:52', '2025-10-28 16:33:09', 'received', '2025-10-28 08:32:52', 0.00, 0.00, NULL, 'cod', NULL),
(78, 86, 60.00, '2025-11-01 12:14:19', NULL, 'pending', '2025-11-01 04:14:19', 0.00, 0.00, NULL, 'cod', NULL),
(79, 86, 95.00, '2025-11-01 12:14:58', '2025-11-01 12:15:38', 'received', '2025-11-01 04:14:58', 5.00, 5.00, '5%', 'cod', 19),
(80, 86, 100.00, '2025-11-01 12:43:26', '2025-11-01 12:44:13', 'received', '2025-11-01 04:43:26', 0.00, 0.00, NULL, 'gcash', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(21, 17, 21, 1, 250.00),
(23, 18, 21, 1, 250.00),
(25, 19, 21, 1, 250.00),
(28, 22, 20, 1, 20.00),
(29, 23, 15, 1, 300.00),
(30, 23, 17, 2, 180.00),
(31, 24, 11, 1, 1.00),
(32, 25, 43, 3, 1.00),
(33, 26, 43, 2, 1.00),
(34, 27, 44, 2, 12.00),
(35, 28, 44, 2, 12.00),
(36, 29, 44, 3, 12.00),
(37, 30, 44, 2, 12.00),
(38, 31, 44, 2, 12.00),
(39, 32, 44, 1, 12.00),
(40, 33, 44, 1, 12.00),
(41, 34, 44, 3, 12.00),
(42, 35, 13, 1, 200.00),
(43, 36, 18, 2, 100.00),
(44, 37, 18, 3, 100.00),
(45, 38, 17, 2, 180.00),
(46, 39, 43, 1, 10000.00),
(47, 40, 18, 2, 100.00),
(48, 40, 17, 2, 180.00),
(49, 41, 17, 3, 180.00),
(50, 42, 43, 1, 10000.00),
(51, 43, 19, 1, 100.00),
(52, 44, 18, 1, 100.00),
(53, 45, 17, 1, 180.00),
(54, 46, 17, 2, 180.00),
(55, 47, 17, 1, 180.00),
(56, 48, 17, 1, 180.00),
(57, 49, 18, 1, 100.00),
(58, 50, 17, 1, 180.00),
(59, 51, 17, 1, 180.00),
(60, 52, 17, 1, 180.00),
(61, 53, 18, 1, 100.00),
(62, 54, 17, 1, 180.00),
(63, 55, 17, 1, 180.00),
(64, 56, 18, 1, 100.00),
(65, 57, 43, 1, 10000.00),
(66, 58, 21, 2, 120.00),
(67, 59, 15, 1, 300.00),
(68, 60, 15, 2, 300.00),
(69, 61, 15, 1, 300.00),
(70, 62, 15, 2, 300.00),
(71, 63, 14, 1, 300.00),
(72, 64, 15, 1, 300.00),
(73, 65, 14, 2, 300.00),
(74, 66, 15, 1, 300.00),
(75, 67, 19, 1, 100.00),
(76, 68, 15, 1, 300.00),
(77, 69, 17, 2, 180.00),
(78, 70, 17, 2, 180.00),
(79, 71, 17, 1, 180.00),
(80, 72, 18, 2, 100.00),
(81, 72, 17, 2, 180.00),
(82, 73, 18, 1, 100.00),
(83, 74, 18, 1, 100.00),
(84, 75, 18, 6, 100.00),
(85, 76, 18, 2, 100.00),
(86, 77, 17, 5, 180.00),
(87, 78, 44, 1, 60.00),
(88, 79, 18, 1, 100.00),
(89, 80, 18, 1, 100.00);

-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

CREATE TABLE `pets` (
  `pet_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pet_name` varchar(100) NOT NULL,
  `level` int(11) DEFAULT 1,
  `xp` int(11) DEFAULT 0,
  `coins` int(11) DEFAULT 0,
  `level1_image` varchar(255) DEFAULT NULL,
  `level2_image` varchar(255) DEFAULT NULL,
  `level3_image` varchar(255) DEFAULT NULL,
  `last_fed` timestamp NULL DEFAULT NULL,
  `has_fruit` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`pet_id`, `user_id`, `pet_name`, `level`, `xp`, `coins`, `level1_image`, `level2_image`, `level3_image`, `last_fed`, `has_fruit`) VALUES
(28, 15, 'a', 1, 0, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(30, 16, 'kulet1', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(32, 17, 'man', 1, 0, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(33, 20, 'mans', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(35, 21, 'man', 1, 0, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(37, 22, 'asasas', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(39, 23, 'tite', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(41, 24, 'lala', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(47, 35, 'butchi', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(49, 36, 'eli', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(53, 38, 'minggay', 1, 0, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(55, 39, 'lili', 3, 30, 0, 't1.jpg', 't2.png', 't3.jpg', '2025-10-15 00:28:51', 0),
(57, 40, 'mimi', 3, 20, 0, '1as.png', '2as.png', '3as.png', '2025-10-20 06:25:24', 0),
(58, 41, 'mimiyuh', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(60, 42, 'taytay', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(62, 43, 'blue', 1, 0, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(64, 44, 'koko', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(66, 45, 'koi', 1, 0, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(68, 46, 'jaja', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(70, 47, 'abc', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(72, 48, 'sample', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(74, 49, 'lara', 1, 0, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(76, 57, 'higad', 1, 0, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(78, 61, 'van', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(80, 5, 'groot', 1, 0, 0, '1759390285681.jpg', NULL, NULL, NULL, 0),
(82, 62, 'man', 1, 0, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(83, 68, 'wawa', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(85, 69, 'ki', 1, 0, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(86, 70, 'kilo', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(87, 71, 'ha', 1, 0, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(88, 7, 'freeza', 3, 150, 0, 't1.jpg', 't2.png', 't3.jpg', '2025-10-11 14:10:27', 0),
(89, 72, 'ewan', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(90, 74, 'ab', 1, 0, 0, '1as.png', '2as.png', '3as.png', NULL, 0),
(91, 77, 'abcd', 1, 0, 0, 't1.jpg', 't2.png', 't3.jpg', NULL, 0),
(92, 78, 'fi', 4, 10, 0, 'pets1.png', 'pets2.png', 'pets3.png', '2025-10-15 13:09:44', 0),
(93, 79, 'pauline', 1, 0, 0, 'pets3.1.png', 'pets3.2.png', 'pets3.3.png', NULL, 0),
(94, 80, 'emkim', 1, 30, 0, 'pets2.1.png', 'pets2.2.png', 'pets2.3.png', '2025-10-22 01:35:37', 0),
(95, 82, 'turnip', 3, 20, 0, 'pets1.png', 'pets2.png', 'pets3.png', '2025-10-22 04:25:23', 0),
(96, 34, 'ming', 1, 10, 0, 'pets2.1.png', 'pets2.2.png', 'pets2.3.png', '2025-10-24 08:50:41', 0),
(97, 84, 'shel', 1, 0, 0, 'pets2.1.png', 'pets2.2.png', 'pets2.3.png', NULL, 0),
(98, 85, 'tbyhbf', 2, 40, 0, 'pets1.png', 'pets2.png', 'pets3.png', '2025-10-28 06:00:26', 0),
(99, 86, 'userpet', 9, 0, 0, 'pets2.1.png', 'pets2.2.png', 'pets2.3.png', '2025-11-01 05:06:16', 0);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `seller_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `stock`, `category_id`, `created_at`, `seller_id`) VALUES
(6, 'Gaming Monitor1', '27-inch FHD gaming monitor with 144Hz refresh rate.', 8999.00, 10, 1, '2025-09-25 05:19:07', 16),
(7, 'External SSD 1TB', 'Portable high-speed external SSD with USB 3.2 interface.', 5999.00, 12, 1, '2025-09-25 05:19:07', 17),
(8, 'Webcam 1080p', 'Full HD webcam with built-in microphone and privacy cover.', 1299.00, 25, 1, '2025-09-25 05:19:07', 17),
(9, 'Portable Speaker', 'Compact Bluetooth speaker with waterproof design and 12-hour playtime.', 1799.00, 30, 1, '2025-09-25 05:19:07', 17),
(11, 'promise ring', 'promise ring', 100.00, 5, 2, '2025-09-26 11:41:09', 20),
(12, 'paper', 'quality yellow pad paper', 80.00, 5, 3, '2025-09-26 12:20:30', 20),
(13, 'poketree', 'poketree as your companion', 200.00, 21, 2, '2025-09-27 12:45:20', 53),
(14, 'mouse', 'mouseee', 300.00, 17, 1, '2025-09-27 13:18:55', 53),
(15, 'flower boquet', 'perfect gift for your loved ones', 300.00, 10, 2, '2025-09-27 13:28:55', 53),
(17, 'earphones', 'quality earphones', 180.00, 3, 1, '2025-09-27 13:40:03', 54),
(18, 'charger', 'charger', 100.00, 10, 1, '2025-09-27 13:41:17', 54),
(19, 'bracelet', 'bracelet design for besties', 100.00, 28, 2, '2025-09-28 13:48:53', 56),
(20, 'ballpen', 'basta ballpen', 20.00, 50, 3, '2025-09-29 01:36:42', 58),
(21, 'notebook', 'quality notebook', 120.00, 120, 3, '2025-10-02 05:32:04', 60),
(43, 'aircon', 'malmig kasing lamig niya', 10000.00, 17, 1, '2025-10-04 11:48:41', 5),
(44, 'Key Chain', 'cute and affordable keychain to hang', 60.00, 94, 2, '2025-10-07 01:10:14', 6),
(45, 'computer', 'computer 2', 35000.00, 10, 1, '2025-10-28 08:29:07', 87);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `image_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`image_id`, `product_id`, `image_path`, `uploaded_at`) VALUES
(39, 6, 'images/1760510691491.jpg', '2025-10-15 06:44:51'),
(40, 6, 'images/1760510691499.jpg', '2025-10-15 06:44:51'),
(41, 6, 'images/1760510691522.jpg', '2025-10-15 06:44:51'),
(42, 7, 'images/1760510715852.jpg', '2025-10-15 06:45:15'),
(43, 7, 'images/1760510715852.jpg', '2025-10-15 06:45:15'),
(44, 7, 'images/1760510715853.jpg', '2025-10-15 06:45:15'),
(45, 8, 'images/1760511006296.jpg', '2025-10-15 06:50:06'),
(46, 8, 'images/1760511006299.jpg', '2025-10-15 06:50:06'),
(47, 8, 'images/1760511006299.jpg', '2025-10-15 06:50:06'),
(48, 9, 'images/1760511036601.gif', '2025-10-15 06:50:36'),
(49, 9, 'images/1760511036650.jpg', '2025-10-15 06:50:36'),
(50, 9, 'images/1760511036684.jpg', '2025-10-15 06:50:36'),
(51, 11, 'images/1760511062692.jpg', '2025-10-15 06:51:02'),
(52, 11, 'images/1760511062692.jpg', '2025-10-15 06:51:02'),
(53, 11, 'images/1760511062693.jpg', '2025-10-15 06:51:02'),
(54, 12, 'images/1760511101800.jpg', '2025-10-15 06:51:41'),
(55, 12, 'images/1760511101801.jpg', '2025-10-15 06:51:41'),
(56, 12, 'images/1760511101802.jpg', '2025-10-15 06:51:41'),
(57, 13, 'images/1760528728473.jpg', '2025-10-15 11:45:28'),
(58, 13, 'images/1760528728477.jpg', '2025-10-15 11:45:28'),
(59, 13, 'images/1760528728481.jpg', '2025-10-15 11:45:28'),
(63, 14, 'images/1760528776438.jpg', '2025-10-15 11:46:16'),
(64, 14, 'images/1760528776439.jpg', '2025-10-15 11:46:16'),
(65, 15, 'images/1760528845674.jpg', '2025-10-15 11:47:25'),
(66, 15, 'images/1760528845676.jpg', '2025-10-15 11:47:25'),
(67, 15, 'images/1760528845681.jpg', '2025-10-15 11:47:25'),
(74, 17, 'images/1760528898940.jpg', '2025-10-15 11:48:18'),
(75, 17, 'images/1760528898940.jpg', '2025-10-15 11:48:18'),
(76, 18, 'images/1760528920337.jpg', '2025-10-15 11:48:40'),
(77, 18, 'images/1760528920337.jpg', '2025-10-15 11:48:40'),
(78, 20, 'images/1760529002978.jpg', '2025-10-15 11:50:02'),
(79, 20, 'images/1760529002979.jpg', '2025-10-15 11:50:02'),
(80, 20, 'images/1760529002980.jpg', '2025-10-15 11:50:02'),
(81, 21, 'images/1760529061010.jpg', '2025-10-15 11:51:01'),
(82, 21, 'images/1760529061011.jpg', '2025-10-15 11:51:01'),
(83, 21, 'images/1760529061012.jpg', '2025-10-15 11:51:01'),
(84, 43, 'images/1760529128831.jpg', '2025-10-15 11:52:08'),
(85, 43, 'images/1760529128831.jpg', '2025-10-15 11:52:08'),
(86, 43, 'images/1760529128832.jpg', '2025-10-15 11:52:08'),
(87, 44, 'images/1760529186391.jpg', '2025-10-15 11:53:06'),
(88, 44, 'images/1760529186392.jpg', '2025-10-15 11:53:06'),
(89, 44, 'images/1760529186395.jpg', '2025-10-15 11:53:06'),
(90, 19, 'images/1760529243534.jpg', '2025-10-15 11:54:03'),
(91, 19, 'images/1760529243535.jpg', '2025-10-15 11:54:03'),
(92, 19, 'images/1760529243539.jpg', '2025-10-15 11:54:03'),
(93, 45, 'images/1761640147440.jpg', '2025-10-28 08:29:07');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `user_id`, `product_id`, `order_id`, `comment`, `rating`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 39, 44, 27, 'jhahsjahjsa maganda po', 5, '2025-10-07 01:16:43', NULL, NULL),
(2, 39, 18, 36, 'ganda po super', 4, '2025-10-14 13:47:41', NULL, NULL),
(3, 40, 17, 41, 'super gandaaaaaaa\n', 5, '2025-10-19 04:26:24', NULL, NULL),
(4, 84, 17, 71, 'pangit', 1, '2025-10-24 04:43:26', NULL, NULL),
(5, 34, 17, 69, 'gandaaaaaaaaaaaaaaa super', 5, '2025-10-24 08:51:00', NULL, NULL),
(6, 86, 18, 76, 'ganda po', 5, '2025-10-28 08:25:04', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rewards`
--

CREATE TABLE `rewards` (
  `reward_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pet_id` int(11) NOT NULL,
  `reward_type` enum('discount','bonus_coins') NOT NULL,
  `value` varchar(50) NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `used_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rewards`
--

INSERT INTO `rewards` (`reward_id`, `user_id`, `pet_id`, `reward_type`, `value`, `is_used`, `used_at`, `created_at`) VALUES
(1, 39, 55, 'discount', '50%', 1, '2025-10-22 09:32:09', '2025-10-15 00:07:23'),
(2, 39, 55, 'bonus_coins', '100', 0, NULL, '2025-10-15 00:07:23'),
(3, 39, 55, 'discount', '10%', 0, NULL, '2025-10-15 00:07:23'),
(4, 78, 92, 'bonus_coins', '100', 0, NULL, '2025-10-15 13:02:42'),
(5, 78, 92, 'bonus_coins', '200', 0, NULL, '2025-10-15 13:02:42'),
(6, 78, 92, 'bonus_coins', '200', 0, NULL, '2025-10-15 13:02:42'),
(7, 40, 57, 'discount', '50%', 1, '2025-10-22 09:09:30', '2025-10-19 03:27:49'),
(8, 40, 57, 'bonus_coins', '200', 0, NULL, '2025-10-19 03:27:49'),
(9, 40, 57, 'discount', '50%', 1, '2025-10-22 09:22:25', '2025-10-19 03:27:49'),
(10, 82, 95, 'bonus_coins', '50', 0, NULL, '2025-10-22 04:21:28'),
(11, 82, 95, 'discount', '5%', 1, '2025-10-22 12:22:11', '2025-10-22 04:21:28'),
(12, 82, 95, 'bonus_coins', '100', 0, NULL, '2025-10-22 04:21:28'),
(13, 82, 95, 'discount', '5%', 1, '2025-10-22 12:33:55', '2025-10-22 04:26:23'),
(14, 82, 95, 'discount', '20%', 0, NULL, '2025-10-22 04:26:33'),
(15, 84, 97, 'discount', '5%', 1, '2025-10-24 12:42:13', '2025-10-24 04:42:00'),
(16, 34, 96, 'discount', '5%', 1, '2025-10-24 17:02:29', '2025-10-24 09:02:11'),
(17, 86, 99, 'bonus_coins', '200', 0, NULL, '2025-10-28 08:22:11'),
(18, 86, 99, 'discount', '5%', 1, '2025-10-28 16:23:02', '2025-10-28 08:22:11'),
(19, 86, 99, 'discount', '5%', 1, '2025-11-01 12:14:58', '2025-10-28 08:22:11'),
(20, 86, 99, 'bonus_coins', '200', 0, NULL, '2025-10-28 15:41:55'),
(21, 86, 99, 'bonus_coins', '200', 0, NULL, '2025-10-28 15:41:55'),
(22, 86, 99, 'bonus_coins', '200', 0, NULL, '2025-10-28 15:41:55'),
(23, 86, 99, 'discount', '10%', 0, NULL, '2025-11-01 04:57:34'),
(24, 86, 99, 'discount', '50%', 0, NULL, '2025-11-01 04:57:34'),
(25, 86, 99, 'bonus_coins', '50', 0, NULL, '2025-11-01 04:57:34'),
(26, 86, 99, 'discount', '50%', 0, NULL, '2025-11-01 05:06:16'),
(27, 86, 99, 'bonus_coins', '50', 0, NULL, '2025-11-01 05:06:16'),
(28, 86, 99, 'bonus_coins', '100', 0, NULL, '2025-11-01 05:06:16');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `coins_earned` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `user_id`, `order_id`, `coins_earned`, `created_at`) VALUES
(1, 7, 28, 0, '2025-10-08 12:56:46'),
(2, 7, 29, 0, '2025-10-08 13:03:56'),
(3, 7, 30, 0, '2025-10-08 13:07:49'),
(4, 7, 31, 2, '2025-10-08 13:11:43'),
(5, 7, 32, 90, '2025-10-11 09:59:32'),
(6, 7, NULL, -5, '2025-10-11 11:27:24'),
(7, 7, NULL, -2, '2025-10-11 11:27:31'),
(8, 7, 33, 1, '2025-10-11 11:30:03'),
(9, 7, 34, 3, '2025-10-11 11:30:51'),
(10, 7, NULL, -2, '2025-10-11 13:35:58'),
(11, 7, NULL, -5, '2025-10-11 13:37:28'),
(12, 7, NULL, -5, '2025-10-11 13:37:39'),
(13, 7, NULL, -5, '2025-10-11 13:37:42'),
(14, 7, NULL, -2, '2025-10-11 13:38:42'),
(15, 7, NULL, -2, '2025-10-11 13:41:32'),
(16, 7, NULL, -5, '2025-10-11 13:41:34'),
(17, 7, NULL, -5, '2025-10-11 13:47:32'),
(18, 7, NULL, -5, '2025-10-11 13:47:34'),
(19, 7, NULL, -5, '2025-10-11 13:50:41'),
(20, 7, NULL, -5, '2025-10-11 14:01:18'),
(21, 7, NULL, -2, '2025-10-11 14:01:52'),
(22, 7, NULL, -5, '2025-10-11 14:02:58'),
(23, 7, NULL, -5, '2025-10-11 14:03:00'),
(24, 7, NULL, -5, '2025-10-11 14:03:02'),
(25, 7, NULL, -5, '2025-10-11 14:03:04'),
(26, 7, NULL, -2, '2025-10-11 14:03:24'),
(27, 7, NULL, -5, '2025-10-11 14:03:45'),
(28, 7, NULL, -5, '2025-10-11 14:10:21'),
(29, 39, 36, 300, '2025-10-14 13:47:21'),
(30, 39, NULL, -2, '2025-10-14 13:48:01'),
(31, 39, NULL, -5, '2025-10-15 00:06:01'),
(32, 39, NULL, -2, '2025-10-15 00:06:03'),
(33, 39, NULL, -5, '2025-10-15 00:06:05'),
(34, 39, NULL, -5, '2025-10-15 00:06:07'),
(35, 39, NULL, -5, '2025-10-15 00:06:08'),
(36, 39, NULL, -2, '2025-10-15 00:06:12'),
(37, 39, NULL, -5, '2025-10-15 00:06:15'),
(38, 39, NULL, -5, '2025-10-15 00:06:18'),
(39, 39, NULL, -5, '2025-10-15 00:07:02'),
(40, 39, NULL, -5, '2025-10-15 00:07:04'),
(41, 39, NULL, -5, '2025-10-15 00:07:06'),
(42, 39, NULL, -5, '2025-10-15 00:07:08'),
(43, 39, NULL, 100, '2025-10-15 00:07:23'),
(44, 39, NULL, -2, '2025-10-15 00:28:20'),
(45, 39, NULL, -5, '2025-10-15 00:28:23'),
(46, 78, 37, 30, '2025-10-15 12:20:28'),
(47, 78, NULL, -2, '2025-10-15 12:20:39'),
(48, 78, NULL, -5, '2025-10-15 12:20:42'),
(49, 78, NULL, -2, '2025-10-15 12:28:17'),
(50, 78, NULL, -5, '2025-10-15 12:28:20'),
(51, 78, NULL, -2, '2025-10-15 12:32:41'),
(52, 78, NULL, -5, '2025-10-15 12:32:43'),
(53, 78, NULL, -2, '2025-10-15 12:33:04'),
(54, 78, 38, 36, '2025-10-15 12:36:04'),
(55, 78, NULL, -2, '2025-10-15 12:48:25'),
(56, 78, NULL, -5, '2025-10-15 12:48:27'),
(57, 78, NULL, -2, '2025-10-15 13:01:43'),
(58, 78, NULL, -2, '2025-10-15 13:01:45'),
(59, 78, NULL, -5, '2025-10-15 13:01:49'),
(60, 78, NULL, -2, '2025-10-15 13:01:51'),
(61, 78, NULL, -5, '2025-10-15 13:01:53'),
(62, 78, NULL, -2, '2025-10-15 13:01:57'),
(63, 78, NULL, -5, '2025-10-15 13:02:00'),
(64, 78, NULL, 100, '2025-10-15 13:02:42'),
(65, 78, NULL, 200, '2025-10-15 13:02:42'),
(66, 78, NULL, 200, '2025-10-15 13:02:42'),
(67, 78, NULL, -2, '2025-10-15 13:02:54'),
(68, 78, NULL, -5, '2025-10-15 13:02:57'),
(69, 78, NULL, -2, '2025-10-15 13:02:59'),
(70, 78, NULL, -5, '2025-10-15 13:03:01'),
(71, 78, NULL, -2, '2025-10-15 13:03:04'),
(72, 78, NULL, -5, '2025-10-15 13:03:06'),
(73, 78, NULL, -2, '2025-10-15 13:03:09'),
(74, 40, 40, 56, '2025-10-19 03:20:35'),
(75, 40, NULL, -2, '2025-10-19 03:20:48'),
(76, 40, NULL, -2, '2025-10-19 03:20:50'),
(77, 40, NULL, -5, '2025-10-19 03:20:53'),
(78, 40, NULL, -5, '2025-10-19 03:20:55'),
(79, 40, NULL, -2, '2025-10-19 03:20:58'),
(80, 40, NULL, -5, '2025-10-19 03:21:01'),
(81, 40, NULL, -2, '2025-10-19 03:21:03'),
(82, 40, NULL, -2, '2025-10-19 03:23:38'),
(83, 40, NULL, -5, '2025-10-19 03:23:42'),
(84, 40, NULL, -5, '2025-10-19 03:23:48'),
(85, 40, NULL, -2, '2025-10-19 03:23:51'),
(86, 40, 41, 54, '2025-10-19 03:26:37'),
(87, 40, NULL, -2, '2025-10-19 03:26:44'),
(88, 40, NULL, -2, '2025-10-19 03:26:47'),
(89, 40, NULL, -5, '2025-10-19 03:26:50'),
(90, 40, NULL, -5, '2025-10-19 03:26:53'),
(91, 40, NULL, -2, '2025-10-19 03:26:56'),
(92, 40, NULL, -5, '2025-10-19 03:26:58'),
(93, 40, NULL, -2, '2025-10-19 03:27:01'),
(94, 40, NULL, -5, '2025-10-19 03:27:04'),
(95, 40, NULL, -2, '2025-10-19 03:27:07'),
(96, 40, NULL, -5, '2025-10-19 03:27:09'),
(97, 40, NULL, 200, '2025-10-19 03:27:49'),
(98, 40, 44, 5, '2025-10-19 03:48:25'),
(99, 40, 45, 9, '2025-10-19 03:53:12'),
(100, 40, 46, 18, '2025-10-19 05:30:58'),
(101, 40, 47, 18, '2025-10-19 05:31:02'),
(102, 36, 52, 18, '2025-10-19 10:41:00'),
(103, 36, 51, 18, '2025-10-19 10:41:03'),
(104, 40, 48, 9, '2025-10-19 11:30:35'),
(105, 40, 49, 10, '2025-10-19 11:30:41'),
(106, 40, 56, 5, '2025-10-19 11:41:06'),
(107, 40, 55, 9, '2025-10-19 11:41:10'),
(108, 40, NULL, -2, '2025-10-20 06:23:55'),
(109, 80, 59, 30, '2025-10-22 01:06:54'),
(110, 80, NULL, -2, '2025-10-22 01:07:44'),
(111, 80, NULL, -5, '2025-10-22 01:07:47'),
(112, 80, NULL, -2, '2025-10-22 01:07:51'),
(113, 80, NULL, -5, '2025-10-22 01:07:53'),
(114, 80, NULL, -2, '2025-10-22 01:07:55'),
(115, 80, NULL, -5, '2025-10-22 01:07:57'),
(116, 80, NULL, -2, '2025-10-22 01:07:59'),
(117, 80, NULL, -2, '2025-10-22 01:08:01'),
(118, 80, NULL, -2, '2025-10-22 01:08:03'),
(119, 80, NULL, -2, '2025-10-22 01:08:09'),
(120, 40, 61, 15, '2025-10-22 01:10:05'),
(121, 39, 63, 15, '2025-10-22 01:45:53'),
(122, 82, 64, 30, '2025-10-22 04:12:33'),
(123, 82, NULL, -2, '2025-10-22 04:12:52'),
(124, 82, NULL, -5, '2025-10-22 04:12:54'),
(125, 82, NULL, -2, '2025-10-22 04:15:03'),
(126, 82, NULL, -5, '2025-10-22 04:15:17'),
(127, 82, 65, 60, '2025-10-22 04:18:13'),
(128, 82, NULL, -2, '2025-10-22 04:18:20'),
(129, 82, NULL, -2, '2025-10-22 04:18:22'),
(130, 82, NULL, -2, '2025-10-22 04:18:24'),
(131, 82, NULL, -2, '2025-10-22 04:18:26'),
(132, 82, NULL, -2, '2025-10-22 04:18:28'),
(133, 82, NULL, -2, '2025-10-22 04:18:30'),
(134, 82, NULL, -2, '2025-10-22 04:18:32'),
(135, 82, NULL, -5, '2025-10-22 04:18:34'),
(136, 82, NULL, -5, '2025-10-22 04:18:36'),
(137, 82, NULL, -5, '2025-10-22 04:18:38'),
(138, 82, NULL, -5, '2025-10-22 04:18:39'),
(139, 82, NULL, -2, '2025-10-22 04:18:41'),
(140, 82, NULL, -5, '2025-10-22 04:18:43'),
(141, 82, NULL, -5, '2025-10-22 04:18:46'),
(142, 82, NULL, -2, '2025-10-22 04:18:48'),
(143, 82, NULL, -5, '2025-10-22 04:18:50'),
(144, 82, NULL, -2, '2025-10-22 04:19:54'),
(145, 82, NULL, -5, '2025-10-22 04:19:57'),
(146, 82, NULL, 50, '2025-10-22 04:21:28'),
(147, 82, NULL, 100, '2025-10-22 04:21:28'),
(148, 82, 66, 28, '2025-10-22 04:23:17'),
(149, 82, NULL, -10, '2025-10-22 04:26:23'),
(150, 82, NULL, -40, '2025-10-22 04:26:33'),
(151, 84, 70, 36, '2025-10-24 04:41:44'),
(152, 84, NULL, -10, '2025-10-24 04:42:00'),
(153, 84, 71, 17, '2025-10-24 04:42:59'),
(154, 34, 69, 36, '2025-10-24 08:50:16'),
(155, 34, NULL, -2, '2025-10-24 08:50:30'),
(156, 34, NULL, -5, '2025-10-24 08:50:33'),
(157, 34, 72, 56, '2025-10-24 09:01:41'),
(158, 34, NULL, -10, '2025-10-24 09:02:11'),
(159, 34, 73, 9, '2025-10-24 09:02:56'),
(160, 85, 74, 10, '2025-10-28 05:58:39'),
(161, 85, NULL, -2, '2025-10-28 05:58:52'),
(162, 85, NULL, -5, '2025-10-28 05:58:55'),
(163, 85, NULL, -2, '2025-10-28 06:00:15'),
(164, 86, 75, 60, '2025-10-28 08:19:41'),
(165, 86, NULL, -2, '2025-10-28 08:20:02'),
(166, 86, NULL, -5, '2025-10-28 08:20:04'),
(167, 86, NULL, -5, '2025-10-28 08:20:07'),
(168, 86, NULL, -2, '2025-10-28 08:20:08'),
(169, 86, NULL, -5, '2025-10-28 08:22:02'),
(170, 86, NULL, 200, '2025-10-28 08:22:11'),
(171, 86, 76, 19, '2025-10-28 08:23:35'),
(172, 86, 77, 90, '2025-10-28 08:33:18'),
(173, 86, NULL, -2, '2025-10-28 15:40:40'),
(174, 86, NULL, -5, '2025-10-28 15:40:43'),
(175, 86, NULL, -5, '2025-10-28 15:40:45'),
(176, 86, NULL, -2, '2025-10-28 15:40:48'),
(177, 86, NULL, -5, '2025-10-28 15:40:51'),
(178, 86, NULL, -2, '2025-10-28 15:40:54'),
(179, 86, NULL, 200, '2025-10-28 15:41:55'),
(180, 86, NULL, 200, '2025-10-28 15:41:55'),
(181, 86, NULL, 200, '2025-10-28 15:41:55'),
(182, 86, 79, 9, '2025-11-01 04:15:47'),
(183, 86, 80, 10, '2025-11-01 04:44:22'),
(184, 86, NULL, -2, '2025-11-01 04:55:57'),
(185, 86, NULL, -5, '2025-11-01 04:56:29'),
(186, 86, NULL, -5, '2025-11-01 04:56:32'),
(187, 86, NULL, -5, '2025-11-01 04:56:35'),
(188, 86, NULL, -5, '2025-11-01 04:56:41'),
(189, 86, NULL, -2, '2025-11-01 04:56:44'),
(190, 86, NULL, -2, '2025-11-01 04:56:47'),
(191, 86, NULL, 50, '2025-11-01 04:57:34'),
(192, 86, NULL, -2, '2025-11-01 05:04:57'),
(193, 86, NULL, -5, '2025-11-01 05:05:00'),
(194, 86, NULL, -5, '2025-11-01 05:05:02'),
(195, 86, NULL, -5, '2025-11-01 05:05:04'),
(196, 86, NULL, 50, '2025-11-01 05:06:16'),
(197, 86, NULL, 100, '2025-11-01 05:06:16');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer','seller') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `token` text DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `age` int(3) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `profile_picture` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'approved',
  `contact_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `role`, `created_at`, `token`, `first_name`, `last_name`, `age`, `birthday`, `address`, `gender`, `profile_picture`, `status`, `contact_number`) VALUES
(5, 'flint', 'flintaxl.celetaria@gmail.com', '$2b$10$nNlIhzJA9ja1ektzbApOee2U2zdk7tA7s.vZyZ3RKvtitq6NKUzuG', 'admin', '2025-09-23 02:12:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(6, 'bea', 'bea@gmail.com', '$2b$10$VvcXKPSLhVkcrT/Nb5a36eRquGTfFRO0sfv3oJkkMHwVaFpqBS0qG', 'seller', '2025-09-23 02:28:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(7, 'ash', 'ash@gmail.com', '$2b$10$Th0GH9.IPiSb5J.uWIJmaeSR.zSHRFPdsvJo6Lq3Rsr4lWrt2kURm', 'customer', '2025-09-23 02:33:36', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(12, 'a', 'a@gmail.com', '$2b$10$R5Rphq8YYSQMeWhsnbb/TeS1ISchse29gKt4aJCbO/LYs23YnQZZm', 'customer', '2025-09-23 04:35:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(15, 'kim', 'kim@gmail.com', '$2b$10$VU45G1S23LalvwTpnmLRAOGeVzyHWRPEvKaLUrIL/dGc4rmcRGsDO', 'seller', '2025-09-23 14:09:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(16, 'bab1', 'bab@gmail.com', '$2b$10$JR7USHa4BnULcRibeDGxzebMHmG8WgD6aW0EVpIXwFFMfSePV48tO', 'seller', '2025-09-23 14:21:25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(17, 'lol', 'lol@gmail.com', '$2b$10$wMVaedIGbR8vEAMwhXfQAe7CTaWABOF2uk4hBQN.3wEdRtJcTUZsO', 'seller', '2025-09-23 14:40:11', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(20, 'lola', 'lola@gmail.com', '$2b$10$zmSA5KWCArw7EimmFSrdS.7.DouAdvgBLKPdZo5i.qiJYgmEEsWda', 'seller', '2025-09-23 14:42:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(21, 'pau', 'pau@gmail.com', '$2b$10$31s0PLx5neNqzOAvo4Pro.Ea5sTY387VihZpBHOZfFognt5EWJCey', 'seller', '2025-09-24 05:53:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(22, 'kc', 'kc@gmail.com', '$2b$10$a0ef96isa5ERfHlFTQCvg.KNrLU/cl3.m9uaV4XTeNrkxli0YDsg.', 'seller', '2025-09-24 05:56:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(23, 'juli', 'juli@gmail.com', '$2b$10$qgwBJUqHAzE/aEzEOCICCe6/oOCks8UA5D7uONqqct4PKkWYGWZq2', 'customer', '2025-09-25 05:28:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(24, 'shelley', 'shelley@gmail.com', '$2b$10$zCU.XNLQLK9ucghKrwV8YuOqwKKeeEAXKR7dwCwqpyYTUHDJ20Mea', 'customer', '2025-09-25 05:39:45', NULL, '', '', NULL, NULL, '', NULL, 'data:image/jpeg;base64,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', 'approved', NULL),
(32, 'jet', 'jet@gmail.com', '$2b$10$k918lNAwTmuHJfjB7A4qh.HQhup/Wumgqe.5zfICXkSw7wxFOkH.u', 'customer', '2025-09-25 06:23:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(33, 'je', 'je', '$2b$10$bieJqWP05WxmQ1AcMBWEkekzmui19wOD/frnO.leojNiPSfh8auRK', 'customer', '2025-09-25 06:59:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(34, 'min', 'minggay@gmail.com', '$2b$10$bzOTzvrZmSu/REu8.DwOAeoRoED6VbVArEL6W5CuF/cgEJciIHmh6', 'customer', '2025-09-25 07:20:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(35, 'mari', 'mari@gmail.com', '$2b$10$QD0Rt3O.jPNl67xHojUZH.O7D7xZbjhL/FgYcTiaoAyZajVYduTXq', 'customer', '2025-09-26 03:32:28', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(36, 'eli', 'eli@gmail.com', '$2b$10$sKde3sa.W1iPXAX836acxuasI7olWOLRmoci/7zMZX0yfQXz0Hn36', 'customer', '2025-09-26 04:12:27', NULL, 'eli', 'mejos', 21, '2005-05-14', 'bagumbayan', 'male', NULL, 'approved', NULL),
(38, 'butchi', 'butchi@gmail.com', '$2b$10$VPbmqyBA4KRzsiEtZ1fSr./UfhoXCz1ZQ4v4VyOYKFnurnW7ovUfy', 'customer', '2025-09-26 04:39:02', NULL, 'butch', 'i', 3, '2025-09-27', 'mars', 'female', NULL, 'approved', NULL),
(39, 'lili', 'lili@gmail.com', '$2b$10$ow.GpMzMoz6mpC90bnWDFO6lTcuzdkItVwi/KkyL1NR0Jq2VyDbS2', 'customer', '2025-09-26 04:42:44', NULL, 'kim', 'eledia', 20, '2005-04-11', 'tanyag, taguig city', 'female', NULL, 'approved', NULL),
(40, 'mimi', 'mimi@gmail.com', '$2b$10$gD2gAFPM9C50E2AH6.bhnuFPHltwlVaHnmB/1hWVW3Ji1y9i4/uwC', 'customer', '2025-09-26 04:52:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(41, 'mimiyuh', 'mimiyuh@gmail.com', '$2b$10$Hb/q3BaFXMrqKoxwf2cSi.xG1mhVl6/mUfPybSiAGJbaik9yIfDgS', 'customer', '2025-09-26 04:55:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(42, 'taylor', 'taylor@gmail.com', '$2b$10$V.xZLDLQPA/Qfw8TZZ8FKeTQljrIZNDzVKMxfThGgNC/fkGhAHDp2', 'customer', '2025-09-26 04:58:55', NULL, 'Taylor', 'Swift', 30, NULL, 'New York', 'female', 'data:image/jpeg;base64,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', 'approved', NULL),
(43, 'candy', 'candy@gmail.com', '$2b$10$6iPe8vrDEtOOo6t/nlms3uCuWZzLLnc96i5ROAYc9awGGuWEEEbUa', 'customer', '2025-09-26 06:24:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(44, 'aray', 'aray@gmail.com', '$2b$10$MmI/COoB18BipkYd5TAKkunIw95cNXiTbDQWS3liPar/FiyR3GJrG', 'customer', '2025-09-26 12:38:27', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(45, 'kol', 'kol@gmail.com', '$2b$10$o1LeKHFe0moXWjfKxn2X5.hOC1hgSHvQsLBiuaYoYsjB5zhgJHAIC', 'customer', '2025-09-26 12:51:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', NULL),
(46, 'ka;', 'ja@gmail.com', '$2b$10$csRFwHsajnveZERjkWmHROdXkqtL4LUd3CRF87GeSTVrfQZ3HZ4De', 'customer', '2025-09-26 12:52:40', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(47, 'abc', 'abc@gmail.com', '$2b$10$QFNVtNRAT2/0AiuPRfJdfu3lIV6GzxUJ/ttquoTANyo1ZDZr4wCXa', 'customer', '2025-09-26 14:54:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(48, 'sample', 'sample@gmail.com', '$2b$10$5rFnkKGmNUAvYupo6FbG3.ybGOiKGSBKOd2aJgAzNwbCyQtf.zco6', 'customer', '2025-09-26 15:14:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(49, 'lara', 'lara@gmail.com', '$2b$10$A1nY1HfhjqKOBkEmX/pzF.Y2gidYMDecKN3x5ieu92s0Xas.ZJtGC', 'customer', '2025-09-27 12:04:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(50, 'manon', 'manon@gmail.com', '$2b$10$3llCdM660tyYr7lpTRq8cej5HwYL/0sV/.QS6l2OxY4BJnPPqLWKq', 'seller', '2025-09-27 12:05:54', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(51, 'soph', 'soph@gmail.com', '$2b$10$6fkKEPVRml6i6U8RPUE39.sVdmQdVNn1DvIjDvB7e5h/J7jA3KzLe', 'seller', '2025-09-27 12:08:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(53, 'kimberly', 'kimberly@gmail.com', '$2b$10$1W2cVva3AsF8cbtaQihKI.2hIut002hoRFpza8H4o7sPT8KrUhgDW', 'seller', '2025-09-27 12:10:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(54, 'rollan', 'rollan@gmail.com', '$2b$10$C9MPdW/HCvTNfimiFcjn7uRuvvJ5Guvcp6mNtVxP2pFHXG6o0vNCe', 'seller', '2025-09-27 13:38:56', NULL, '', '', NULL, NULL, '', NULL, 'data:image/jpeg;base64,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', 'approved', NULL),
(55, 'ayoko na', 'ayoko@gmail.com', '$2b$10$j/2Z4/2xkWY3tA6CJ7rTi.KW3FotLAcUYSshdJiyx5NiZtj6TCnKe', 'seller', '2025-09-27 14:08:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(56, 'jp', 'jp@gmail.com', '$2b$10$FXnnCXvcS2FoeggvQGukoO9WkoMtLG6KFOpOgg86neNZg.0.911EK', 'seller', '2025-09-28 13:28:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(57, 'Sha', 'sha@gmail.com', '$2b$10$Ldven2LhAtXNdzKlL9pIXOkzrnSeHGlwquaVWbb7.DDU4tbH0ck5K', 'customer', '2025-09-29 01:30:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(58, 'erika', 'erika@gmail.com', '$2b$10$vS48gZpjSN8qrQy/e1EyceDCa6jnn.2E9srK09ChWJ.rqGN8.Cij.', 'seller', '2025-09-29 01:35:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(59, 'evan', 'evan@gmail.com', '$2b$10$nIfgHQ1QBdEe2dOrQI8pDerXet374kJlXlxtdD6XGrczKJVFUgsIW', 'seller', '2025-10-01 00:55:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(60, 'kimm', 'kimm@gmail.com', '$2b$10$TGWnhTCyKldY8E8bzwF55ugNhFIjZNZSXT3UKqBWgdVGBuWRTeENK', 'seller', '2025-10-02 05:31:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(61, 'van', 'van@gmail.com', '$2b$10$YzTV81v7nDYOB9D2b3kN4u8dIktzeHaAF/EZPh14vd/ekVILDXzcq', 'customer', '2025-10-02 07:22:46', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(62, 'ger', 'ger@gmail.com', '$2b$10$3md0f/sJeZRMg5uwCX9aQuktjFaBnCqC9PgJjKgjUlzbhYs9srOJG', 'customer', '2025-10-07 01:18:18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(63, 'ka', 'ka@gmail.com', '$2b$10$Bg4n8a1vRT2GJJQf.kFgfuUxwOfAs/.IZoLlJaKAS6m1JLLQbU7mS', 'seller', '2025-10-07 01:51:12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(65, 'ss', 'ss@gmail.com', '$2b$10$/F1UPkAealMfmRxju66PXOEhAtatsOXlI4Q/BSzu/tdr8v.LpLND2', 'seller', '2025-10-07 02:11:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'rejected', NULL),
(66, 'kiki', 'kiki@gmail.com', '$2b$10$PJ7shLQHSDh6bflaSM7DKe3x9ieYOUAfjBx5g8ScIUH8hLpFM32AW', 'seller', '2025-10-07 02:33:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'rejected', NULL),
(67, 'kuku', 'kuku@gmail.com', '$2b$10$70VbZYyu4EpfPBORDMqZ/.wAuqqCbnDMvYrTA8ztJ9oq5oJUmO36i', 'seller', '2025-10-07 02:33:48', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(68, 'ku', 'ku@gmail.com', '$2b$10$Qcq.qApbcwOQK4NoR/e0Ue7MaLUXqi1XXrNuBaf.CGIvl2sF1onTy', 'customer', '2025-10-09 05:34:48', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(69, 'paul', 'paul@gmail.com', '$2b$10$jQCbXE6I4g2Q2h5ZpxX2ruCGMi3nOOvZozO..jHJn9Nb.L.KvZ4pu', 'customer', '2025-10-09 05:39:27', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(70, 'si', 'si@gmail.com', '$2b$10$4brG4kdq/qAjD8nKuEHcw.UxQH.r6.Xokh2wftawBGg6kdnwa4HPy', 'customer', '2025-10-09 06:06:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(71, 'bo', 'bo@gmail.com', '$2b$10$QrLgaPKzLlSw.wKBRZ5PxerTprJjzJNWKaZ3gTGjMMlhIp.HA6Awq', 'customer', '2025-10-09 06:17:29', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(72, 'jennie', 'jen@gmail.com', '$2b$10$VuWuNCcBvVQyoM7i7sZn5.ObgPiqCSFVKrQMi5C/k8bvnSeOxYlRC', 'customer', '2025-10-14 13:49:26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(74, 'ab', 'ab@gmail.com', '$2b$10$Pxg8716rxJou0ox9zh4p7u0NFYZ0tdCSHLEc7tZ1dxnJMMfXgru2W', 'customer', '2025-10-14 14:16:06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(77, 'abcd', 'abcd@gmail.com', '$2b$10$M/pP/CszRfn3yyj./RKs/eVNtkuztNF9Dbw.PzdbcCv1lWquCtFCi', 'customer', '2025-10-14 14:17:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(78, 'fi', 'fi@gmail.com', '$2b$10$eZ.8jViPmqk0Y27bkK4wce.OCHdmHtEvImLVOFM3MMT7G9xk6ZtfK', 'customer', '2025-10-15 12:08:48', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(79, 'pauline', 'pauline@gmail.com', '$2b$10$bo/IElkfA6yEqF/5ASD6UuPhz6DsxDb2SYvoSQAQPIYaAjW5WxygC', 'customer', '2025-10-22 00:35:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(80, 'emkim', 'emkim@gmail.com', '$2b$10$DRtsLx9YiegHjoJbgWyQbOQjaSALb3O/9AChitL55q97kJdZlHvcG', 'customer', '2025-10-22 00:46:12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(81, 'fli', 'fli@gmail.com', '$2b$10$7ceBVL.PDdL6/k1cV2iErOmpTcAgGbJ4ZkxkT69wLRaGrYbq88Ur6', 'customer', '2025-10-22 01:34:06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(82, 'sach', 'sach@gmail.com', '$2b$10$tWX36m/khLof8MSB4C1bJesk54J6L1GOKGEyyDtZEU2/BsiDnOnhW', 'customer', '2025-10-22 04:09:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(84, 'shelley1', 'shelley1@gmail.com', '$2b$10$ZNgFh.dZ2NtoS7FsUNva1OE9ZGb5eCZQeokryABvlGF9jaZRSEcle', 'customer', '2025-10-24 04:39:59', NULL, 'shelley', 'peque', NULL, NULL, '', NULL, NULL, 'approved', NULL),
(85, 'sharwin', 'sharwin@gmail.com', '$2b$10$EZP3MhZ/eJ5MQ4hIsirAZeg3UCF6UsSLlAkU09o8DJDcM3aUIaZ/K', 'customer', '2025-10-28 05:54:27', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL),
(86, 'user1', 'test1@gmail.com', '$2b$10$tCmdQnbS7.fzADltokCyyugWDYubPIoZoQUBNzZ/HFT4R57o.Iv5.', 'customer', '2025-10-28 08:17:28', NULL, 'user', '1', 20, '2015-07-13', 'Diego Silang, Taguig', 'female', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAB4AHgDASIAAhEBAxEB/8QAHQAAAQQDAQEAAAAAAAAAAAAABAAFBgcCAwgBCf/EAD0QAAIBAwQBAwIEBAMECwAAAAECAwQFEQAGEiExBxMiQVEIFDJhFSNxgUJS0RYzkZMXJERFVWKCkqGx4f/EABoBAAIDAQEAAAAAAAAAAAAAAAIFAQMEAAb/xAAqEQACAgEDBAEDBAMAAAAAAAAAAQIRAwQSIRMxQVGRMmHwBRXR4SKhwf/aAAwDAQACEQMRAD8AmhbSLY1qL515z0ZxkzZ1okPR1mzfbWl286ijjW7Y1iX1g7/vouG3xx2mou9yrYbTZ4DxesqM4Zv8qgeTjv8AoD31qrJOOKO6bpEN0CFsayhilqWKxRvKwGSEUsQP7aZ9veqewbiaxaWslv8AcEXFNQmRaRZnKnrkzd/LAwDn64I1HN2bw3Xb9u1U+4N20WzZUeN47JYYxLPHGTkCVh4YYbvJyAwIznCvL+owjxjV/wCv7Ac/RN6iN4G4SI0b/wCVxg6VVbK2khWWajqIYnGVeSJlUj7gkapv0a9a7fYarcEkdXe9wTSxL/DmucXu8GWTjyVsFVJTJ8YDAdnGC1br33cP+kFlv9+vSWuRFliqTUhJ0U5ILcVCsOz1joYA+2g/cJOSjsJ3Oy5pSe9CSHvzpqi9Qtr3FwtPf6N3PhWLISf7jTpLkZzptDJDJ9LsNMGkY6GkfW2Z+zoV21YFZqkcg6WtUsmlriSy/cydelv30IsnfetnPP11YAbWfzp22/TU8FSKy6UbSUXHEXvP7UckhYADkSM9EnA7JA0z3VqexWAXm61sFuoGYpG83ItIQcHiFBJGfroXeW4Zr9s+3mhliqaeJVMTxRc1YqQUk8chgAgkEHGRg56VavPLpyjh5fmu6K5Pjgqn1X9f7xsC/Glqdn08dN8hDO3IpOMt8wUIHjh1nrvz51Jd+7goWtFnXfFbHb6xaQGPblIhqYYUlUj3JsMoViCOyzBS/wC51Ulmu93q4He4S1dBaVklgqqppBTw+xiNY0RJM8mBBYgKT8uyASRbtk9P9tet9kqK+a4zRw1lUZjcZeKtOEQhuKtlVH6vAOOJOvP5W3FKcu33bAIf6denuy947fpbdYKa33K8UEpiqqxacmSVskxyFyw4oACXIyejjIA5S3c9BQJZqmxLNBua41sjylloxBUMQnHLYboj5EE5/WPJOmazerGy/R29jatrt9t/PXloqP8APUsZYRpk5EzsQZeeRy44UZA7IOHjdmzb5PbI6yxXGZbjU1BjqXYBmnYkYLEgn9TpgDAUKxH+IqDxykutK9v58BbeLZz/AHP04p7PIzQ0F32ZPH1JOiSvTKC548mbo5UDwVGc4+2rH9OtoWK5W2urbzEN83dMJBSgSLDEFTtm4MRl2ZEGc/pJA8EvHpj6ex+mVPctz7tejrZqeMSC2mZXZSyKW9wMpBzx4dgYVpSOh1XUXrhumkq9wXewm2U+0kdqJ6CVhHG5KH5KBj7tgHr5jr6id08tqD7ef7JSb7FzVnp/sG0bRpLtuOwUtnuVDElRK9LE6Fn49pwZhyPIBQmMrnLYDACIH8Rez6+dYI6CupUBw08soZjnvpeIBGMHyD5HfWqSvPrFVep91/IX6oEqzfEQ0fwUjkWVAzZAUEnAGfJ+uNPtj9MtrXGT85VXKsttFTL7k8LRLMZFwCVjOF+h7z1gjvWnE8mBbZzaf58k049y/wBayGtpo6inkE0Eqh0dfDA6Gkk/fQFk3Lt+8UsdPZqwcYxwjpnj4txCg9cSy+MH9WiZTjXpMWSOSNp2GaJX786WtEz4Olq44s6zNS1Nypoq6oelo2kAlmRObIv1IH11q9WfUOn9K7S81JtbnDMgWC418gZZOQbBUE4JIKPjipC5OW6Gm2J8acbnNFuI0v8AFqamuQplCRrUwqwxxC9jHfxAGT3rHq8GXNXTlXvxfwA1ZWMX4lLfvu0y7ZudPT2SnkkH5OonT3kp2KuC7gsARliAe8E95Hku2bi296LbZqqKs3lTbkqColo6eBj7cSEZ8DLEk8ugwGceAc6Y98/h8sq2S/7kt8EtRLBxZaHCBU5FmaRmC5KqA30ySUXPY1U+1b7u60T0tJLFQRU1tcTR0k1HDgkE5L/Hvwez2POdI5Rlim1e1rvzyDR0pfd5baTcezFu1nWe9VVFT1CCrXMFIJI3Kn2Tlg3N0HJ1YfPIHwOmrefpvbN93iCqa8VFNQRwBxabay0609RkiVvh4xIJFxk9qxyc5Ml3F+Q9QDatx09uWpqP5c9PK8gVaReERPAE5cl0kGegFdTxbBDNdfd5dqWW4Xa5zS1tfMxZKeeVS2ATxjBCgYAOcAYGcDPkhpcc1m6mVParuyzHjlOajFWzkz1W9EN0bSv4uaVFReaQMGhuIGZFIOQH7yD9j9cdfbV02n19rbBtCWPdkLUO4hGY8JxxIGXKtInfAYJyCO8eMHVb7w/EFeq8T01NXGIMzBFXCKVPRzhct11jPXL6kfGubfSbh9Qrg0dBQVl3mBBdokL9kjJdjkDx5Y6ZuU52oKov5Hbx44JdTmS+CX2c3/1f3hf66o3HWW6ipYHr5ZnZpwB1hQmVBOB5P20wS024d93Opigt0tyqFRS0dFTLGgIGFZwgAGSB2ceDro/0a9HBsLalwguzrU3G7Iq1aoTwRApAQH7jm2SPv141Wt82JfPTW9rVUr1iQzT+2tXbnZQ0XJce5g9NjkMeD2cjGrJ4+lGL28FWKUckpJPnwaPUPYVg2B6W2+2vSQpuqp9uaWdMs/xIZ+yegB11gdE6me7rx6fU9Ct327fHtVdMDmhqoHZ0k88lIX9IyR9Qc+TqMbc9Lrx6gXNa29muorcyiZ5ZzwedyQSAmfByTk5x4BIxqN13ptcv9uZ0qY2EC1Aiz3wSMn4/vjjj/wC/GsmdKUd01SKNQ4RWy7fsnOyaG217XG701JMlTCrP7tpm9qTl8/C54uSAAAAoJyTg6kO3d5113uDRyurQSMoNNUkLPAcHkWY9k5ByB4xjH1Fcz3iPa+99sR0MshqRF7dfGngxHiQDkffmf+GNXNJDEtSZ1ijE/Y90IOX/AB86DBppZFvxyqX/AAX0ZVYaGV0bplJUjP1GloaVyTpa9EkEWDEdFxt1oGI6Lj1acHU1S0DZXiQcZVhlWwQRkf1AP9QNMF32RYrzUrLU0IdBjNPzYxNhmYZBPeCx6zjoddDTymsm1nnhx5HunFNkGtAlPEkUKLFEihURBhVA8AD6DVa+t/v1NopYY3kSEJJLMxUtHgYHHHSsT0CXIVVLE5PHFjSsFOob6o21L1tURNTyVSw1UUxRACoUZBLg+Y+xyH2B/prNrYOWFteBjoJKOdX5tHDG6aB6WaQOJTNHKFyylRjJAIyB0ddU+g2/tl7X2dbLKtRUUFfUN7lTJXRMEedh3/MA4BesDJHQH1OqruNk/j8aU9DB+YkqFjaWsPMxOOOC5ZjyKsWLKq4JKOMMQAYvd7T/AAWxUZraSqR1LCOuc/yZFZicKv2IYHJwD8u/GsePUVVdzZm0qbdvg7ndufYIKnsEeDod3OubPR/8QotNyg21uSpRLVHAFo6x0YyA8hgOcn4gcgOugo10hIwZQykMpGQR4I03hNTViacHB0zRNJnTdXU8FUUM0McpjYMpdQcEeNHSaEnHnRSjGaqSsAiDbGsUV2NzFArVxf3Ped2Y8vvgnGdOMg70dMPOg5OtDGEYfSqOA5POlpS9tpak4ncRydGxnA0BEe9FRtq04NR+x571c49Cqy3enFPuKG1S7mu1TEtQlriqlplWM99s2MnHZ7H99RP0O2F/t/vaCKoBW2UQFTVPjIIBGE/9R6/pk66x3NdEtxWVjUlEjaQJTqwwoK9DHn4nx/Xx3rBqcrgqTNGHHuds+eN59S9/2O9pSVPpVSbVowGH5280ryIACRyVmbDnx0M5IJzjJFWfiB9d75uKlp9q2GOD8/WwlpqWlhjg4KQWyxUgD4gHvxg99419GIaq4RRW0rcBCKqKSExVZR5fdaNHVlPj4xx5BduvdYE+Aa5v1dS+zLXXS32S62yNFqJqu4UcbR8fy0bxoOiZAv8AMf7AEE55g6SublJSk216/kc46gmoxV+/4PmFdK1/TH0vW0GN6u+3dopqqVmVjT5AkjjjKnIHzyRnBYno4IBHrNb56Pa9jt4i4VkNDBC8fIcuSrGGyT2xDBl7PWMDrs9/1G37XPNb46vamxpbvLXCEXGsoo5JJWjLSO4DRjCMAQf0kcVIwGYiK1Fdbb3S9bf2fJHKiF1jtlIXnlVg2P8AdqxEiv5Kj9AHwwdSsitTrm7YT5i4eKSX59z53g2istsbVtLNDdVUKzYZWjA8n7HIwRn65851d3ox+Kms9M6a22G52q27l2zCHAinpQlWgJLf7wZ8E5x9vqNdIXO9UFWyCXam0adQzukH8LpfaVm4BAGEZU8g6t/5R1401PeoYa55LZZNu2V6krTxSU1shidlRVcqG4ryVvh0T2XGfkrAW9b1ZR07XJKtq+pHpb6lGGG3QvDVuqmWOjncNGT5PCVRyx30pPjRG7fT5bPb/wCIUNwFVTHv2J4zDOo+5U+cahj7r3NGkixXuk9v3BMZqGA+0gKjIdlJBADqcnGQc9AHTnbamrSu9yvrJa8kZf8AMIYwvWCoX6nGc/20UNXOD57AS00JLjhkembQUrY09bloVt1xkSPuJhzT+h0xSHOnkZKSUl5E7Ti6YPIcnS14+lriCbRv1oiOTVgr+HPey+aOn/5w/wBNbB+Hjeo/7JT/APOH+mrqItFv/hLpki2ruGtHTy1SQkjAbCoT19/1eNWLeqmQy1DfH3WzEglken4seOWLAgccJ5GTnH7Awr8Pu0L5sez363XmmRFnKTQlWEinAYMCP+Gpff7gkFNIrgztDIoWBcKJWAJPwfAYLktgHOU+hGQi1fE3Yy0/08EOvV/esMSUX/XJIaZZJaUVaR05Uj28uhUhgZAAwBIA4kjI1CrpNW07R1EyXSrMkkkctUtXR85RToMK0vFSoLRsxGCVZC3xVVAkt6Ptuaiekmqq2JRLLDDSRSxKsLc0ClfPMMoC/QsrFQQw1ENwR26wmBKulcUsSLEzVlkQuA7L8mKkfKbk6HCY/luw4lcaXMYJEO3pVmivM+K2akudHEjzLRVSTU8MiIvPrieAVUB4AHkqReOw0Fm3RT0W2K2ZrhXhCmamlVkkQFUDlH+JYswK8uTZy7ZHedSfdjV1bYZqW7kVlwjUhqRbc7pFxWENEzKcF+TpM2C/Bg/FyGxqH/ma+ilrLY1NVw0cbRlIWqXWIANTkr7oJLYPAEEdh17+Da5Esb62bE94qJayoqq0TPE8FOqOeveSTiJHKkmaZ16VQuFyTGSuhInqXlBUj3J5yXmgzTPOvJXMpcxqS7KrsTjGXI/QAdGM0YhmEVXTfnadljkqoKp0XCIwPy4qOKPFVec/oLMCCSQ6y31FUf5iwmMCNWeorJgkEPlw3uHLEL7J7P6kJ65Mpk48q69KWnpYTT2+FSSDCk0kaIeTmSM5x/gUqMjzxJI6ybTSj3GlHBHc/NaBefyPENykdewMHv7dHTbas2ellhb83xp1SOSoM8ZKgRtyzn5sWKAZwBxCnGQdZ2po46JabnDMY4wjIszyqg/w8QFwPP7jvGhaDTHTdg5W2ik4qrITGQrcvIB8/X/91EWbVipsDcm7bFDLaLY9XCJW5MgWNRjxgZ/fTe3ohvn/AMAm/wDen+uvQ6VPoxsRahrquiByN3pamsvojvhf+4Jz/R0/10taqM59FWi/bOtMkenFo9aHi1eVUN2TE/IedNl3pVlCODIyh+ZQSZwT1kAjH1x/Txp8lhHegamLCnGsmfDHKvuaMU3jfBVVfQwqLmtRURyx1ECsy1MZRgGySg45wjqCmPHHx9c1le7QL+lwplqYI6WC4PMsMjTBJUmiBfl0fKmccmH6sKFBwwt7eInoleSCjMydFkjbiejkY+hwRnB1S2694WlVqUr2moPejWmlSpZ0yq+4QeZOOzK/XfeMYwMIcuCeN9hzjyxl5Ba1qWc26K5NPV+4BUU0RuGVUleSciHQszOEYDoF1chfkvKvt62ZfekKRLRVHftyxqrU8ZDn23hj58QpXkwXGcICfjkFyPq5t2srYZ4L9RGUPlYJ5EDEMXUgqxySA5IOMH98DUP3D6o7aqoJRJVUvvNT5mUyxEuDnkgIGWwodT0T4676o2yvsXWvY5VVNMZ3neWnnMzBI0agWMyJHlEZQXwAobic94VFYnzpqneikeSLlCXl5yryI7LAq6EBuWA5zj6YAzlRiDXj1t22S8DXOIxYkQ+0SpBOQ5BVR330wA8DH1JiVw9drdUORT+9WN3xEML4B6+pIH7f01Ysc32QDyQXktqtqaSCX+RDBDG6sZGjiVQ5A4KSzDOQqjvJ6I6Och+2xaKred0WmikMdLyImnnk5LGv3+xPQ6B/+PHPFJvy8XecMtD7Efj59sRnP01Yu3N13lI0Xm0aD/CvQ1php+f8ymebioHeu2rjZduWamt1HKgihXjn6sfqx/cnJ05nc1E3iYY1x7ZN33L48pWP99TS27pqnxyZj/fTZZaVJCt43ds6LbcFI3iUaWqUpb5K+PkdLRrJ9iNh2aW1iWB0tLWujMaZMHQskY+ulpaGgkwKehin6ZQw/cajt49PrReUZamihlB88lGlpaikTbK03H+FfZl8Z2ltFNyP14DVb3f8COyql2aK3woT/lUDS0tDsTC3sYJvwJbchyYoAv7DXkf4MbTRn4RHS0tD0ok75exwg/CpR0+OMZ/vpwg/DnHTY4p40tLUdKPo7fL2HweiBpjlV8acIfSySD/DpaWp6cfRG9hqbBkhA60tLS1OyJ25n//Z', 'approved', '09218255596'),
(87, 'seller1', '1@gmail.com', '$2b$10$1ZdBLP85KEguqqt2hXiuxuqtRggKdbxkmpAo27Zs/RJvVUUnydRm6', 'seller', '2025-10-28 08:27:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_inventory`
--

CREATE TABLE `user_inventory` (
  `inventory_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_type` enum('water','fertilizer') NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_inventory`
--

INSERT INTO `user_inventory` (`inventory_id`, `user_id`, `item_type`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 7, 'fertilizer', 0, '2025-10-11 11:27:24', '2025-10-11 14:10:27'),
(2, 7, 'water', 0, '2025-10-11 11:27:31', '2025-10-11 14:03:38'),
(22, 39, 'water', 0, '2025-10-14 13:48:01', '2025-10-15 00:28:36'),
(23, 39, 'fertilizer', 1, '2025-10-15 00:06:01', '2025-10-15 00:28:51'),
(37, 78, 'water', 2, '2025-10-15 12:20:39', '2025-10-15 13:09:44'),
(38, 78, 'fertilizer', 0, '2025-10-15 12:20:42', '2025-10-15 13:04:09'),
(60, 40, 'water', 2, '2025-10-19 03:20:48', '2025-10-20 06:25:24'),
(62, 40, 'fertilizer', 3, '2025-10-19 03:20:53', '2025-10-19 03:27:49'),
(82, 80, 'water', 4, '2025-10-22 01:07:44', '2025-10-22 01:35:37'),
(83, 80, 'fertilizer', 3, '2025-10-22 01:07:47', '2025-10-22 01:07:57'),
(92, 82, 'water', 0, '2025-10-22 04:12:52', '2025-10-22 04:25:23'),
(93, 82, 'fertilizer', 5, '2025-10-22 04:12:54', '2025-10-22 04:21:19'),
(114, 34, 'water', 0, '2025-10-24 08:50:30', '2025-10-24 08:50:41'),
(115, 34, 'fertilizer', 1, '2025-10-24 08:50:33', '2025-10-24 08:50:33'),
(116, 85, 'water', 0, '2025-10-28 05:58:52', '2025-10-28 06:00:26'),
(117, 85, 'fertilizer', 0, '2025-10-28 05:58:55', '2025-10-28 05:59:15'),
(119, 86, 'water', 0, '2025-10-28 08:20:02', '2025-11-01 05:06:16'),
(120, 86, 'fertilizer', 0, '2025-10-28 08:20:04', '2025-11-01 05:05:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `listings`
--
ALTER TABLE `listings`
  ADD PRIMARY KEY (`listing_id`),
  ADD KEY `seller_id` (`seller_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_is_read` (`is_read`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`pet_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `fk_products_category` (`category_id`),
  ADD KEY `fk_products_seller` (`seller_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`reward_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `pet_id` (`pet_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_inventory`
--
ALTER TABLE `user_inventory`
  ADD PRIMARY KEY (`inventory_id`),
  ADD UNIQUE KEY `unique_user_item` (`user_id`,`item_type`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `listings`
--
ALTER TABLE `listings`
  MODIFY `listing_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `pets`
--
ALTER TABLE `pets`
  MODIFY `pet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `rewards`
--
ALTER TABLE `rewards`
  MODIFY `reward_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=198;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `user_inventory`
--
ALTER TABLE `user_inventory`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `listings`
--
ALTER TABLE `listings`
  ADD CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `listings_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `listings_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `pets`
--
ALTER TABLE `pets`
  ADD CONSTRAINT `pets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_products_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_order_fk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_product_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `rewards`
--
ALTER TABLE `rewards`
  ADD CONSTRAINT `rewards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rewards_ibfk_2` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`pet_id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
