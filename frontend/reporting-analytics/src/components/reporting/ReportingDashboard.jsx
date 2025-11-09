import React, { useEffect, useState } from "react";
import "./ReportingDashboard.css";

export default function ReportingDashboard() {
    const [overview, setOverview] = useState({ users: 1200, reports: 300, insights: 42 });

    return (
        <div className="report-page">
            <header className="hero">
                <h1 className="hero-title">Smart Career Guidance — Reporting & Analytics</h1>
                <p className="hero-sub">Insights and dashboards</p>
            </header>

            <div className="rec-wrap">
                <div className="report-card">
                    <h2>Performance Overview</h2>
                    <p className="muted">Real-time analytics and report summary</p>

                    <div className="kpi-row">
                        <div className="kpi">
                            <div className="kpi-value">{overview.users}</div>
                            <div className="kpi-label">Users</div>
                        </div>
                        <div className="kpi">
                            <div className="kpi-value">{overview.reports}</div>
                            <div className="kpi-label">Reports</div>
                        </div>
                        <div className="kpi">
                            <div className="kpi-value">{overview.insights}</div>
                            <div className="kpi-label">Insights</div>
                            git status

                        </div>
                    </div>

                    <div className="charts-placeholder">
                        <p>📊 Charts and graphs will display here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
