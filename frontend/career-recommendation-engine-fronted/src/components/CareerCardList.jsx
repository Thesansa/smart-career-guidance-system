import React from "react";

const CareerCardList = ({ recommendations }) => {
    if (!recommendations.length) {
        return <p>No recommendations yet.</p>;
    }

    return (
        <div className="card-container">
            {recommendations.map((rec, i) => (
                <div key={i} className="career-card">
                    <h3>{rec.careerPath.careerName}</h3>
                    <p><strong>Confidence:</strong> {(rec.confidenceScore * 100).toFixed(0)}%</p>
                    <p><strong>Match Level:</strong> {rec.matchLevel}</p>
                    <p><strong>Required Skills:</strong> {rec.careerPath.requiredSkills.join(", ")}</p>
                </div>
            ))}
        </div>
    );
};

export default CareerCardList;
