-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 10, 2025 at 05:23 PM
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
-- Database: `smartcareer_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_performance`
--

CREATE TABLE `academic_performance` (
  `id` bigint(20) NOT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `student_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `academic_performance`
--

INSERT INTO `academic_performance` (`id`, `grade`, `subject`, `year`, `student_id`) VALUES
(13, 'A', 'Mathematics', 2024, 4),
(14, 'A+', 'Computer Science', 2024, 4),
(15, 'B+', 'Physics', 2024, 4),
(16, 'A', 'English', 2024, 4),
(17, 'A', 'Data Structures', 2023, 4),
(18, 'B+', 'Algorithms', 2023, 4),
(19, 'A', 'Intro to Computer Science', 2024, 4),
(20, 'A', 'marhematics', 2024, 6),
(21, 'A', 'Intro to Computer Science', 2024, 6),
(22, 'A', 'Python', 2024, 6);

-- --------------------------------------------------------

--
-- Table structure for table `career_path`
--

CREATE TABLE `career_path` (
  `id` bigint(20) NOT NULL,
  `career_name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `required_skills` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `career_path`
--

INSERT INTO `career_path` (`id`, `career_name`, `description`, `required_skills`) VALUES
(1, 'Software Engineer', 'Designs and develops software systems and applications.', 'Java,Spring Boot,SQL,Problem Solving,Teamwork'),
(2, 'Full Stack Developer', 'Works on both frontend and backend development of web applications.', 'JavaScript,React,Node.js,HTML,CSS,Git,Communication'),
(3, 'Backend Developer', 'Focuses on server-side logic, databases, and API integration.', 'Java,Spring Boot,REST APIs,MySQL,PostgreSQL,Debugging'),
(4, 'Frontend Developer', 'Builds user interfaces and client-side functionality in web applications.', 'JavaScript,React,HTML,CSS,UI/UX,Creativity,Attention to Detail'),
(5, 'Mobile App Developer', 'Develops applications for Android and iOS platforms.', 'Kotlin,Java,Flutter,Dart,UI Design,Testing,Adaptability'),
(6, 'Data Analyst', 'Analyzes data to support business decisions.', 'Excel,SQL,Python,Power BI,Data Visualization,Critical Thinking'),
(7, 'Data Scientist', 'Builds predictive models and performs statistical analysis.', 'Python,Machine Learning,Statistics,TensorFlow,Pandas,Research Skills'),
(8, 'Cyber Security Analyst', 'Protects systems and networks from cyber threats.', 'Network Security,Firewalls,Penetration Testing,Linux,Risk Analysis,Alertness'),
(9, 'Cloud Engineer', 'Designs and manages cloud infrastructure and deployment.', 'AWS,Azure,CI/CD,Docker,Kubernetes,Networking,Documentation'),
(10, 'UI/UX Designer', 'Designs user interfaces and improves user experience.', 'Figma,Wireframing,Prototyping,Design Thinking,Communication,Empathy');

-- --------------------------------------------------------

--
-- Table structure for table `career_recommendation`
--

CREATE TABLE `career_recommendation` (
  `id` bigint(20) NOT NULL,
  `confidence_score` double DEFAULT NULL,
  `match_level` varchar(255) DEFAULT NULL,
  `recommendation_date` datetime(6) DEFAULT NULL,
  `career_path_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `career_recommendation`
--

INSERT INTO `career_recommendation` (`id`, `confidence_score`, `match_level`, `recommendation_date`, `career_path_id`, `student_id`) VALUES
(28, 0.38, 'Low', '2025-11-10 19:31:08.000000', 1, 4),
(29, 0.42, 'Medium', '2025-11-10 19:31:08.000000', 2, 4),
(30, 0.36, 'Low', '2025-11-10 19:31:08.000000', 3, 4),
(31, 0.42, 'Medium', '2025-11-10 19:31:08.000000', 4, 4),
(32, 0.35, 'Low', '2025-11-10 19:31:08.000000', 5, 4),
(33, 0.29, 'Low', '2025-11-10 19:51:33.000000', 2, 1),
(34, 0.3, 'Low', '2025-11-10 19:51:33.000000', 10, 1),
(35, 0.32, 'Low', '2025-11-10 20:55:13.000000', 1, 6),
(36, 0.4, 'Medium', '2025-11-10 20:55:13.000000', 2, 6),
(37, 0.3, 'Low', '2025-11-10 20:55:13.000000', 3, 6),
(38, 0.4, 'Medium', '2025-11-10 20:55:13.000000', 4, 6),
(39, 0.29, 'Low', '2025-11-10 20:55:13.000000', 5, 6);

-- --------------------------------------------------------

--
-- Table structure for table `counselor_profile`
--

CREATE TABLE `counselor_profile` (
  `id` bigint(20) NOT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `counselor_profile`
--

INSERT INTO `counselor_profile` (`id`, `contact_number`, `department`, `experience_years`, `full_name`, `user_id`) VALUES
(1, '077234568', 'Software Engineering ', 5, 'Dr. Smith Perera', 3);

-- --------------------------------------------------------

--
-- Table structure for table `performance_summary`
--

CREATE TABLE `performance_summary` (
  `id` bigint(20) NOT NULL,
  `average_grade` double DEFAULT NULL,
  `top_skills` text DEFAULT NULL,
  `updated_on` date DEFAULT NULL,
  `student_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `performance_summary`
--

INSERT INTO `performance_summary` (`id`, `average_grade`, `top_skills`, `updated_on`, `student_id`) VALUES
(1, 0, 'communication (50.0%)', '2025-11-10', 1),
(2, 0, '', '2025-11-09', 2),
(3, 3.742857142857143, 'html (75.0%), java (65.0%), javascript (50.0%)', '2025-11-10', 4),
(4, 0, 'No skills added', '2025-11-10', 5),
(5, 3.7999999999999994, 'html (66.0%), java (50.0%), css (50.0%)', '2025-11-10', 6);

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
(1, 'ADMIN'),
(3, 'COUNSELOR'),
(2, 'STUDENT');

-- --------------------------------------------------------

--
-- Table structure for table `skill_assessment`
--

CREATE TABLE `skill_assessment` (
  `id` bigint(20) NOT NULL,
  `assessment_date` date DEFAULT NULL,
  `score` double DEFAULT NULL,
  `skill_name` varchar(255) DEFAULT NULL,
  `student_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skill_assessment`
--

INSERT INTO `skill_assessment` (`id`, `assessment_date`, `score`, `skill_name`, `student_id`) VALUES
(1, '2025-11-10', 65, 'java', 4),
(2, '2025-11-10', 50, 'javascript', 4),
(3, '2025-11-10', 75, 'html', 4),
(4, '2025-11-10', 50, 'communication', 1),
(5, '2025-11-10', 50, 'java', 6),
(6, '2025-11-10', 50, 'css', 6),
(7, '2025-11-10', 66, 'html', 6);

-- --------------------------------------------------------

--
-- Table structure for table `student_counselor_mapping`
--

CREATE TABLE `student_counselor_mapping` (
  `id` bigint(20) NOT NULL,
  `assigned_date` datetime(6) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `last_updated` datetime(6) DEFAULT NULL,
  `counselor_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_counselor_mapping`
--

INSERT INTO `student_counselor_mapping` (`id`, `assigned_date`, `feedback`, `last_updated`, `counselor_id`, `student_id`) VALUES
(2, '2025-11-09 20:22:37.000000', 'keep it up!', '2025-11-10 19:59:37.000000', 1, 1),
(3, '2025-11-10 20:33:04.000000', 'keep it up!', '2025-11-10 20:41:09.000000', 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `student_profile`
--

CREATE TABLE `student_profile` (
  `id` bigint(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `date_of_birth` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `university_name` varchar(255) NOT NULL,
  `users_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_profile`
--

INSERT INTO `student_profile` (`id`, `address`, `date_of_birth`, `full_name`, `gender`, `phone_number`, `university_name`, `users_id`) VALUES
(1, 'rnmtoermj', '2004-02-22', 'STP', 'Female', '12345678', 'NSBM', 1),
(2, '45/1,example road,example', '2025-10-30', 'Lisa Perera', 'Female', '12345678', 'NSBM', 6),
(4, '899,titan road, Titan', '2003-02-05', 'Mikasa Ackerman', 'Female', '077345678', 'NSBM', 7),
(5, '45/2, lane.city', '2003-06-18', 't perera', 'Male', '223455689', 'NSBM', 8),
(6, '23/1, kottawa', '2004-03-11', 'Nethmini Wijekoon', 'Female', '077546890', 'NSBM', 9);

-- --------------------------------------------------------

--
-- Table structure for table `system_log`
--

CREATE TABLE `system_log` (
  `id` bigint(20) NOT NULL,
  `action` varchar(255) DEFAULT NULL,
  `actor` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `timestamp` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_log`
--

INSERT INTO `system_log` (`id`, `action`, `actor`, `details`, `timestamp`) VALUES
(1, 'Admin \'admin\' created counselor profile for user \'Dr.Smith\'', 'admin', NULL, '2025-11-09 20:02:09.000000'),
(2, 'Assigned student', 'admin', NULL, '2025-11-09 20:15:45.000000'),
(3, 'Mapping Removed', 'admin', NULL, '2025-11-09 20:22:19.000000'),
(4, 'Assigned student', 'admin', NULL, '2025-11-09 20:22:37.000000'),
(5, 'Assigned student STP to counselor Dr. Smith Perera', 'Dr.Smith', 'Student ID: 1, Counselor ID: 1', '2025-11-10 19:59:37.000000'),
(6, 'Assigned student', 'admin', NULL, '2025-11-10 20:33:04.000000'),
(7, 'Assigned student Mikasa Ackerman to counselor Dr. Smith Perera', 'Dr.Smith', 'Student ID: 4, Counselor ID: 1', '2025-11-10 20:41:09.000000');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `username`, `role_id`) VALUES
(1, 'stp@gmail.com', '$2a$10$ZdG/JhyIpXfRItpAZhPqReFcqBSyj8F3oBdqdTEkCpcEtlhaXt.J6', 'stp', 2),
(2, 'admin@gmail.com', '$2a$10$/qF0B7dLinpx4lLmbwR6VeNOUQvgwrShSFUzDHGtRseDtiNW1HTMy', 'admin', 1),
(3, 'smith@gmail.com', '$2a$10$k8cJKSAYK2KoxnsFoFdgz..YaDMFXorUaiLr6np0naRtfyCNUk87m', 'Dr.Smith', 3),
(4, 'hana@gmail.com', '$2a$10$bDEy.JiohQmAsBvuHKDi/uclWU7DwaNX/0AQPcrlZO6NKnTVP8PN.', 'Ms,hana', 3),
(5, 'lhon@gmail.com', '$2a$10$w/7gJm20/q.zUe3yn1xTnO38FumpcvRGX.COje7zMI0Rt2YGm/xW6', 'Jhon', 2),
(6, 'lisa@gmail.com', '$2a$10$52x8WGrV7/QMuowxBN07fOJrKpgFa72unm8pVPJZG7OS8Jv8VeVta', 'Lisa', 2),
(7, 'mikasa@gmail.com', '$2a$10$/uF4ZGAVxxXTWGRDGDLNvO4Ke5Y8IYuSyfTecZUPHFNY6dTcV7bXe', 'Mikasa ', 2),
(8, 'tsp@gmail.com', '$2a$10$CXH15fcUkqKtrUngnwxrAe6Dh/Q0.3v2W5cEUEHR.rYXxHyelqVWW', 'tsp', 2),
(9, 'nethmini@gmail.com', '$2a$10$6D9MNMqh5Gsd20nWLYYGq.pWur.PPGz4GjukKGrhODAvMx.70lr0K', 'nethmini', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_performance`
--
ALTER TABLE `academic_performance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKnn3f70tcyvedtaqwyd5tskbcm` (`student_id`);

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
  ADD KEY `FKbqwu07f3vl6neny4mh7an2m1i` (`career_path_id`),
  ADD KEY `FKrd1hmkwh1i9ylnmyjc0am3vt9` (`student_id`);

--
-- Indexes for table `counselor_profile`
--
ALTER TABLE `counselor_profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK5nro073xjgdtfur60qgkgqdvn` (`user_id`);

--
-- Indexes for table `performance_summary`
--
ALTER TABLE `performance_summary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1yjjqbs8wuuyqyd80oqy65e0a` (`student_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK8sewwnpamngi6b1dwaa88askk` (`name`);

--
-- Indexes for table `skill_assessment`
--
ALTER TABLE `skill_assessment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKd003tmbogfk6qyw52l5w2st34` (`student_id`);

--
-- Indexes for table `student_counselor_mapping`
--
ALTER TABLE `student_counselor_mapping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKom9py7j6dqaktthjjqabtxdde` (`counselor_id`),
  ADD KEY `FK5sho5jfjcmy8941fyo0ysvuyw` (`student_id`);

--
-- Indexes for table `student_profile`
--
ALTER TABLE `student_profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKm08dpvsohvlj36pqdehoo4k2f` (`users_id`);

--
-- Indexes for table `system_log`
--
ALTER TABLE `system_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  ADD UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  ADD KEY `FK4qu1gr772nnf6ve5af002rwya` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academic_performance`
--
ALTER TABLE `academic_performance`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `career_path`
--
ALTER TABLE `career_path`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `career_recommendation`
--
ALTER TABLE `career_recommendation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `counselor_profile`
--
ALTER TABLE `counselor_profile`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `performance_summary`
--
ALTER TABLE `performance_summary`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `skill_assessment`
--
ALTER TABLE `skill_assessment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `student_counselor_mapping`
--
ALTER TABLE `student_counselor_mapping`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `student_profile`
--
ALTER TABLE `student_profile`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `system_log`
--
ALTER TABLE `system_log`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  ADD CONSTRAINT `FKnn3f70tcyvedtaqwyd5tskbcm` FOREIGN KEY (`student_id`) REFERENCES `student_profile` (`id`);

--
-- Constraints for table `career_recommendation`
--
ALTER TABLE `career_recommendation`
  ADD CONSTRAINT `FKbqwu07f3vl6neny4mh7an2m1i` FOREIGN KEY (`career_path_id`) REFERENCES `career_path` (`id`),
  ADD CONSTRAINT `FKrd1hmkwh1i9ylnmyjc0am3vt9` FOREIGN KEY (`student_id`) REFERENCES `student_profile` (`id`);

--
-- Constraints for table `counselor_profile`
--
ALTER TABLE `counselor_profile`
  ADD CONSTRAINT `FKbl8jq4car8k532l9qfefkqu1l` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `performance_summary`
--
ALTER TABLE `performance_summary`
  ADD CONSTRAINT `FK1yjjqbs8wuuyqyd80oqy65e0a` FOREIGN KEY (`student_id`) REFERENCES `student_profile` (`id`);

--
-- Constraints for table `skill_assessment`
--
ALTER TABLE `skill_assessment`
  ADD CONSTRAINT `FKd003tmbogfk6qyw52l5w2st34` FOREIGN KEY (`student_id`) REFERENCES `student_profile` (`id`);

--
-- Constraints for table `student_counselor_mapping`
--
ALTER TABLE `student_counselor_mapping`
  ADD CONSTRAINT `FK5sho5jfjcmy8941fyo0ysvuyw` FOREIGN KEY (`student_id`) REFERENCES `student_profile` (`id`),
  ADD CONSTRAINT `FKom9py7j6dqaktthjjqabtxdde` FOREIGN KEY (`counselor_id`) REFERENCES `counselor_profile` (`id`);

--
-- Constraints for table `student_profile`
--
ALTER TABLE `student_profile`
  ADD CONSTRAINT `FKbse3hiebd9vhxh3fgnx0adi0n` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK4qu1gr772nnf6ve5af002rwya` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
