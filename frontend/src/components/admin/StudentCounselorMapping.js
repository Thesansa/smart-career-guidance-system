import React, { useState, useEffect } from 'react';
import { studentProfileAPI, counselorAPI, mappingAPI } from '../../services/api';
import './StudentCounselorMapping.css';

const StudentCounselorMapping = () => {
    const [students, setStudents] = useState([]);
    const [counselors, setCounselors] = useState([]);
    const [existingMappings, setExistingMappings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedCounselor, setSelectedCounselor] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [studentsResponse, counselorsResponse, mappingsResponse] = await Promise.all([
                studentProfileAPI.getAllProfiles(),
                counselorAPI.getAllCounselors(),
                mappingAPI.getAllMappings()
            ]);

            setStudents(studentsResponse.data);
            setCounselors(counselorsResponse.data);
            setExistingMappings(mappingsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignStudent = async (e) => {
        e.preventDefault();
        if (!selectedStudent || !selectedCounselor) {
            alert('Please select both student and counselor');
            return;
        }

        try {
            await mappingAPI.assignStudent(selectedStudent, selectedCounselor);
            alert('Student assigned to counselor successfully!');
            setSelectedStudent('');
            setSelectedCounselor('');
            fetchData();
        } catch (error) {
            console.error('Error assigning student:', error);
            alert('Error assigning student');
        }
    };

    const handleRemoveMapping = async (mappingId) => {
        if (window.confirm('Are you sure you want to remove this assignment?')) {
            try {
                await mappingAPI.removeMapping(mappingId);
                alert('Assignment removed successfully!');
                fetchData();
            } catch (error) {
                console.error('Error removing mapping:', error);
                alert('Error removing assignment');
            }
        }
    };

    // ✅ PDF Download Handler
    const handleDownloadPDF = async () => {
        try {
            const response = await mappingAPI.exportPDF();
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'student_counselor_mappings.pdf';
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("PDF Download Error:", error);
            alert("Failed to download PDF.");
        }
    };

    const getUnassignedStudents = () => {
        const assignedStudentIds = existingMappings.map(mapping => mapping.student?.id);
        return students.filter(student => !assignedStudentIds.includes(student.id));
    };

    if (loading) return <div className="loading">Loading mapping data...</div>;

    return (
        <div className="student-counselor-mapping">
            <h2>Student-Counselor Assignment</h2>

            {/* ✅ PDF Download Button */}
            <button onClick={handleDownloadPDF} className="btn-primary" style={{ marginBottom: '20px' }}>
                📥 Download Mappings PDF
            </button>

            {/* Assignment Form */}
            <div className="assignment-form">
                <h3>Assign Student to Counselor</h3>
                <form onSubmit={handleAssignStudent}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Select Student:</label>
                            <select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                required
                            >
                                <option value="">Select a student</option>
                                {getUnassignedStudents().map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.fullName} ({student.universityName})
                                    </option>
                                ))}
                            </select>
                            <small>
                                {getUnassignedStudents().length} unassigned students available
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Select Counselor:</label>
                            <select
                                value={selectedCounselor}
                                onChange={(e) => setSelectedCounselor(e.target.value)}
                                required
                            >
                                <option value="">Select a counselor</option>
                                {counselors.map(counselor => (
                                    <option key={counselor.id} value={counselor.id}>
                                        {counselor.fullName} ({counselor.department})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={getUnassignedStudents().length === 0 || counselors.length === 0}
                    >
                        Assign Student to Counselor
                    </button>
                </form>
            </div>

            {/* Current Assignments */}
            <div className="current-assignments">
                <h3>Current Assignments ({existingMappings.length})</h3>

                {existingMappings.length === 0 ? (
                    <p>No student-counselor assignments found.</p>
                ) : (
                    <div className="assignments-grid">
                        {existingMappings.map(mapping => (
                            <div key={mapping.id} className="assignment-card">
                                <div className="assignment-info">
                                    <h4>Student: {mapping.student?.fullName}</h4>
                                    <p><strong>University:</strong> {mapping.student?.universityName}</p>
                                    <p><strong>Assigned to:</strong> {mapping.counselor?.fullName}</p>
                                    <p><strong>Department:</strong> {mapping.counselor?.department}</p>

                                    {mapping.feedback && (
                                        <p><strong>Feedback:</strong> {mapping.feedback}</p>
                                    )}
                                </div>

                                <div className="assignment-actions">
                                    <button
                                        onClick={() => handleRemoveMapping(mapping.id)}
                                        className="btn-danger"
                                    >
                                        Remove Assignment
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCounselorMapping;
