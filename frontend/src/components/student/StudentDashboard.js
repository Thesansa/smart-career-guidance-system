import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './StudentProfileForm.css';

const mockUser = {
    id: 1,
    username: 'Prarthana',
    email: 'prarthana@gmail.com'
};

const StudentProfileForm = ({ onProfileCreated, user }) => {
    const { user: authUser } = useAuth();
    const currentUser = user || authUser || mockUser;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        address: '',
        city: '',
        country: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGender = (value) => {
        setFormData({ ...formData, gender: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const profileData = {
                ...formData,
                userId: currentUser.id
            };
            console.log('Profile data:', profileData);
            if (onProfileCreated) onProfileCreated(profileData);
        } catch (err) {
            setError('Failed to save profile. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="profile-page">

            {/* LEFT PANEL */}
            <div className="profile-left">
                <div className="profile-brand-icon">🎓</div>
                <h1>Complete Your Profile</h1>
                <p>Help us personalise your career guidance experience</p>

                <div className="profile-steps">
                    <div className="step-item active">
                        <div className="step-circle">1</div>
                        <div className="step-info">
                            <span className="step-title">Personal Info</span>
                            <span className="step-desc">Basic details about you</span>
                        </div>
                    </div>
                    <div className="step-item">
                        <div className="step-circle">2</div>
                        <div className="step-info">
                            <span className="step-title">Academic Data</span>
                            <span className="step-desc">Your education background</span>
                        </div>
                    </div>
                    <div className="step-item">
                        <div className="step-circle">3</div>
                        <div className="step-info">
                            <span className="step-title">Skills</span>
                            <span className="step-desc">Your strengths & abilities</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="profile-right">
                <div className="profile-card">
                    <h2>Personal Information</h2>
                    <h3>Welcome, {currentUser.username}! Let's set up your profile.</h3>

                    {error && <div className="profile-error">{error}</div>}

                    <form onSubmit={handleSubmit}>

                        {/* First & Last Name */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter first name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Date of Birth — text input */}
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input
                                type="text"
                                name="dateOfBirth"
                                placeholder="DD/MM/YYYY"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Gender — clickable buttons */}
                        <div className="form-group">
                            <label>Gender</label>
                            <div className="gender-buttons">
                                {['Male', 'Female', 'Other'].map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        className={`gender-btn ${formData.gender === g ? 'active' : ''}`}
                                        onClick={() => handleGender(g)}
                                    >
                                        {g === 'Male' ? '👨 Male' : g === 'Female' ? '👩 Female' : '🧑 Other'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="+94 77 123 4567"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Address */}
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Enter your address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        {/* City & Country */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Your city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="Your country"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save & Continue →'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileForm;