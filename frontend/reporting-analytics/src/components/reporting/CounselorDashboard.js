import React, { useEffect, useState } from "react";
import { getCounselorActivity } from "../../services/reportingService";
import { Radar } from "react-chartjs-2";
import "chart.js/auto";

const CounselorDashboard = ({ counselorId }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!counselorId) return;
        (async () => {
            try {
                const res = await getCounselorActivity(counselorId);
                setData(res.data);
            } catch (err) {
                console.error(err);
            }
        })();
    }, [counselorId]);

    if (!data) return <p>Loading counselor data…</p>;

    return (
        <div className="reporting counselor">
            <h2>Counselor — Assigned Students</h2>

            <div className="students">
                {(data.assignedStudents || []).map((s) => (
                    <div key={s.studentId} className="student-card">
                        <h4>{s.name}</h4>
                        <p>Avg Grade: {s.avgGrade}</p>
                        <p>Top skills: {(s.topSkills || []).join(", ")}</p>
                    </div>
                ))}
            </div>

            <h3>Skill Radar (example first student)</h3>
            {data.assignedStudents?.[0] && (
                <Radar
                    data={{
                        labels: data.assignedStudents[0].skillLabels || [],
                        datasets: [{ label: data.assignedStudents[0].name, data: data.assignedStudents[0].skillValues || [] }],
                    }}
                />
            )}
        </div>
    );
};

export default CounselorDashboard;