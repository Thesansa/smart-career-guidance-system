// src/services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api", // adjust if backend runs on other port
    timeout: 10000,
});

// Attach JWT if present in localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
