import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentDashboard from './components/student/StudentDashboard';
import CounselorDashboard from './components/counselor/CounselorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Navigation from './components/common/Navigation';
import './App.css';
import CounselorReports from "./components/counselor/CounselorReports";


const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated, loading } = useAuth();

    // Show loading while checking authentication
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Check if user exists before accessing properties
    if (!user) {
        console.error('User is null in ProtectedRoute');
        return <Navigate to="/login" />;
    }

    // Check role-based access
    if (requiredRole && user.role !== requiredRole) {
        console.log(`Access denied: User role ${user.role} does not match required role ${requiredRole}`);
        return <Navigate to="/dashboard" />;
    }

    return children;
};

const DashboardRouter = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    if (!user) {
        console.error('User is null in DashboardRouter');
        return <Navigate to="/login" />;
    }

    // Normalize role comparison
    const userRole = user.role?.toUpperCase();

    if (userRole === 'ADMIN') {
        return <AdminDashboard />;
    } else if (userRole === 'COUNSELOR') {
        return <CounselorDashboard />;
    } else if (userRole === 'STUDENT') {
        return <StudentDashboard />;
    } else {
        console.error('Unknown user role:', user.role);
        return <Navigate to="/login" />;
    }
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navigation />
                    <main className="main-content">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <DashboardRouter />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/*"
                                element={
                                    <ProtectedRoute requiredRole="ADMIN">
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/*"
                                element={
                                    <ProtectedRoute requiredRole="STUDENT">
                                        <StudentDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/counselor/*"
                                element={
                                    <ProtectedRoute requiredRole="COUNSELOR">
                                        <CounselorDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/" element={<Navigate to="/dashboard" />} />

                            <Route
                                path="/counselor/reports"
                                element={
                                    <ProtectedRoute requiredRole="COUNSELOR">
                                        <CounselorReports />
                                    </ProtectedRoute>
                                }
                            />

                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;