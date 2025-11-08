import React from "react";
import "./CareerRecommendation.css";
import leftIllustration from "../../assets/left-illustration.png"; // adjust file name if needed

export default function CareerRecommendation() {
    return (
        <div className="rec-page">
            <header className="hero">
                <h1 className="hero-title">Smart Career Guidance System</h1>
                <p className="hero-sub">Career Recommendation Engine</p>
            </header>

            <div className="rec-wrap">
                {/* left illustration (visual only) */}
                <img className="bg-left" src={leftIllustration} alt="left illustration" />

                {/* recommendation card */}
                <div className="rec-card">
                    <h2>Career recommendation</h2>
                    <p className="rec-lead">Get personalized career recommendations</p>
                    <button className="btn-primary">Generate Recommendations</button>
                </div>
            </div>
        </div>
    );
}
