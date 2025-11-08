import api from "./api";

export const generateRecommendations = () => api.post("/recommendations/generate");

export const getMyRecommendations = () => api.get("/recommendations/my");

export const getStudentRecommendations = (studentId) =>
    api.get(`/recommendations/student/${studentId}`);

export const getAllRecommendations = () => api.get("/recommendations/all");
