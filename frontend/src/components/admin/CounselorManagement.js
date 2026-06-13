import React, { useState, useEffect } from 'react';
import { userAPI, counselorAPI } from '../../services/api';

const CounselorManagement = () => {
    const [users, setUsers] = useState([]);
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [counselorData, setCounselorData] = useState({
        fullName: '', department: '', experienceYears: '', contactNumber: ''
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, counselorsRes] = await Promise.all([
                userAPI.getAllUsers(),
                counselorAPI.getAllCounselors()
            ]);
            const existingIds = counselorsRes.data.map(c => c.user?.id).filter(id => id != null);
            const available = usersRes.data.filter(u => u.role?.name === 'COUNSELOR' && !existingIds.includes(u.id));
            setUsers(available);
            setCounselors(counselorsRes.data);
        } catch (err) {
            setError('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCounselor = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const profile = {
                user: { id: parseInt(selectedUser) },
                fullName: counselorData.fullName,
                department: counselorData.department,
                experienceYears: parseInt(counselorData.experienceYears),
                contactNumber: counselorData.contactNumber
            };
            await counselorAPI.createCounselor(profile);
            setSuccessMessage('Counselor profile created successfully!');
            setCounselorData({ fullName: '', department: '', experienceYears: '', contactNumber: '' });
            setSelectedUser('');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchData();
        } catch (err) {
            setError('Error creating counselor: ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCounselor = async (id) => {
        if (!window.confirm('Delete this counselor profile?')) return;
        try {
            await counselorAPI.deleteCounselor(id);
            setSuccessMessage('Counselor deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchData();
        } catch (err) {
            setError('Failed to delete counselor.');
        }
    };

    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner-border text-primary" role="status"></div>
            <p style={{ marginTop: '12px', color: '#666' }}>Loading...</p>
        </div>
    );

    return (
        <div>
            <h5 style={{ color: '#1e3a5f', fontWeight: 700, marginBottom: '20px' }}>🧑‍💼 Counselor Management</h5>

            {/* Alerts */}
            {error && (
                <div className="alert alert-danger alert-dismissible" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}
            {successMessage && (
                <div className="alert alert-success alert-dismissible" role="alert">
                    ✅ {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                </div>
            )}

            <div className="row g-4">
                {/* Create Form */}
                <div className="col-md-5">
                    <div style={{
                        background: '#f7f9fc', borderRadius: '12px', padding: '24px',
                        border: '1px solid #e0e7ef'
                    }}>
                        <h6 style={{ color: '#1e3a5f', fontWeight: 700, marginBottom: '16px' }}>
                            ➕ Create Counselor Profile
                        </h6>

                        {users.length === 0 && (
                            <div style={{
                                background: '#fff3cd', borderRadius: '8px', padding: '12px 14px',
                                marginBottom: '16px', fontSize: '13px', color: '#856404'
                            }}>
                                ⚠️ No counselor users available. Users must register with COUNSELOR role first.
                            </div>
                        )}

                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Select Counselor User
                            </label>
                            <select
                                value={selectedUser}
                                onChange={e => setSelectedUser(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '10px 12px', borderRadius: '8px',
                                    border: '1.5px solid #dde3f0', fontSize: '13px', outline: 'none',
                                    background: 'white'
                                }}
                            >
                                <option value="">Select a user...</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                                ))}
                            </select>
                        </div>

                        {[
                            { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'Dr. John Smith' },
                            { label: 'Department', key: 'department', type: 'text', placeholder: 'Computer Science' },
                            { label: 'Experience Years', key: 'experienceYears', type: 'number', placeholder: '5' },
                            { label: 'Contact Number', key: 'contactNumber', type: 'text', placeholder: '+94 77 123 4567' },
                        ].map(field => (
                            <div key={field.key} style={{ marginBottom: '14px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={counselorData[field.key]}
                                    onChange={e => setCounselorData({ ...counselorData, [field.key]: e.target.value })}
                                    required
                                    style={{
                                        width: '100%', padding: '10px 12px', borderRadius: '8px',
                                        border: '1.5px solid #dde3f0', fontSize: '13px', outline: 'none',
                                        background: 'white'
                                    }}
                                />
                            </div>
                        ))}

                        <button
                            onClick={handleCreateCounselor}
                            disabled={submitting || users.length === 0 || !selectedUser}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
                                background: users.length === 0 || !selectedUser ? '#ccc' : 'linear-gradient(135deg, #1e3a5f, #2d6a9f)',
                                color: 'white', fontWeight: 600, fontSize: '14px',
                                cursor: users.length === 0 || !selectedUser ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {submitting ? 'Creating...' : '✅ Create Counselor Profile'}
                        </button>
                    </div>
                </div>

                {/* Existing Counselors */}
                <div className="col-md-7">
                    <h6 style={{ color: '#1e3a5f', fontWeight: 700, marginBottom: '16px' }}>
                        📋 Existing Counselors ({counselors.length})
                    </h6>
                    {counselors.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#888', background: '#f7f9fc', borderRadius: '12px' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🧑‍💼</div>
                            <p>No counselor profiles yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {counselors.map(c => (
                                <div key={c.id} style={{
                                    background: 'white', borderRadius: '10px', padding: '16px',
                                    border: '1px solid #e0e7ef', display: 'flex', alignItems: 'center', gap: '14px'
                                }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                                        background: 'linear-gradient(135deg, #2d6a9f, #1e3a5f)',
                                        color: 'white', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontWeight: 700, fontSize: '16px'
                                    }}>
                                        {getInitials(c.fullName)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e3a5f' }}>{c.fullName}</div>
                                        <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                                            {c.department} · {c.experienceYears} yrs · {c.contactNumber}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#aaa' }}>@{c.user?.username}</div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteCounselor(c.id)}
                                        style={{
                                            background: '#f8d7da', color: '#721c24', border: 'none',
                                            borderRadius: '6px', padding: '6px 12px', fontSize: '12px',
                                            fontWeight: 600, cursor: 'pointer'
                                        }}
                                    >
                                        🗑 Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CounselorManagement;