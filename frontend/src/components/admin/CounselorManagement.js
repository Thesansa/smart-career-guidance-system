import React, { useState, useEffect } from 'react';
import { userAPI, counselorAPI } from '../../services/api';
import './CounselorManagement.css';

const CounselorManagement = () => {
    const [users, setUsers] = useState([]);
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState('');
    const [counselorData, setCounselorData] = useState({
        fullName: '',
        department: '',
        experienceYears: '',
        contactNumber: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log("Fetching data...");

            const [usersResponse, counselorsResponse] = await Promise.all([
                userAPI.getAllUsers(),
                counselorAPI.getAllCounselors()
            ]);

            console.log("All users:", usersResponse.data);
            console.log("All counselors:", counselorsResponse.data);

            // Get all user IDs that already have counselor profiles
            const existingCounselorUserIds = counselorsResponse.data.map(counselor =>
                counselor.user?.id
            ).filter(id => id != null);

            console.log("Existing counselor user IDs:", existingCounselorUserIds);

            // Filter users: show users with COUNSELOR role who DON'T have counselor profiles
            const counselorUsers = usersResponse.data.filter(user => {
                const hasCounselorRole = user.role?.name === 'COUNSELOR';
                const hasNoCounselorProfile = !existingCounselorUserIds.includes(user.id);

                console.log(`User ${user.username}: role=${user.role?.name}, hasProfile=${!hasNoCounselorProfile}`);

                return hasCounselorRole && hasNoCounselorProfile;
            });

            console.log("Available counselor users:", counselorUsers);

            setUsers(counselorUsers);
            setCounselors(counselorsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCounselor = async (e) => {
        e.preventDefault();
        try {
            const counselorProfile = {
                user: { id: parseInt(selectedUser) },
                fullName: counselorData.fullName,
                department: counselorData.department,
                experienceYears: parseInt(counselorData.experienceYears),
                contactNumber: counselorData.contactNumber
            };

            console.log("Creating counselor profile:", counselorProfile);

            await counselorAPI.createCounselor(counselorProfile);
            alert('Counselor profile created successfully!');
            setCounselorData({
                fullName: '',
                department: '',
                experienceYears: '',
                contactNumber: ''
            });
            setSelectedUser('');
            fetchData(); // Refresh the list
        } catch (error) {
            console.error('Error creating counselor:', error);
            alert('Error creating counselor profile: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="counselor-management">
            <h2>Counselor Management</h2>

            {/* Debug Info - You can remove this later */}
            <div style={{background: '#f8f9fa', padding: '10px', marginBottom: '20px', borderRadius: '4px'}}>
                <p><strong>Debug Info:</strong></p>
                <p>Total users with COUNSELOR role: {users.length}</p>
                <p>Total existing counselor profiles: {counselors.length}</p>
            </div>

            {/* Create Counselor Profile Form */}
            <div className="create-counselor-form">
                <h3>Create Counselor Profile</h3>

                {users.length === 0 ? (
                    <div style={{background: '#fff3cd', padding: '15px', borderRadius: '4px', marginBottom: '20px'}}>
                        <p>No available counselor users found.</p>
                        <p>Make sure users register with the COUNSELOR role first.</p>
                    </div>
                ) : null}

                <form onSubmit={handleCreateCounselor}>
                    <div className="form-group">
                        <label>Select Counselor User:</label>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            required
                        >
                            <option value="">Select a user</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.username} ({user.email}) - Role: {user.role?.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Full Name:</label>
                        <input
                            type="text"
                            value={counselorData.fullName}
                            onChange={(e) => setCounselorData({...counselorData, fullName: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Department:</label>
                        <input
                            type="text"
                            value={counselorData.department}
                            onChange={(e) => setCounselorData({...counselorData, department: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Experience Years:</label>
                        <input
                            type="number"
                            value={counselorData.experienceYears}
                            onChange={(e) => setCounselorData({...counselorData, experienceYears: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contact Number:</label>
                        <input
                            type="text"
                            value={counselorData.contactNumber}
                            onChange={(e) => setCounselorData({...counselorData, contactNumber: e.target.value})}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={users.length === 0}
                    >
                        {users.length === 0 ? 'No Users Available' : 'Create Counselor Profile'}
                    </button>
                </form>
            </div>

            {/* Existing Counselors List */}
            <div className="counselors-list">
                <h3>Existing Counselors ({counselors.length})</h3>
                {counselors.length === 0 ? (
                    <p>No counselor profiles found.</p>
                ) : (
                    <div className="counselors-grid">
                        {counselors.map(counselor => (
                            <div key={counselor.id} className="counselor-card">
                                <h4>{counselor.fullName}</h4>
                                <p><strong>Department:</strong> {counselor.department}</p>
                                <p><strong>Experience:</strong> {counselor.experienceYears} years</p>
                                <p><strong>Contact:</strong> {counselor.contactNumber}</p>
                                <p><strong>Username:</strong> {counselor.user?.username || 'N/A'}</p>
                                <p><strong>User ID:</strong> {counselor.user?.id || 'N/A'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CounselorManagement;