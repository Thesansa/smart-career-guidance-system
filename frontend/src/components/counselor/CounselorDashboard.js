import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mappingAPI, reportsAPI } from '../../services/api';

const CounselorDashboard = () => {
    const { user, logout } = useAuth();

    const [students, setStudents] = useState([]);
    const [popularCareers, setPopularCareers] = useState({});
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [loadingCareers, setLoadingCareers] = useState(true);
    const [error, setError] = useState('');
    const [feedbackMap, setFeedbackMap] = useState({});
    const [submittingFeedback, setSubmittingFeedback] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState('students');

    useEffect(() => {
        fetchMyStudents();
        fetchPopularCareers();
    }, []);

    const fetchMyStudents = async () => {
        try {
            setLoadingStudents(true);
            const response = await mappingAPI.getMyStudents();
            setStudents(response.data || []);
        } catch (err) {
            setError('Failed to load assigned students.');
        } finally {
            setLoadingStudents(false);
        }
    };

    const fetchPopularCareers = async () => {
        try {
            setLoadingCareers(true);
            const response = await reportsAPI.getPopularCareers();
            setPopularCareers(response.data || {});
        } catch (err) {
            // not critical, just leave empty
        } finally {
            setLoadingCareers(false);
        }
    };

    const handleFeedbackChange = (studentId, value) => {
        setFeedbackMap(prev => ({ ...prev, [studentId]: value }));
    };

    const handleSubmitFeedback = async (studentId) => {
        const feedback = feedbackMap[studentId];
        if (!feedback || feedback.trim() === '') return;

        setSubmittingFeedback(studentId);
        try {
            await mappingAPI.addFeedback(studentId, feedback.trim());
            setSuccessMessage('Feedback submitted successfully!');
            setFeedbackMap(prev => ({ ...prev, [studentId]: '' }));
            fetchMyStudents();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to submit feedback.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSubmittingFeedback(null);
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const popularCareersEntries = Object.entries(popularCareers).sort((a, b) => b[1] - a[1]);
    const totalCareerMatches = popularCareersEntries.reduce((sum, [, count]) => sum + count, 0);

    return (
        <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Top Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
                color: 'white',
                padding: '24px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>
                        👨‍💼 Counselor Dashboard
                    </h2>
                    <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '14px' }}>
                        Welcome back, <strong>{user?.username}</strong>
                    </p>
                </div>
                <button
                    onClick={logout}
                    style={{
                        background: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.4)',
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600
                    }}
                >
                    Logout
                </button>
            </div>

            <div style={{ padding: '28px 32px' }}>

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

                {/* Stats Row */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '20px 24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                            borderLeft: '4px solid #2d6a9f'
                        }}>
                            <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>ASSIGNED STUDENTS</div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: '#1e3a5f' }}>
                                {loadingStudents ? '...' : students.length}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '20px 24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                            borderLeft: '4px solid #28a745'
                        }}>
                            <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>FEEDBACK GIVEN</div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: '#1e3a5f' }}>
                                {loadingStudents ? '...' : students.filter(s => s.feedback).length}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '20px 24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                            borderLeft: '4px solid #fd7e14'
                        }}>
                            <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>PENDING FEEDBACK</div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: '#1e3a5f' }}>
                                {loadingStudents ? '...' : students.filter(s => !s.feedback).length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ marginBottom: '20px' }}>
                    <button
                        onClick={() => setActiveTab('students')}
                        style={{
                            padding: '10px 24px',
                            marginRight: '8px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer',
                            background: activeTab === 'students' ? '#2d6a9f' : 'white',
                            color: activeTab === 'students' ? 'white' : '#555',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                        }}
                    >
                        👥 My Students
                    </button>
                    <button
                        onClick={() => setActiveTab('careers')}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer',
                            background: activeTab === 'careers' ? '#2d6a9f' : 'white',
                            color: activeTab === 'careers' ? 'white' : '#555',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                        }}
                    >
                        📊 Popular Careers
                    </button>
                </div>

                {/* Students Tab */}
                {activeTab === 'students' && (
                    <div>
                        {loadingStudents ? (
                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                <div className="spinner-border text-primary" role="status"></div>
                                <p style={{ marginTop: '12px', color: '#666' }}>Loading students...</p>
                            </div>
                        ) : students.length === 0 ? (
                            <div style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '60px',
                                textAlign: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                            }}>
                                <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
                                <h5 style={{ color: '#444' }}>No students assigned yet</h5>
                                <p style={{ color: '#888' }}>Students will appear here once the admin assigns them to you.</p>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {students.map((mapping) => {
                                    const student = mapping.student || mapping;
                                    const studentName = student?.studentProfile?.fullName || student?.fullName || student?.username || 'Unknown';
                                    const studentId = student?.id || mapping?.id;
                                    const existingFeedback = mapping.feedback || '';
                                    const lastUpdated = mapping.lastUpdated;

                                    return (
                                        <div className="col-md-6" key={studentId}>
                                            <div style={{
                                                background: 'white',
                                                borderRadius: '12px',
                                                padding: '20px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                                height: '100%'
                                            }}>
                                                {/* Student Header */}
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                                    <div style={{
                                                        width: '44px',
                                                        height: '44px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #2d6a9f, #1e3a5f)',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 700,
                                                        fontSize: '16px',
                                                        marginRight: '12px',
                                                        flexShrink: 0
                                                    }}>
                                                        {getInitials(studentName)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e3a5f' }}>
                                                            {studentName}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#888' }}>
                                                            {student?.email || 'No email'}
                                                        </div>
                                                    </div>
                                                    <span style={{
                                                        marginLeft: 'auto',
                                                        padding: '3px 10px',
                                                        borderRadius: '20px',
                                                        fontSize: '11px',
                                                        fontWeight: 600,
                                                        background: existingFeedback ? '#d4edda' : '#fff3cd',
                                                        color: existingFeedback ? '#155724' : '#856404'
                                                    }}>
                                                        {existingFeedback ? '✓ Feedback Given' : '⏳ Pending'}
                                                    </span>
                                                </div>

                                                {/* Existing Feedback */}
                                                {existingFeedback && (
                                                    <div style={{
                                                        background: '#f0f7ff',
                                                        borderRadius: '8px',
                                                        padding: '10px 14px',
                                                        marginBottom: '12px',
                                                        fontSize: '13px',
                                                        color: '#444',
                                                        borderLeft: '3px solid #2d6a9f'
                                                    }}>
                                                        <strong>Previous feedback:</strong> {existingFeedback}
                                                        {lastUpdated && (
                                                            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                                                                Updated: {new Date(lastUpdated).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Feedback Input */}
                                                <textarea
                                                    rows={3}
                                                    placeholder={existingFeedback ? 'Update feedback...' : 'Write feedback for this student...'}
                                                    value={feedbackMap[studentId] || ''}
                                                    onChange={(e) => handleFeedbackChange(studentId, e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '8px',
                                                        padding: '10px',
                                                        fontSize: '13px',
                                                        resize: 'vertical',
                                                        outline: 'none',
                                                        marginBottom: '10px',
                                                        fontFamily: 'inherit'
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleSubmitFeedback(studentId)}
                                                    disabled={submittingFeedback === studentId || !feedbackMap[studentId]?.trim()}
                                                    style={{
                                                        background: feedbackMap[studentId]?.trim() ? '#2d6a9f' : '#ccc',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '8px 20px',
                                                        fontSize: '13px',
                                                        fontWeight: 600,
                                                        cursor: feedbackMap[studentId]?.trim() ? 'pointer' : 'not-allowed',
                                                        width: '100%'
                                                    }}
                                                >
                                                    {submittingFeedback === studentId ? 'Submitting...' : existingFeedback ? '✏️ Update Feedback' : '📝 Submit Feedback'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Popular Careers Tab */}
                {activeTab === 'careers' && (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                    }}>
                        <h5 style={{ color: '#1e3a5f', marginBottom: '20px', fontWeight: 700 }}>
                            📊 Popular Career Paths Among Students
                        </h5>
                        {loadingCareers ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div className="spinner-border text-primary" role="status"></div>
                            </div>
                        ) : popularCareersEntries.length === 0 ? (
                            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
                                No career data available yet.
                            </p>
                        ) : (
                            <div>
                                {popularCareersEntries.map(([career, count], index) => {
                                    const percentage = totalCareerMatches > 0 ? Math.round((count / totalCareerMatches) * 100) : 0;
                                    const colors = ['#2d6a9f', '#28a745', '#fd7e14', '#6f42c1', '#dc3545', '#20c997'];
                                    const color = colors[index % colors.length];
                                    return (
                                        <div key={career} style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <span style={{ fontWeight: 600, fontSize: '14px', color: '#333' }}>
                                                    {index + 1}. {career}
                                                </span>
                                                <span style={{ fontSize: '13px', color: '#666' }}>
                                                    {count} students ({percentage}%)
                                                </span>
                                            </div>
                                            <div style={{ background: '#f0f4f8', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${percentage}%`,
                                                    height: '100%',
                                                    background: color,
                                                    borderRadius: '6px',
                                                    transition: 'width 0.6s ease'
                                                }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CounselorDashboard;