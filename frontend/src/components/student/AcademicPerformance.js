import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { performanceAPI, studentProfileAPI, userAPI } from '../../services/api';
import './AcademicPerformance.css';

const AcademicPerformance = () => {
    const { user } = useAuth();
    const [academicRecords, setAcademicRecords] = useState([]);
    const [studentProfile, setStudentProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        grade: '',
        year: new Date().getFullYear()
    });

    const grades = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            // Get student profile
            const usersResponse = await userAPI.getAllUsers();
            const currentUser = usersResponse.data.find(u => u.username === user.username);

            if (currentUser) {
                const profileResponse = await studentProfileAPI.getProfileByUserId(currentUser.id);
                if (profileResponse.data) {
                    setStudentProfile(profileResponse.data);
                    // Fetch academic records
                    const academicResponse = await performanceAPI.getAcademicPerformance(profileResponse.data.id);
                    setAcademicRecords(academicResponse.data);
                }
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentProfile) return;

        try {
            const academicData = {
                ...formData,
                student: { id: studentProfile.id }
            };

            await performanceAPI.addAcademicPerformance(academicData);
            await fetchStudentData(); // Refresh data
            resetForm();
            alert('Academic record added successfully!');
        } catch (error) {
            console.error('Error adding academic record:', error);
            alert('Error adding academic record: ' + (error.response?.data?.message || error.message));
        }
    };

    const addSampleData = async () => {
        if (!studentProfile) return;

        if (window.confirm('This will add sample academic data for testing. Continue?')) {
            try {
                await performanceAPI.addSampleAcademicData(studentProfile.id);
                await fetchStudentData();
                alert('Sample academic data added successfully!');
            } catch (error) {
                console.error('Error adding sample data:', error);
                alert('Error adding sample data: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const resetForm = () => {
        setFormData({
            subject: '',
            grade: '',
            year: new Date().getFullYear()
        });
        setShowForm(false);
    };

    const calculateGPA = () => {
        if (academicRecords.length === 0) return 0.0;

        const gradePoints = {
            'A+': 4.0, 'A': 3.8, 'B+': 3.5,
            'B': 3.0, 'C': 2.5, 'D': 2.0, 'F': 0.0
        };

        const total = academicRecords.reduce((sum, record) => {
            return sum + (gradePoints[record.grade] || 0);
        }, 0);

        return (total / academicRecords.length).toFixed(2);
    };

    if (loading) return <div className="loading">Loading academic records...</div>;

    return (
        <div className="academic-performance">
            <div className="academic-header">
                <h2>Academic Performance</h2>
                <div className="header-actions">
                    <button onClick={() => setShowForm(true)} className="btn-primary">
                        + Add Academic Record
                    </button>
                    <button onClick={addSampleData} className="btn-secondary">
                        Add Sample Data
                    </button>
                </div>
            </div>

            {/* Academic Summary */}
            <div className="academic-summary">
                <div className="summary-card">
                    <h3>Academic Summary</h3>
                    <div className="summary-stats">
                        <div className="stat">
                            <span className="stat-value">{academicRecords.length}</span>
                            <span className="stat-label">Courses</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{calculateGPA()}</span>
                            <span className="stat-label">GPA</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">
                                {academicRecords.filter(r => ['A+', 'A'].includes(r.grade)).length}
                            </span>
                            <span className="stat-label">A Grades</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Academic Record Form */}
            {showForm && (
                <div className="academic-form-overlay">
                    <div className="academic-form">
                        <div className="form-header">
                            <h3>Add Academic Record</h3>
                            <button onClick={resetForm} className="close-btn">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Subject:</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="e.g., Mathematics, Computer Science"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Grade:</label>
                                    <select
                                        value={formData.grade}
                                        onChange={(e) => setFormData({...formData, grade: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Grade</option>
                                        {grades.map(grade => (
                                            <option key={grade} value={grade}>{grade}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Year:</label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                                        min="2000"
                                        max="2030"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    Add Record
                                </button>
                                <button type="button" onClick={resetForm} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Academic Records Table */}
            <div className="academic-records">
                <h3>Course Records ({academicRecords.length})</h3>

                {academicRecords.length === 0 ? (
                    <div className="no-records">
                        <div className="no-records-icon">📚</div>
                        <h4>No Academic Records Found</h4>
                        <p>Add your academic records to see your performance summary and get better career recommendations.</p>
                        <p>You can add records manually or use the "Add Sample Data" button for testing.</p>
                        <div className="action-buttons">
                            <button onClick={() => setShowForm(true)} className="btn-primary">
                                Add Your First Record
                            </button>
                            <button onClick={addSampleData} className="btn-secondary">
                                Add Sample Data for Testing
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="records-table">
                        <table>
                            <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Grade</th>
                                <th>Year</th>
                                <th>Grade Points</th>
                            </tr>
                            </thead>
                            <tbody>
                            {academicRecords.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.subject}</td>
                                    <td>
                                            <span className={`grade-badge grade-${record.grade}`}>
                                                {record.grade}
                                            </span>
                                    </td>
                                    <td>{record.year}</td>
                                    <td>
                                        {{
                                            'A+': '4.0', 'A': '3.8', 'B+': '3.5',
                                            'B': '3.0', 'C': '2.5', 'D': '2.0', 'F': '0.0'
                                        }[record.grade] || '0.0'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcademicPerformance;