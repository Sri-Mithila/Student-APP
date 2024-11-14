-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 08, 2024 at 08:27 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Student-App`
--

-- --------------------------------------------------------

--
-- Table structure for table `Faculty`
--

CREATE TABLE `Faculty` (
  `id` int(11) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Faculty`
--

INSERT INTO `Faculty` (`id`, `faculty_id`, `name`, `email`, `password`, `is_admin`) VALUES
(1, 123, 'Sam', 'intradocs@srec.ac.in', '$2a$12$PJvuLYtdgkw6cwS5OoRKBuCAeAtJBORkGUcmlcKUsTu4YqyqxdFJC', 0),
(2, 321, 'Gojo', 'muhammaduuwais.2101148@srec.ac.in', '$2a$12$PJvuLYtdgkw6cwS5OoRKBuCAeAtJBORkGUcmlcKUsTu4YqyqxdFJC', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tutor_details`
--

CREATE TABLE `tutor_details` (
  `id` int(11) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `roll_num_start` varchar(50) DEFAULT NULL,
  `roll_num_end` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tutor_details`
--

INSERT INTO `tutor_details` (`id`, `faculty_id`, `name`, `email`, `roll_num_start`, `roll_num_end`) VALUES
(1, 123, 'Sam', 'intradocs@srec.ac.in', '2201001', '2201020'),
(2, 321, 'Gojo', 'muhammaduuwais.2101148@srec.ac.in', '2201021', '2201042');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Faculty`
--
ALTER TABLE `Faculty`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tutor_details`
--
ALTER TABLE `tutor_details`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Faculty`
--
ALTER TABLE `Faculty`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tutor_details`
--
ALTER TABLE `tutor_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
