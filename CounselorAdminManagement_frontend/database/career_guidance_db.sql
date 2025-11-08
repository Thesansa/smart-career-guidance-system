-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 22, 2025 at 12:21 PM
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
-- Database: `career_guidance_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_performance`
--

CREATE TABLE `academic_performance` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `grade` varchar(5) DEFAULT NULL,
  `year` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `career_path`
--

CREATE TABLE `career_path` (
  `id` int(11) NOT NULL,
  `career_name` varchar(150) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `required_skills` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `career_recommendation`
--

CREATE TABLE `career_recommendation` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `career_id` int(11) DEFAULT NULL,
  `recommendation_date` date DEFAULT NULL,
  `confidence_score` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `counselor_profile`
--

CREATE TABLE `counselor_profile` (
  `id` int(11) NOT NULL,
  `users_id` int(11) DEFAULT NULL,
  `full_name` varchar(150) DEFAULT NULL,
  `specialization` varchar(150) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `experience_years` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `performance_summary`
--

CREATE TABLE `performance_summary` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `average_grade` decimal(5,2) DEFAULT NULL,
  `top_skills` text DEFAULT NULL,
  `updated_on` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(2, 'ADMIN'),
(3, 'ADMIN'),
(4, 'ADMIN'),
(5, 'ADMIN'),
(6, 'ADMIN'),
(7, 'ADMIN'),
(8, 'STUDENT'),
(9, 'COUNSELOR');

-- --------------------------------------------------------

--
-- Table structure for table `skill_assessment`
--

CREATE TABLE `skill_assessment` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `skill_name` varchar(100) DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `assessment_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_counselor_mapping`
--

CREATE TABLE `student_counselor_mapping` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `counselor_id` int(11) DEFAULT NULL,
  `assigned_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_profile`
--

CREATE TABLE `student_profile` (
  `id` int(11) NOT NULL,
  `users_id` int(11) DEFAULT NULL,
  `full_name` varchar(150) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `University_name` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_log`
--

CREATE TABLE `system_log` (
  `id` int(11) NOT NULL,
  `users_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role_id`) VALUES
(7, 'sumi', 'sumi@gmail.com', '12345', 3),
(9, 'amalya', 'amalya@gmail.com', '56748', 8);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_performance`
--
ALTER TABLE `academic_performance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `career_path`
--
ALTER TABLE `career_path`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `career_recommendation`
--
ALTER TABLE `career_recommendation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `career_id` (`career_id`);

--
-- Indexes for table `counselor_profile`
--
ALTER TABLE `counselor_profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_id` (`users_id`);

--
-- Indexes for table `performance_summary`
--
ALTER TABLE `performance_summary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `skill_assessment`
--
ALTER TABLE `skill_assessment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `student_counselor_mapping`
--
ALTER TABLE `student_counselor_mapping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `counselor_id` (`counselor_id`);

--
-- Indexes for table `student_profile`
--
ALTER TABLE `student_profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_id` (`users_id`);

--
-- Indexes for table `system_log`
--
ALTER TABLE `system_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_id` (`users_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academic_performance`
--
ALTER TABLE `academic_performance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `career_path`
--
ALTER TABLE `career_path`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `career_recommendation`
--
ALTER TABLE `career_recommendation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `counselor_profile`
--
ALTER TABLE `counselor_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `performance_summary`
--
ALTER TABLE `performance_summary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `skill_assessment`
--
ALTER TABLE `skill_assessment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_counselor_mapping`
--
ALTER TABLE `student_counselor_mapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_profile`
--
ALTER TABLE `student_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_log`
--
ALTER TABLE `system_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `academic_performance`
--
ALTER TABLE `academic_performance`
  ADD CONSTRAINT `academic_performance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student_profile` (`id`);

--
-- Constraints for table `career_recommendation`
--
ALTER TABLE `career_recommendation`
  ADD CONSTRAINT `career_recommendation_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student_profile` (`id`),
  ADD CONSTRAINT `career_recommendation_ibfk_2` FOREIGN KEY (`career_id`) REFERENCES `career_path` (`id`);

--
-- Constraints for table `counselor_profile`
--
ALTER TABLE `counselor_profile`
  ADD CONSTRAINT `counselor_profile_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `performance_summary`
--
ALTER TABLE `performance_summary`
  ADD CONSTRAINT `performance_summary_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student_profile` (`id`);

--
-- Constraints for table `skill_assessment`
--
ALTER TABLE `skill_assessment`
  ADD CONSTRAINT `skill_assessment_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student_profile` (`id`);

--
-- Constraints for table `student_counselor_mapping`
--
ALTER TABLE `student_counselor_mapping`
  ADD CONSTRAINT `student_counselor_mapping_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student_profile` (`id`),
  ADD CONSTRAINT `student_counselor_mapping_ibfk_2` FOREIGN KEY (`counselor_id`) REFERENCES `counselor_profile` (`id`);

--
-- Constraints for table `student_profile`
--
ALTER TABLE `student_profile`
  ADD CONSTRAINT `student_profile_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `system_log`
--
ALTER TABLE `system_log`
  ADD CONSTRAINT `system_log_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
