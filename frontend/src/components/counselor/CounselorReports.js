import React, { useEffect, useState } from "react";
import { reportsAPI, counselorAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const CounselorReports = () => {
    const { user, logout } = useAuth();
    const [popularCareers, setPopularCareers] = useState([]);
    const [studentsSummary, setStudentsSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('students');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // Get counselor profile using user.id
                const profileRes = await counselorAPI.getCounselorByUser(user.id);
                const counselorProfile = profileRes.data;

                // Fetch popular career trends
                const careersRes = await reportsAPI.getPopularCareers();
                setPopularCareers(Object.entries(careersRes.data || {}));

                // Fetch assigned students summary
                const studentsRes = await reportsAPI.getCounselorStudentsSummary(counselorProfile.id);
                setStudentsSummary(studentsRes.data || []);

            } catch (err) {
                console.error("Error loading reports:", err);
                setError('Failed to load report data. Please make sure you are logged in as a counselor.');
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const totalStudents = studentsSummary.length;
    const studentsWithGrade = studentsSummary.filter(s => s.averageGrade !== null);
    const avgGradeAll = studentsWithGrade.length > 0
        ? (studentsWithGrade.reduce((sum, s) => sum + s.averageGrade, 0) / studentsWithGrade.length).toFixed(2)
        : 'N/A';
    const studentsWithCareer = studentsSummary.filter(s => s.recommendedCareer).length;
    const totalCareerMatches = popularCareers.reduce((sum, [, count]) => sum + count, 0);

    const getGradeColor = (grade) => {
        if (grade === null) return '#888';
        if (grade >= 3.5) return '#28a745';
        if (grade >= 2.5) return '#fd7e14';
        return '#dc3545';
    };

    const getGradeBadge = (grade) => {
        if (grade === null) return { label: 'No Data', bg: '#f0f0f0', color: '#888' };
        if (grade >= 3.5) return { label: 'Excellent', bg: '#d4edda', color: '#155724' };
        if (grade >= 2.5) return { label: 'Good', bg: '#fff3cd', color: '#856404' };
        return { label: 'Needs Help', bg: '#f8d7da', color: '#721c24' };
    };

    return (
        <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Header */}
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
                        📊 Reports & Insights
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

                {/* Error */}
                {error && (
                    <div className="alert alert-danger alert-dismissible" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px' }}>
                        <div className="spinner-border text-primary" role="status"></div>
                        <p style={{ marginTop: '16px', color: '#666' }}>Loading reports...</p>
                    </div>
                ) : (
                    <>
                        {/* Stats Row */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-3">
                                <div style={{
                                    background: 'white', borderRadius: '12px', padding: '20px 24px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '4px solid #2d6a9f'
                                }}>
                                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>TOTAL STUDENTS</div>
                                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#1e3a5f' }}>{totalStudents}</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div style={{
                                    background: 'white', borderRadius: '12px', padding: '20px 24px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '4px solid #28a745'
                                }}>
                                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>AVG GRADE</div>
                                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#1e3a5f' }}>{avgGradeAll}</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div style={{
                                    background: 'white', borderRadius: '12px', padding: '20px 24px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '4px solid #fd7e14'
                                }}>
                                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>WITH CAREER MATCH</div>
                                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#1e3a5f' }}>{studentsWithCareer}</div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div style={{
                                    background: 'white', borderRadius: '12px', padding: '20px 24px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '4px solid #6f42c1'
                                }}>
                                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>CAREER PATHS</div>
                                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#1e3a5f' }}>{popularCareers.length}</div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div style={{ marginBottom: '20px' }}>
                            <button
                                onClick={() => setActiveTab('students')}
                                style={{
                                    padding: '10px 24px', marginRight: '8px', borderRadius: '8px',
                                    border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                                    background: activeTab === 'students' ? '#2d6a9f' : 'white',
                                    color: activeTab === 'students' ? 'white' : '#555',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                                }}
                            >
                                🎓 Student Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('careers')}
                                style={{
                                    padding: '10px 24px', borderRadius: '8px',
                                    border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                                    background: activeTab === 'careers' ? '#2d6a9f' : 'white',
                                    color: activeTab === 'careers' ? 'white' : '#555',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                                }}
                            >
                                🔥 Career Trends
                            </button>
                        </div>

                        {/* Students Tab */}
                        {activeTab === 'students' && (
                            <div style={{
                                background: 'white', borderRadius: '12px', padding: '24px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                            }}>
                                <h5 style={{ color: '#1e3a5f', marginBottom: '20px', fontWeight: 700 }}>
                                    🎓 Your Student Overview
                                </h5>
                                {studentsSummary.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '60px' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
                                        <h5 style={{ color: '#444' }}>No students assigned yet</h5>
                                        <p style={{ color: '#888' }}>Student data will appear here once students are assigned to you.</p>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                            <tr style={{ background: '#f7f9fc' }}>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: 600, borderBottom: '2px solid #eee' }}>#</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: 600, borderBottom: '2px solid #eee' }}>STUDENT</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: 600, borderBottom: '2px solid #eee' }}>AVG GRADE</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: 600, borderBottom: '2px solid #eee' }}>TOP SKILLS</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: 600, borderBottom: '2px solid #eee' }}>RECOMMENDED CAREER</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: 600, borderBottom: '2px solid #eee' }}>STATUS</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {studentsSummary.map((s, index) => {
                                                const badge = getGradeBadge(s.averageGrade);
                                                return (
                                                    <tr key={s.studentId} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#888' }}>{index + 1}</td>
                                                        <td style={{ padding: '14px 16px' }}>
                                                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e3a5f' }}>{s.studentName}</div>
                                                        </td>
                                                        <td style={{ padding: '14px 16px' }}>
                                                                <span style={{
                                                                    fontWeight: 700, fontSize: '15px',
                                                                    color: getGradeColor(s.averageGrade)
                                                                }}>
                                                                    {s.averageGrade !== null ? s.averageGrade.toFixed(2) : '—'}
                                                                </span>
                                                        </td>
                                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>
                                                            {s.topSkills || '—'}
                                                        </td>
                                                        <td style={{ padding: '14px 16px' }}>
                                                            {s.recommendedCareer ? (
                                                                <span style={{
                                                                    background: '#e8f4fd', color: '#2d6a9f',
                                                                    padding: '4px 10px', borderRadius: '20px',
                                                                    fontSize: '12px', fontWeight: 600
                                                                }}>
                                                                        {s.recommendedCareer}
                                                                    </span>
                                                            ) : '—'}
                                                        </td>
                                                        <td style={{ padding: '14px 16px' }}>
                                                                <span style={{
                                                                    background: badge.bg, color: badge.color,
                                                                    padding: '4px 10px', borderRadius: '20px',
                                                                    fontSize: '12px', fontWeight: 600
                                                                }}>
                                                                    {badge.label}
                                                                </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Career Trends Tab */}
                        {activeTab === 'careers' && (
                            <div style={{
                                background: 'white', borderRadius: '12px', padding: '24px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                            }}>
                                <h5 style={{ color: '#1e3a5f', marginBottom: '20px', fontWeight: 700 }}>
                                    🔥 Popular Career Trends
                                </h5>
                                {popularCareers.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '60px' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
                                        <h5 style={{ color: '#444' }}>No career data yet</h5>
                                        <p style={{ color: '#888' }}>Career recommendation data will appear here.</p>
                                    </div>
                                ) : (
                                    popularCareers
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([career, count], index) => {
                                            const percentage = totalCareerMatches > 0
                                                ? Math.round((count / totalCareerMatches) * 100) : 0;
                                            const colors = ['#2d6a9f', '#28a745', '#fd7e14', '#6f42c1', '#dc3545', '#20c997'];
                                            const color = colors[index % colors.length];
                                            return (
                                                <div key={career} style={{ marginBottom: '18px' }}>
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
                                                            width: `${percentage}%`, height: '100%',
                                                            background: color, borderRadius: '6px',
                                                            transition: 'width 0.6s ease'
                                                        }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CounselorReports;