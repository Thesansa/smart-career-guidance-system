import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(formData.email, formData.password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">

            <div className="auth-left">
                <div className="ring" style={{width:'300px', height:'300px', top:'10%', right:'-80px'}}></div>
                <div className="ring" style={{width:'200px', height:'200px', bottom:'15%', left:'-50px'}}></div>
                <div className="ring" style={{width:'150px', height:'150px', top:'50%', left:'10%'}}></div>
                <div className="brand-icon">🎓</div>
                <h1>Smart Career Guidance System</h1>
                <p>Your personalised platform to discover career paths, connect with counselors, and achieve your goals.</p>
                <div className="auth-features">
                    <div className="feature-item">
                        <span>📊</span>
                        <span>AI-powered career recommendations</span>
                    </div>
                    <div className="feature-item">
                        <span>🧑‍💼</span>
                        <span>1-on-1 counselor sessions</span>
                    </div>
                    <div className="feature-item">
                        <span>📈</span>
                        <span>Track your academic performance</span>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <h2>Welcome back 👋</h2>
                    <h3>Sign in to your account to continue</h3>

                    {error && <div className="error-message"><strong>Error:</strong> {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/register">Create one here</Link>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Login;