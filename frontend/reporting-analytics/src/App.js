import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/reporting/AdminDashboard";
import CounselorDashboard from "./components/reporting/CounselorDashboard";
import StudentDashboard from "./components/reporting/StudentDashboard";
import "./App.css";
import ReportingDashboard from "./components/reporting/ReportingDashboard";
import Reporting from "./components/reporting/Reporting";


function App() {
    // For demo you can pass hardcoded ids or get them from JWT/localStorage
    const demoStudentId = "student-123";
    const demoCounselorId = "counselor-1";


    return <ReportingDashboard/>;

    return (
        <div>
            <Reporting />
        </div>
    );



    return (
        <Router>
            <div className="app-header">
                <h1>Smart Career Guidance — Reporting & Analytics</h1>
            </div>

            <Routes>
                <Route path="/reports/admin" element={<AdminDashboard />} />
                <Route path="/reports/counselor" element={<CounselorDashboard counselorId={demoCounselorId} />} />
                <Route path="/reports/student" element={<StudentDashboard studentId={demoStudentId} />} />
            </Routes>
        </Router>
    );
}

export default App;
