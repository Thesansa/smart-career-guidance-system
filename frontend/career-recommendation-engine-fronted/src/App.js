import React from "react";
import CareerRecommendationDashboard from "./components/CareerRecommendationDashboard";
import "./App.css";

function App() {
    return (
        <div>
            <header className="app-header">
                <h1>Smart Career Guidance System</h1>
                <p>Career Recommendation Engine</p>
            </header>
            <CareerRecommendationDashboard />
        </div>
    );
}

export default App;
