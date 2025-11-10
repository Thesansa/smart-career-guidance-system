# Smart Career Guidance System
A role-based academic & career guidance platform supporting Students, Counselors, and Admins.

# Tech Stack
Backend: Spring Boot, Spring Security, JPA (MySQL)
Frontend: React
Database: MySQL

# Setup Steps
1) Clone the Repository
git clone https://github.com/Thesansa/smart-career-guidance-system.git
cd smart-career-guidance-system
git checkout PRODUCTION

2) Import & Run Backend (Spring Boot)
Open IntelliJ IDEA
Go to File → Open
Select the backend/ folder
Wait for Maven to finish loading dependencies
Configure the database in:
backend/src/main/resources/application.properties
Run the application:
SmartCareerGuidanceSystemApplication.java  →  Right Click → Run
The backend will start on http://localhost:8080

3) Import Database
Open MySQL Workbench / phpMyAdmin and execute:
database/smartcareer_test.sql
This creates:
all required tables
sample users
example student → counselor assignments

4) Run Frontend (React)
Open terminal:
cd frontend
npm install
npm start


The UI will run at:

http://localhost:3000


# Credentials
Admin Login:
email:admin@gmail.com
password: admin123

Student Login:
student 1:
email:stp@gail.com
password:stp123
student 2:
email: mikasa@gmail.com
password: mikasa123

Counselor Login:
Counselor with admin assigned profile :
email: smith@gmail.com
password:smith123
Counselor without admin assigned profile(pending)
email:hana@gmail.com
password:hana123

# Features List
✔ Student Profile & Academic Data Management
✔ Skill Management & Automatic Career Recommendations
✔ Counselor Assignment & Feedback Loop
✔ Admin Panel for Users, Counselors & Mapping Management
✔ System Activity Logs
✔ PDF Report Export

# Advanced Features
• Conditon based Career Recommendation Engine
• Counselor Feedback Workflow
• System Activity Logging (Audit Trail)
• PDF Export of Counselor-Student Mapping
• Role-Based Access Dashboards

