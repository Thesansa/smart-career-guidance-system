import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../auth/Auth.css';

const ProfileSetupRequired = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="auth-container">

            {/* LEFT PANEL - same as Login */}
            <div className="auth-left">
                <div className="ring" style={{width:'300px', height:'300px', top:'10%', right:'-80px'}}></div>
                <div className="ring" style={{width:'200px', height:'200px', bottom:'15%', left:'-50px'}}></div>
                <div className="ring" style={{width:'150px', height:'150px', top:'50%', left:'10%'}}></div>
                <div className="brand-icon">🎓</div>
                <h1>Smart Career Guidance System</h1>
                <p>Your personalised platform to discover career paths, connect with counselors, and achieve your goals.</p>
                <div className="auth-features">
                    <div className="feature-item">
                        <span>📝</span>
                        <span>Complete your counselor profile</span>
                    </div>
                    <div className="feature-item">
                        <span>🧑‍💼</span>
                        <span>Get assigned to students</span>
                    </div>
                    <div className="feature-item">
                        <span>📊</span>
                        <span>Access reports and insights</span>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="auth-right">
                <div className="auth-card">
                    <h2>Profile Setup Required ⏳</h2>
                    <h3>Your account needs a few more steps to be fully activated</h3>

                    {/* Welcome */}
                    <div style={{
                        background: '#f0f7ff',
                        borderRadius: '12px',
                        padding: '16px 18px',
                        marginBottom: '20px',
                        borderLeft: '4px solid #2563b0'
                    }}>
                        <p style={{ margin: 0, fontSize: '15px', color: '#1a3c6e', fontWeight: 600 }}>
                            👋 Welcome, {user?.username || 'Counselor'}!
                        </p>
                        <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#555', lineHeight: 1.6 }}>
                            Your counselor account is almost ready. Contact the administrator to complete your profile setup.
                        </p>
                    </div>

                    {/* Steps */}
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '12px' }}>
                            What you need to do:
                        </p>
                        {[
                            { icon: '✅', text: 'Your registration is complete', done: true },
                            { icon: '⏳', text: 'Contact the system administrator', done: false },
                            { icon: '📋', text: 'Provide your professional details', done: false },
                            { icon: '🚀', text: 'Get full access to counselor features', done: false },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 0',
                                borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none',
                                fontSize: '14px',
                                color: item.done ? '#28a745' : '#444',
                                fontWeight: item.done ? 600 : 400
                            }}>
                                <span>{item.icon}</span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Contact */}
                    <div style={{
                        background: '#fff8f0',
                        borderRadius: '12px',
                        padding: '14px 16px',
                        marginBottom: '20px',
                        borderLeft: '4px solid #fd7e14'
                    }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '8px' }}>
                            Contact Administrator:
                        </p>
                        <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#444' }}>
                            📧 admin@careersystem.com
                        </p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#444', lineHeight: 1.5 }}>
                            💬 "Hi, I'm <strong>{user?.username}</strong>. Please complete my counselor profile."
                        </p>
                    </div>

                    {/* Status */}
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <span style={{
                            background: '#fff3cd',
                            color: '#856404',
                            padding: '5px 14px',
                            borderRadius: '20px',
                            fontWeight: 600,
                            fontSize: '13px'
                        }}>
                            ⏳ Pending Profile Setup
                        </span>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                flex: 1,
                                padding: '14px',
                                borderRadius: '12px',
                                border: '1.8px solid #dde3f0',
                                background: 'white',
                                color: '#374151',
                                fontWeight: 600,
                                fontSize: '15px',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary"
                            style={{ flex: 1, marginTop: 0 }}
                        >
                            🔄 Check Status
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfileSetupRequired;