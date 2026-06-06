import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        roleName: 'STUDENT'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const roleIdMap = { 'STUDENT': 2, 'COUNSELOR': 3 };
        const userData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            roleId: roleIdMap[formData.roleName],
            roleName: formData.roleName
        };

        const result = await register(userData);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">

            {/* LEFT — Branding */}
            <div className="auth-left">
                <div className="brand-icon">🎓</div>
                <h1>Join Smart Career Guidance</h1>
                <p>Create your account and start your journey towards a successful career today.</p>
                <div className="auth-features">
                    <div className="feature-item">
                        <span>🎯</span>
                        <span>Personalised career path planning</span>
                    </div>
                    <div className="feature-item">
                        <span>📚</span>
                        <span>Academic performance tracking</span>
                    </div>
                    <div className="feature-item">
                        <span>🤝</span>
                        <span>Connect with expert counselors</span>
                    </div>
                </div>
            </div>

            {/* RIGHT — Form */}
            <div className="auth-right">
                <div className="auth-card">
                    <h2>Create account ✨</h2>
                    <h3>Fill in your details to get started</h3>

                    {error && <div className="error-message"><strong>Error:</strong> {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>I am a</label>
                            <select
                                name="roleName"
                                value={formData.roleName}
                                onChange={handleChange}
                            >
                                <option value="STUDENT">Student</option>
                                <option value="COUNSELOR">Counselor</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account →'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Register;