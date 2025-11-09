import React, { useEffect, useState } from "react";
import { getStudentPerformance, getStudentRecommendations } from "../../services/reportingService";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";

const StudentDashboard = ({ studentId }) => {
    const [perf, setPerf] = useState(null);
    const [recs, setRecs] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                if (studentId) {
                    const [p, r] = await Promise.all([getStudentPerformance(studentId), getStudentRecommendations(studentId)]);
                    setPerf(p.data);
                    setRecs(r.data || []);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [studentId]);

    if (!perf) return <p>Loading student data…</p>;

    const lineData = {
        labels: perf.gradesOverTime?.map((g) => g.term) || [],
        datasets: [{ label: "Grade", data: perf.gradesOverTime?.map((g) => g.grade) || [], tension: 0.3 }],
    };

    const barData = {
        labels: recs.map((r) => r.careerName),
        datasets: [{ label: "Match Score", data: recs.map((r) => (r.confidenceScore || 0) * 100) }],
    };

    return (
        <div className="reporting student">
            <h2>My Performance</h2>

            <section>
                <h4>Average Grade: {perf.avgGrade}</h4>
                <Line data={lineData} />
            </section>

            <section>
                <h4>Recommended Careers</h4>
                <Bar data={barData} />
            </section>
        </div>
    );
};

export default StudentDashboard;