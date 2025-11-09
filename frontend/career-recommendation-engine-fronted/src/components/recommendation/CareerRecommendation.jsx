import React from "react";
import "./CareerRecommendation.css";
import bannerIll from "../../assets/banner-ill.png"; // adjust path/name if needed

export default function CareerRecommendation() {
    return (
        <div className="rec-page">
            <header className="rec-hero">
                <h1 className="hero-title">Smart Career Guidance System</h1>
                <p className="hero-sub">Career Recommendation Engine</p>
            </header>

            <section className="rec-content">
                <div className="rec-left">
                    <img src={bannerIll} alt="team meeting" className="rec-illustration" />
                </div>



                <aside className="rec-card">
                    <h2 className="card-title">Career recommendation</h2>
                    <p className="card-sub">Get personalized career recommendations</p>

                    <button className="cta-btn">Generate Recommendations</button>
                </aside>
            </section>
        </div>
    );
}
