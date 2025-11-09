// src/services/reportingService.js
import api from "./api";

// Admin overview
export const getOverview = () => api.get("/reports/overview");

// Student performance summary
export const getStudentPerformance = (studentId) =>
    api.get(`/reports/student/${encodeURIComponent(studentId)}/performance`);

// Student recommendations report
export const getStudentRecommendations = (studentId) =>
    api.get(`/reports/student/${encodeURIComponent(studentId)}/recommendations`);

// Popular careers
export const getPopularCareers = () => api.get("/reports/popular-careers");

// Counselor activity / assigned students
export const getCounselorActivity = (counselorId) =>
    api.get(`/reports/counselor/${encodeURIComponent(counselorId)}/activity`);

// Average grade etc.
export const getAverageGrade = () => api.get("/reports/average-grade");
