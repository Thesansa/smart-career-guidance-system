import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error - Backend server may be down');
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email, password) => api.post('/users/login', { email, password }),
    register: (userData) => api.post('/users/add', userData),
};

// User API
export const userAPI = {
    getAllUsers: () => api.get('/users/all'),
    getUserById: (id) => api.get(`/users/${id}`),
    deleteUser: (id) => api.delete(`/users/${id}`),
};

// Student Profile API
export const studentProfileAPI = {
    createProfile: (profile) => api.post('/student-profiles/add', profile),
    getAllProfiles: () => api.get('/student-profiles/all'),
    getProfileById: (id) => api.get(`/student-profiles/${id}`),
    getProfileByUserId: (userId) => api.get(`/student-profiles/user/${userId}`),
    deleteProfile: (id) => api.delete(`/student-profiles/${id}`),
};

// Performance API
// Update your performanceAPI in api.js
// Performance API - FIXED ENDPOINTS
// Add this to your performanceAPI in api.js
export const performanceAPI = {
    // Academic Performance
    getAcademicPerformance: (studentId) => api.get(`/performance/academic/${studentId}`),
    addAcademicPerformance: (academicData) => api.post('/performance/academic/add', academicData),
    addSampleAcademicData: (studentId) => api.post(`/performance/academic/sample/${studentId}`),

    // Skills
    getSkillAssessments: (studentId) => api.get(`/performance/skills/${studentId}`),
    addSkill: (skillData) => api.post('/performance/skills/add', skillData),
    updateSkill: (skillId, skillData) => api.put(`/performance/skills/update/${skillId}`, skillData),
    deleteSkill: (skillId) => api.delete(`/performance/skills/${skillId}`),

    // Performance Summary
    generatePerformanceSummary: (studentId) => api.post(`/performance/summary/${studentId}`),
    getPerformanceSummary: (studentId) => api.get(`/performance/summary/${studentId}`),
};

// Skills Management API - UPDATED FOR PERCENTAGE SYSTEM
export const skillsAPI = {
    getStudentSkills: (studentId) => api.get(`/performance/skills/${studentId}`),
    addSkill: (skillData) => api.post('/performance/skills/add', skillData),
    updateSkill: (skillId, skillData) => api.put(`/performance/skills/update/${skillId}`, skillData),
    deleteSkill: (skillId) => api.delete(`/performance/skills/${skillId}`),
};

// Student - Counselor Mapping API
export const mappingAPI = {
    assignStudent: (studentId, counselorId) => api.post(`/mappings/assign/${studentId}/${counselorId}`),
    addFeedback: (studentId, feedback) =>
        api.post(`/mappings/feedback/${studentId}`, { feedback }),
    getMyStudents: () => api.get('/mappings/my-students'),
    getAllMappings: () => api.get('/mappings/all'),
    removeMapping: (mappingId) => api.delete(`/mappings/remove/${mappingId}`),

    // ✅ Student gets their assigned counselor
    getMyCounselor: () => api.get('/mappings/my-counselor'),
        exportPDF: () => api.get('/mappings/export/pdf', { responseType: 'blob' })

};


// Career Recommendation API
export const careerRecommendationAPI = {
    generateRecommendations: () => api.post('/recommendations/generate'),
    getMyRecommendations: () => api.get('/recommendations/my'),
    getRecommendationsByStudent: (studentId) => api.get(`/recommendations/student/${studentId}`),
    getAllRecommendations: () => api.get('/recommendations/all'),
    getRecommendationBreakdown: () => api.get('/recommendations/breakdown'),
};

// Career Path API
export const careerPathAPI = {
    getAllCareerPaths: () => api.get('/career-paths/all'),
    getCareerPathById: (id) => api.get(`/career-paths/${id}`),
    createCareerPath: (careerPath) => api.post('/career-paths/add', careerPath),
    updateCareerPath: (id, careerPath) => api.put(`/career-paths/update/${id}`, careerPath),
    deleteCareerPath: (id) => api.delete(`/career-paths/delete/${id}`),
};

// Counselor API
export const counselorAPI = {
    getAllCounselors: () => api.get('/counselors/all'),
    getCounselorById: (id) => api.get(`/counselors/${id}`),
    getCounselorByUser: (userId) => api.get(`/counselors/user/${userId}`),
    createCounselor: (counselor) => api.post('/counselors/add', counselor),
    updateCounselor: (id, counselor) => api.put(`/counselors/update/${id}`, counselor),
    deleteCounselor: (id) => api.delete(`/counselors/${id}`),
};



// Reports API
export const reportsAPI = {
    getSystemOverview: () => api.get('/reports/overview'),
    getStudentPerformance: (studentId) => api.get(`/reports/student/${studentId}/performance`),
    getStudentRecommendations: (studentId) => api.get(`/reports/student/${studentId}/recommendations`),
    getPopularCareers: () => api.get('/reports/popular-careers'),
    getCounselorActivity: () => api.get('/reports/counselor-activity'),
    getAverageGradeAllStudents: () => api.get('/reports/average-grade'),
    getStudentSkillProgress: (studentId) => api.get(`/reports/student/${studentId}/skill-progress`),
    getCounselorStudentsSummary: (counselorId) => api.get(`/reports/counselor/${counselorId}/students`),
};

// System Logs API
export const systemLogsAPI = {
    getAllLogs: () => api.get('/logs/all'),
    getLogsByActor: (username) => api.get(`/logs/actor/${username}`),
    clearAllLogs: () => api.delete('/logs/clear'),
    deleteLog: (id) => api.delete(`/logs/${id}`),
};

// Roles API
export const rolesAPI = {
    getAllRoles: () => api.get('/roles/all'),
    getRoleById: (id) => api.get(`/roles/${id}`),
    createRole: (role) => api.post('/roles/add', role),
    deleteRole: (id) => api.delete(`/roles/${id}`),
};

export default api;