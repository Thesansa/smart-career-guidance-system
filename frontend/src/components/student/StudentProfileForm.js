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
        fullName: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        phoneNumber: '',
        universityName: ''
    });

    const [genderOpen, setGenderOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGender = (value) => {
        setFormData({ ...formData, gender: value });
        setGenderOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const profileData = { ...formData, userId: currentUser.id };
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
                <p>Fill in your details to get started with your personalised career guidance journey.</p>

                <div className="profile-steps">
                    <div className="step-item active">
                        <div className="step-circle">1</div>
                        <span>Fill in your personal details</span>
                    </div>
                    <div className="step-item">
                        <div className="step-circle">2</div>
                        <span>Add your academic performance</span>
                    </div>
                    <div className="step-item">
                        <div className="step-circle">3</div>
                        <span>Get career recommendations</span>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="profile-right">
                <div className="profile-card">
                    <h2>Student Profile</h2>
                    <h3>Welcome, <strong>{currentUser.username}</strong>! Please complete your profile.</h3>

                    {error && <div className="profile-error">{error}</div>}

                    <form onSubmit={handleSubmit}>

                        {/* Full Name + Gender */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Gender</label>
                                <div className="gender-dropdown">
                                    <button
                                        type="button"
                                        className={`gender-trigger ${genderOpen ? 'open' : ''}`}
                                        onClick={() => setGenderOpen(!genderOpen)}
                                    >
                                        <span>{formData.gender || 'Select Gender'}</span>
                                        <span className="dropdown-arrow">▾</span>
                                    </button>
                                    {genderOpen && (
                                        <div className="gender-menu">
                                            {['Male', 'Female', 'Other'].map((g) => (
                                                <div
                                                    key={g}
                                                    className={`gender-option ${formData.gender === g ? 'selected' : ''}`}
                                                    onClick={() => handleGender(g)}
                                                >
                                                    {g}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Date of Birth */}
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

                        {/* Address */}
                        <div className="form-group">
                            <label>Address</label>
                            <textarea
                                name="address"
                                placeholder="Enter your address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>

                        {/* Phone + University */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="07X-XXX-XXXX"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>University Name</label>
                                <input
                                    type="text"
                                    name="universityName"
                                    placeholder="Enter your university"
                                    value={formData.universityName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Create Profile →'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileForm;