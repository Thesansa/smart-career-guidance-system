import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        roleName: 'STUDENT' // Only store role name here
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Map role names to correct role IDs
        const roleIdMap = {
            'STUDENT': 2,
            'COUNSELOR': 3
        };

        // Create the user data with correct role ID
        const userData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            roleId: roleIdMap[formData.roleName], // This is the key fix!
            roleName: formData.roleName
        };

        console.log("Sending user data:", userData); // Debug log

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
            <div className="auth-card">
                <h2 style={{ fontWeight: "600" }}>Career Guidance System</h2>

                <h3>Register</h3>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Role:</label>
                        <select
                            name="roleName"
                            value={formData.roleName}
                            onChange={handleChange}
                        >
                            <option value="STUDENT">Student</option>
                            <option value="COUNSELOR">Counselor</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;