// src/components/reporting/Reporting.jsx
import React from "react";
import "./Reporting.css";

export default function Reporting() {
    return (
        <div className="reporting-page">
            <header className="hero">
                <h1 className="hero-title">Smart Career Guidance — Reporting & Analytics</h1>
                <p className="hero-sub">Insights and dashboards</p>
            </header>

            <div className="rec-wrap">
                <section className="report-card">
                    <h2>Performance Overview</h2>
                    <p className="lead">Real-time analytics and report summary</p>

                    <div className="kpi-row" role="group">
                        <div className="kpi">
                            <div className="kpi-value">1200</div>
                            <div className="kpi-label">Users</div>
                        </div>

                        <div className="kpi">
                            <div className="kpi-value">300</div>
                            <div className="kpi-label">Reports</div>
                        </div>

                        <div className="kpi">
                            <div className="kpi-value">42</div>
                            <div className="kpi-label">Insights</div>
                        </div>
                    </div>

                    <div className="chart-box" aria-hidden>
                        <span>📊 Charts and graphs will display here.</span>
                    </div>
                </section>
            </div>
        </div>
    );
}
