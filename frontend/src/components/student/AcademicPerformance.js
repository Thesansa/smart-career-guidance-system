import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { performanceAPI, studentProfileAPI } from '../../services/api';
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
            const profileResponse = await studentProfileAPI.getProfile(user.id);
            setStudentProfile(profileResponse.data);
            const performanceResponse = await performanceAPI.getAcademicPerformance(profileResponse.data.id);
            setAcademicRecords(performanceResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentProfile) return;
        try {
            await performanceAPI.addAcademicPerformance({ ...formData, student: { id: studentProfile.id } });
            await fetchStudentData();
            resetForm();
            alert('Academic record added successfully!');
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || error.message));
        }
    };

    const addSampleData = async () => {
        if (!studentProfile) return;
        if (window.confirm('Add sample academic data for testing?')) {
            try {
                await performanceAPI.addSampleAcademicData(studentProfile.id);
                await fetchStudentData();
                alert('Sample data added!');
            } catch (error) {
                alert('Error: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const resetForm = () => {
        setFormData({ subject: '', grade: '', year: new Date().getFullYear() });
        setShowForm(false);
    };

    const calculateGPA = () => {
        if (academicRecords.length === 0) return '0.00';
        const gradePoints = { 'A+': 4.0, 'A': 3.8, 'B+': 3.5, 'B': 3.0, 'C': 2.5, 'D': 2.0, 'F': 0.0 };
        const total = academicRecords.reduce((sum, r) => sum + (gradePoints[r.grade] || 0), 0);
        return (total / academicRecords.length).toFixed(2);
    };

    const gradeColors = {
        'A+': '#16a34a', 'A': '#22c55e', 'B+': '#2563b0',
        'B': '#3b82f6', 'C': '#f59e0b', 'D': '#f97316', 'F': '#dc2626'
    };

    const gradePoints = {
        'A+': '4.0', 'A': '3.8', 'B+': '3.5',
        'B': '3.0', 'C': '2.5', 'D': '2.0', 'F': '0.0'
    };

    if (loading) return <div className="ap-loading">Loading academic records...</div>;

    return (
        <div className="ap-page">

            <div className="ap-header">
                <div>
                    <h2>📚 Academic Performance</h2>
                    <p>Track your academic records and GPA</p>
                </div>
                <div className="ap-header-actions">
                    <button onClick={() => setShowForm(true)} className="ap-btn-primary">+ Add Record</button>
                    <button onClick={addSampleData} className="ap-btn-secondary">Add Sample Data</button>
                </div>
            </div>

            <div className="ap-summary-row">
                <div className="ap-stat-card">
                    <div className="ap-stat-value">{academicRecords.length}</div>
                    <div className="ap-stat-label">Total Courses</div>
                </div>
                <div className="ap-stat-card">
                    <div className="ap-stat-value">{calculateGPA()}</div>
                    <div className="ap-stat-label">GPA</div>
                </div>
                <div className="ap-stat-card">
                    <div className="ap-stat-value">
                        {academicRecords.filter(r => ['A+', 'A'].includes(r.grade)).length}
                    </div>
                    <div className="ap-stat-label">A Grades</div>
                </div>
                <div className="ap-stat-card">
                    <div className="ap-stat-value">
                        {[...new Set(academicRecords.map(r => r.year))].length}
                    </div>
                    <div className="ap-stat-label">Years</div>
                </div>
            </div>

            {showForm && (
                <div className="ap-overlay">
                    <div className="ap-modal">
                        <div className="ap-modal-header">
                            <h3>Add Academic Record</h3>
                            <button onClick={resetForm} className="ap-close-btn">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="ap-form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="e.g., Mathematics, Computer Science"
                                    required
                                />
                            </div>
                            <div className="ap-form-row">
                                <div className="ap-form-group">
                                    <label>Grade</label>
                                    <select
                                        value={formData.grade}
                                        onChange={(e) => setFormData({...formData, grade: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Grade</option>
                                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div className="ap-form-group">
                                    <label>Year</label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                                        min="2000" max="2030"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="ap-modal-actions">
                                <button type="submit" className="ap-btn-primary">Add Record</button>
                                <button type="button" onClick={resetForm} className="ap-btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="ap-table-card">
                <h3>Course Records ({academicRecords.length})</h3>
                {academicRecords.length === 0 ? (
                    <div className="ap-empty">
                        <div className="ap-empty-icon">📚</div>
                        <h4>No Academic Records Found</h4>
                        <p>Add your academic records to see your performance summary.</p>
                        <div className="ap-empty-actions">
                            <button onClick={() => setShowForm(true)} className="ap-btn-primary">Add Your First Record</button>
                            <button onClick={addSampleData} className="ap-btn-secondary">Add Sample Data</button>
                        </div>
                    </div>
                ) : (
                    <table className="ap-table">
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
                                        <span className="ap-grade-badge" style={{
                                            background: gradeColors[record.grade] + '18',
                                            color: gradeColors[record.grade],
                                            border: `1.5px solid ${gradeColors[record.grade]}40`
                                        }}>
                                            {record.grade}
                                        </span>
                                    </td>
                                    <td>{record.year}</td>
                                    <td>{gradePoints[record.grade] || '0.0'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AcademicPerformance;