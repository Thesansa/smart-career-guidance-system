import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
    const { user, logout, isAdmin, isStudent, isCounselor } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/dashboard">Career Guidance</Link>
            </div>

            <div className="nav-links">
                {user && (
                    <>
                        {/* Always show Dashboard */}
                        <Link to="/dashboard">Dashboard</Link>

                        {/* Student-specific links */}
                        {isStudent && (
                            <>
                                <Link to="/student/profile">My Profile</Link>
                                <Link to="/student/careers">Career Recommendations</Link>
                            </>
                        )}

                        {/* Counselor-specific links */}
                        {isCounselor && (
                            <>
                                <Link to="/counselor/students">My Students</Link>
                                <Link to="/counselor/reports">Reports</Link>
                            </>
                        )}

                        {/* ✅ ADMIN gets NO extra links now */}
                        {isAdmin && (
                            <></>
                        )}

                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
