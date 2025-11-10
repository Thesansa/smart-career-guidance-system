import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentProfileAPI, userAPI } from '../../services/api';
import './StudentProfileForm.css';

const StudentProfileForm = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        phoneNumber: '',
        universityName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Get the current user's ID
            const usersResponse = await userAPI.getAllUsers();
            const currentUser = usersResponse.data.find(u => u.username === user.username);

            if (!currentUser) {
                throw new Error('User not found');
            }

            // Create the profile with user ID
            const profileData = {
                ...formData,
                user: { id: currentUser.id }
            };

            await studentProfileAPI.createProfile(profileData);

            // Show success message and reload to show dashboard
            alert('Profile created successfully!');
            window.location.reload(); // Reload to show the dashboard

        } catch (error) {
            console.error('Error creating profile:', error);
            setError(error.response?.data?.message || 'Failed to create profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="student-profile-form">
            <div className="profile-form-container">
                <h2>Create Your Student Profile</h2>
                <p>Welcome, {user.username}! Please complete your profile to continue.</p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Gender *</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Date of Birth *</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Address *</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>University Name *</label>
                            <input
                                type="text"
                                name="universityName"
                                value={formData.universityName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating Profile...' : 'Create Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentProfileForm;