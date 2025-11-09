import React, { useEffect, useState } from "react";
import { getOverview, getPopularCareers } from "../../services/reportingService";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

const AdminDashboard = () => {
    const [overview, setOverview] = useState(null);
    const [popular, setPopular] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const [ovRes, popRes] = await Promise.all([getOverview(), getPopularCareers()]);
                setOverview(ovRes.data);
                setPopular(popRes.data || []);
            } catch (err) {
                console.error("Admin load error", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <p>Loading admin data…</p>;
    if (!overview) return <p>No overview available</p>;

    // Example chart data: adjust keys to your actual API response
    const lineData = {
        labels: overview.recommendationsOverTime?.map((p) => p.date) || [],
        datasets: [{ label: "Recommendations", data: overview.recommendationsOverTime?.map((p) => p.count) || [], tension: 0.3 }],
    };

    const barData = {
        labels: popular.map((p) => p.careerName),
        datasets: [{ label: "Times recommended", data: popular.map((p) => p.count) }],
    };

    return (
        <div className="reporting admin">
            <h2>Admin — System Overview</h2>

            <div className="metrics">
                <div className="metric">Students: <strong>{overview.totalStudents}</strong></div>
                <div className="metric">Counselors: <strong>{overview.totalCounselors}</strong></div>
                <div className="metric">Recommendations: <strong>{overview.totalRecommendations}</strong></div>
                <div className="metric">Mappings: <strong>{overview.totalMappings}</strong></div>
            </div>

            <section className="charts">
                <div className="chart-card"><h4>Recommendations over time</h4><Line data={lineData} /></div>
                <div className="chart-card"><h4>Popular Careers</h4><Bar data={barData} /></div>
            </section>

            <section className="activity">
                <h3>Recent System Activities</h3>
                <ul>
                    {(overview.recentActivities || []).map((a, i) => (
                        <li key={i}>{a.timestamp} — {a.message}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default AdminDashboard;
