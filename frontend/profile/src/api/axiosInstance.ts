import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "/api/student-profiles", // your backend base URL
});

// Attach JWT token automatically
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
