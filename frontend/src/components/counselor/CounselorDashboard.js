import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    mappingAPI,
    performanceAPI,
    careerRecommendationAPI,
    counselorAPI,
    userAPI,
    reportsAPI
} from '../../services/api';
import ProfileSetupRequired from './ProfileSetupRequired';
import './CounselorDashboard.css';

const CounselorDashboard = () => {
    const { user } = useAuth();
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentPerformance, setStudentPerformance] = useState(null);
    const [studentRecommendations, setStudentRecommendations] = useState([]);
    const [studentSkillProgress, setStudentSkillProgress] = useState({});
    const [feedback, setFeedback] = useState({});

    const [activeTab, setActiveTab] = useState('students');
    const [searchTerm, setSearchTerm] = useState(""); // ✅ NEW SEARCH STATE

    const [loading, setLoading] = useState(true);
    const [hasProfile, setHasProfile] = useState(false);
    const [profileCheckComplete, setProfileCheckComplete] = useState(false);

    useEffect(() => {
        checkCounselorProfile();
    }, []);

    const checkCounselorProfile = async () => {
        try {
            const usersResponse = await userAPI.getAllUsers();
            const users = usersResponse.data;
            const currentUser = users.find(u => u.username === user.username);

            if (currentUser) {
                try {
                    await counselorAPI.getCounselorByUser(currentUser.id);
                    setHasProfile(true);
                    fetchAssignedStudents();
                } catch (error) {
                    if (error.response?.status === 404) setHasProfile(false);
                }
            } else setHasProfile(false);
        } catch {
            setHasProfile(false);
        } finally {
            setProfileCheckComplete(true);
            setLoading(false);
        }
    };

    const fetchAssignedStudents = async () => {
        try {
            const response = await mappingAPI.getMyStudents();
            setAssignedStudents(response.data);
        } catch (error) {
            console.error('Error fetching assigned students:', error);
        }
    };

    const fetchStudentDetails = async (mapping) => {
        try {
            setSelectedStudent(mapping);

            const performanceResponse = await performanceAPI.getPerformanceSummary(mapping.student.id);
            setStudentPerformance(performanceResponse.data);

            const recommendationsResponse = await careerRecommendationAPI.getRecommendationsByStudent(mapping.student.id);
            setStudentRecommendations(recommendationsResponse.data);

            const skillProgressResponse = await reportsAPI.getStudentSkillProgress(mapping.student.id);
            setStudentSkillProgress(skillProgressResponse.data);

            setActiveTab('student-details');
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    };

    const handleSubmitFeedback = async (studentId) => {
        const text = feedback[studentId]?.trim();
        if (!text) return alert('Please enter feedback');

        try {
            await mappingAPI.addFeedback(studentId, text);
            setFeedback(prev => ({ ...prev, [studentId]: "" }));
            fetchAssignedStudents();
        } catch {
            alert('Error submitting feedback');
        }
    };

    if (loading || !profileCheckComplete) return <div className="loading">Loading your dashboard...</div>;
    if (!hasProfile) return <ProfileSetupRequired />;

    return (
        <div className="counselor-dashboard">
            <div className="dashboard-header">
                <h1>Counselor Dashboard</h1>
                <p>Welcome, {user?.username}</p>
            </div>

            <div className="dashboard-tabs">
                <button className={activeTab === 'students' ? 'tab-active' : ''} onClick={() => setActiveTab('students')}>
                    My Students ({assignedStudents.length})
                </button>
                <button className={activeTab === 'student-details' ? 'tab-active' : ''} disabled={!selectedStudent}>
                    Student Details
                </button>
            </div>

            <div className="tab-content">
                {/* =================== STUDENTS TAB =================== */}
                {activeTab === 'students' && (
                    <div className="students-tab">
                        <h3>My Assigned Students</h3>

                        {/* ✅ SEARCH BAR ADDED */}
                        <input
                            type="text"
                            className="search-input"
                            placeholder="🔍 Search student by name, university or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {assignedStudents.length === 0 ? (
                            <div className="no-students">
                                <p>No students assigned yet.</p>
                            </div>
                        ) : (
                            <div className="students-grid">
                                {assignedStudents
                                    .filter(mapping =>
                                        mapping.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        mapping.student.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        mapping.student.phoneNumber.includes(searchTerm)
                                    )
                                    .map((mapping) => (
                                        <div key={mapping.id} className="student-card">
                                            <div className="student-info">
                                                <h4>{mapping.student.fullName}</h4>
                                                <p><strong>University:</strong> {mapping.student.universityName}</p>
                                                <p><strong>Contact:</strong> {mapping.student.phoneNumber}</p>

                                                {mapping.feedback && (
                                                    <div className="previous-feedback">
                                                        <strong>Your Previous Feedback:</strong>
                                                        <p>"{mapping.feedback}"</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="student-actions">
                                                <button className="btn-primary" onClick={() => fetchStudentDetails(mapping)}>
                                                    View Details
                                                </button>

                                                <textarea
                                                    placeholder="Provide feedback for this student..."
                                                    value={feedback[mapping.student.id] || ""}
                                                    onChange={(e) =>
                                                        setFeedback({
                                                            ...feedback,
                                                            [mapping.student.id]: e.target.value
                                                        })
                                                    }
                                                    rows="3"
                                                />

                                                <button className="btn-secondary" onClick={() => handleSubmitFeedback(mapping.student.id)}>
                                                    Submit Feedback
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {/* =================== STUDENT DETAILS TAB =================== */}
                {activeTab === 'student-details' && selectedStudent && (
                    <div className="student-details-tab">
                        <button className="btn-back" onClick={() => setActiveTab('students')}>← Back</button>
                        <h3>{selectedStudent.student.fullName}</h3>

                        <div className="student-details-grid">

                            <div className="detail-card">
                                <h4>Academic Performance</h4>
                                {studentPerformance ? (
                                    <>
                                        <p><strong>Average Grade:</strong> {studentPerformance.averageGrade?.toFixed(2)}</p>
                                        <p><strong>Top Skills:</strong> {studentPerformance.topSkills}</p>
                                    </>
                                ) : <p>No data yet.</p>}
                            </div>

                            <div className="detail-card">
                                <h4>Career Recommendations</h4>
                                {studentRecommendations.length > 0 ? (
                                    studentRecommendations.map((rec) => (
                                        <div key={rec.id} className="recommendation-item">
                                            <strong>{rec.careerPath.careerName}</strong>
                                            <span className={`match-badge ${rec.matchLevel.toLowerCase()}`}>
                                                {rec.matchLevel} Match
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No recommendations yet.</p>
                                )}
                            </div>

                            <div className="detail-card">
                                <h4>Skill Summary</h4>
                                {Object.keys(studentSkillProgress).length === 0 ? (
                                    <p>No skill data yet.</p>
                                ) : (
                                    <ul>
                                        {Object.entries(studentSkillProgress).map(([skill, records]) => (
                                            <li key={skill}>
                                                <strong>{skill}</strong> — Latest Score: {records[records.length - 1].score}%
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CounselorDashboard;
