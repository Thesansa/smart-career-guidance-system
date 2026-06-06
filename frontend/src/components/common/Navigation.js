import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
    const { user, logout, isAdmin, isStudent, isCounselor } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Show minimal branding bar on login/register
    if (isAuthPage) {
        return (
            <nav className="navbar">
                <div className="nav-brand">
                     Smart Career Guidance System
                </div>
            </nav>
        );
    }

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/dashboard">🎓 Career Guidance</Link>
            </div>

            <div className="nav-links">
                {user && (
                    <>
                        <Link to="/dashboard">Dashboard</Link>

                        {isStudent && (
                            <>
                                <Link to="/student/profile">My Profile</Link>
                                <Link to="/student/careers">Career Recommendations</Link>
                            </>
                        )}

                        {isCounselor && (
                            <>
                                <Link to="/counselor/students">My Students</Link>
                                <Link to="/counselor/reports">Reports</Link>
                            </>
                        )}

                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation;