import api from "./api";

export const generateRecommendations = () => api.post("/recommendations/generate");

export const getMyRecommendations = () => api.get("/recommendations/my");

export const getStudentRecommendations = (studentId) =>
    api.get(`/recommendations/student/${studentId}`);

export const getAllRecommendations = () => api.get("/recommendations/all");

// src/services/recommendationService.js
export async function fetchRecommendations() {
    // replace URL with real backend endpoint when available
    const res = await fetch("/api/recommendations");
    if (!res.ok) {
        // throw to show error in UI
        throw new Error("Fetch failed");
    }
    const data = await res.json();
    return data;
}
