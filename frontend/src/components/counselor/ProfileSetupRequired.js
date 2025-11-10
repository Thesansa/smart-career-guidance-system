import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfileSetupRequired.css';

const ProfileSetupRequired = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="profile-setup-container">
            <div className="profile-setup-card">
                <div className="setup-header">
                    <h2>🎓 Career Guidance System</h2>
                    <h3>Profile Setup Required</h3>
                </div>

                <div className="setup-content">
                    <div className="setup-icon">📝</div>
                    <h4>Welcome, {user?.username}!</h4>
                    <p>Your counselor account is almost ready, but we need some additional information to complete your profile.</p>

                    <div className="setup-info">
                        <p><strong>What you need to do:</strong></p>
                        <ul>
                            <li>✅ Your registration is complete</li>
                            <li>⏳ Contact the system administrator</li>
                            <li>📋 Provide your professional details</li>
                            <li>🚀 Get full access to counselor features</li>
                        </ul>
                    </div>

                    <div className="contact-info">
                        <p><strong>Contact the Administrator:</strong></p>
                        <div className="contact-details">
                            <p>📧 Email: admin@careersystem.com</p>
                            <p>💬 Message: "Hi, I'm {user?.username}. Please complete my counselor profile setup."</p>
                        </div>
                    </div>

                    <div className="current-status">
                        <p><strong>Current Status:</strong> <span className="status-pending">Pending Profile Setup</span></p>
                    </div>
                </div>

                <div className="setup-actions">
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                    <button onClick={() => window.location.reload()} className="btn-refresh">
                        Check Status
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetupRequired;