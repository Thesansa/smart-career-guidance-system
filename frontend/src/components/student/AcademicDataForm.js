import React, { useState } from 'react';
import { performanceAPI } from '../../services/api';
import './AcademicDataForm.css';

const AcademicDataForm = ({ studentId, onDataAdded, onCancel }) => {
    const [academicRecords, setAcademicRecords] = useState([
        { subject: '', grade: '', year: new Date().getFullYear() }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addRecord = () => {
        setAcademicRecords([
            ...academicRecords,
            { subject: '', grade: '', year: new Date().getFullYear() }
        ]);
    };

    const removeRecord = (index) => {
        if (academicRecords.length > 1) {
            const newRecords = academicRecords.filter((_, i) => i !== index);
            setAcademicRecords(newRecords);
        }
    };

    const updateRecord = (index, field, value) => {
        const newRecords = academicRecords.map((record, i) =>
            i === index ? { ...record, [field]: value } : record
        );
        setAcademicRecords(newRecords);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate records
        const invalidRecords = academicRecords.filter(record =>
            !record.subject.trim() || !record.grade.trim() || !record.year
        );

        if (invalidRecords.length > 0) {
            setError('Please fill in all fields for all records.');
            setLoading(false);
            return;
        }

        try {
            // Add records one by one using the existing endpoint
            const promises = academicRecords.map(record =>
                performanceAPI.addAcademicPerformance({
                    ...record,
                    student: { id: studentId }
                })
            );

            await Promise.all(promises);
            alert('Academic records added successfully!');

            if (onDataAdded) {
                onDataAdded();
            }
        } catch (error) {
            console.error('❌ Error adding academic data:', error);
            setError('Error adding academic data: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const gradeOptions = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];

    return (
        <div className="academic-form-overlay">
            <div className="academic-form">
                <div className="form-header">
                    <h3>📚 Add Academic Records</h3>
                    <button onClick={onCancel} className="close-btn">&times;</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="records-list">
                        {academicRecords.map((record, index) => (
                            <div key={index} className="academic-record-form">
                                <div className="record-header">
                                    <h4>Record #{index + 1}</h4>
                                    {academicRecords.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRecord(index)}
                                            className="btn-remove"
                                        >
                                            🗑️ Remove
                                        </button>
                                    )}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Subject:</label>
                                        <input
                                            type="text"
                                            value={record.subject}
                                            onChange={(e) => updateRecord(index, 'subject', e.target.value)}
                                            placeholder="e.g., Mathematics, Computer Science"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Grade:</label>
                                        <select
                                            value={record.grade}
                                            onChange={(e) => updateRecord(index, 'grade', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Grade</option>
                                            {gradeOptions.map(grade => (
                                                <option key={grade} value={grade}>{grade}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Year:</label>
                                        <input
                                            type="number"
                                            value={record.year}
                                            onChange={(e) => updateRecord(index, 'year', parseInt(e.target.value))}
                                            min="2000"
                                            max="2030"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={addRecord}
                            className="btn-secondary"
                        >
                            ➕ Add Another Record
                        </button>

                        <div className="action-buttons">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                            >
                                {loading ? '💾 Saving...' : '💾 Save Academic Records'}
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="btn-secondary"
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AcademicDataForm;