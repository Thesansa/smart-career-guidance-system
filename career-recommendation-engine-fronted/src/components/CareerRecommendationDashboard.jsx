import React, { useState, useEffect } from "react";
import {
    generateRecommendations,
    getMyRecommendations,
} from "../services/recommendationService";
import CareerCardList from "./CareerCardList";

const CareerRecommendationDashboard = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const response = await getMyRecommendations();
            setRecommendations(response.data);
        } catch (err) {
            setError("Failed to fetch recommendations");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        try {
            setLoading(true);
            await generateRecommendations();
            await fetchRecommendations();
        } catch (err) {
            setError("Failed to generate recommendations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    return (
        <div className="recommendation-dashboard">
            <h2>Career Recommendation Dashboard</h2>
            <button className="btn" onClick={handleGenerate} disabled={loading}>
                {loading ? "Processing..." : "Generate Recommendations"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <CareerCardList recommendations={recommendations} />
        </div>
    );
};

export default CareerRecommendationDashboard;
