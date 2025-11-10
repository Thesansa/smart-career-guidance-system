import React, { useEffect, useState } from "react";
import { reportsAPI, counselorAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./CounselorReports.css";

const CounselorReports = () => {
    const { user } = useAuth();
    const [popularCareers, setPopularCareers] = useState([]);
    const [studentsSummary, setStudentsSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1️⃣ Get counselor profile using user.id (NOT user.id as counselorId)
                const profileRes = await counselorAPI.getCounselorByUser(user.id);
                const counselorProfile = profileRes.data; // contains profile.id

                // 2️⃣ Fetch popular career trends
                const careersRes = await reportsAPI.getPopularCareers();
                setPopularCareers(Object.entries(careersRes.data));

                // 3️⃣ Fetch assigned students summary using counselorProfile.id
                const studentsRes = await reportsAPI.getCounselorStudentsSummary(counselorProfile.id);
                setStudentsSummary(studentsRes.data);

            } catch (error) {
                console.error("Error loading reports:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) fetchData();
    }, [user]);

    if (loading) return <div className="loading">Loading reports...</div>;

    return (
        <div className="counselor-reports-page">

            <h1 className="page-title">📊 Reports & Insights</h1>

            {/* Popular Career Trends */}
            <div className="report-card">
                <h2>🔥 Popular Career Trends</h2>
                {popularCareers.length === 0 ? (
                    <p>No recommendation data yet.</p>
                ) : (
                    <ul className="career-list">
                        {popularCareers.map(([career, count]) => (
                            <li key={career}>
                                <span className="career-name">{career}</span>
                                <span className="career-count">{count} students</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Student Performance Summary */}
            <div className="report-card">
                <h2>🎓 Your Student Overview</h2>
                {studentsSummary.length === 0 ? (
                    <p>No students assigned to analyze.</p>
                ) : (
                    <table className="students-table">
                        <thead>
                        <tr>
                            <th>Student</th>
                            <th>Avg Grade</th>
                            <th>Top Skills</th>
                            <th>Recommended Career</th>
                        </tr>
                        </thead>
                        <tbody>
                        {studentsSummary.map((s) => (
                            <tr key={s.studentId}>
                                <td>{s.studentName}</td>
                                <td>
                                    {s.averageGrade !== null ? s.averageGrade.toFixed(2) : "No Data"}
                                </td>
                                <td>{s.topSkills || "N/A"}</td>
                                <td>{s.recommendedCareer || "N/A"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );

};

export default CounselorReports;
