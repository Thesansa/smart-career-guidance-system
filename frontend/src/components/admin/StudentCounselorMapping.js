import React, { useState, useEffect } from 'react';
import { studentProfileAPI, counselorAPI, mappingAPI } from '../../services/api';

const StudentCounselorMapping = () => {
    const [students, setStudents] = useState([]);
    const [counselors, setCounselors] = useState([]);
    const [existingMappings, setExistingMappings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedCounselor, setSelectedCounselor] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [downloadingPDF, setDownloadingPDF] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [studentsRes, counselorsRes, mappingsRes] = await Promise.all([
                studentProfileAPI.getAllProfiles(),
                counselorAPI.getAllCounselors(),
                mappingAPI.getAllMappings()
            ]);
            setStudents(studentsRes.data || []);
            setCounselors(counselorsRes.data || []);
            setExistingMappings(mappingsRes.data || []);
        } catch (err) {
            setError('Failed to load mapping data.');
        } finally {
            setLoading(false);
        }
    };

    const getUnassignedStudents = () => {
        const assignedIds = existingMappings.map(m => m.student?.id);
        return students.filter(s => !assignedIds.includes(s.id));
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!selectedStudent || !selectedCounselor) {
            setError('Please select both student and counselor.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await mappingAPI.assignStudent(selectedStudent, selectedCounselor);
            setSuccessMessage('Student assigned to counselor successfully!');
            setSelectedStudent('');
            setSelectedCounselor('');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchData();
        } catch (err) {
            setError('Error assigning student: ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoveMapping = async (mappingId) => {
        if (!window.confirm('Are you sure you want to remove this assignment?')) return;
        try {
            await mappingAPI.removeMapping(mappingId);
            setSuccessMessage('Assignment removed successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchData();
        } catch (err) {
            setError('Error removing assignment.');
        }
    };

    const handleDownloadPDF = async () => {
        setDownloadingPDF(true);
        try {
            const response = await mappingAPI.exportPDF();
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'student_counselor_mappings.pdf';
            link.click();
            window.URL.revokeObjectURL(url);
            setSuccessMessage('PDF downloaded successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to download PDF.');
        } finally {
            setDownloadingPDF(false);
        }
    };

    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner-border text-primary" role="status"></div>
            <p style={{ marginTop: '12px', color: '#666' }}>Loading mapping data...</p>
        </div>
    );

    const unassigned = getUnassignedStudents();

    return (
        <div>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h5 style={{ color: '#1e3a5f', fontWeight: 700, margin: 0 }}>🔗 Student-Counselor Mapping</h5>
                <button
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF || existingMappings.length === 0}
                    style={{
                        background: existingMappings.length === 0 ? '#ccc' : 'linear-gradient(135deg, #1e3a5f, #2d6a9f)',
                        color: 'white', border: 'none', borderRadius: '8px',
                        padding: '8px 18px', fontSize: '13px', fontWeight: 600,
                        cursor: existingMappings.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    {downloadingPDF ? '⏳ Downloading...' : '📥 Download PDF'}
                </button>
            </div>

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

            {/* Stats */}
            <div className="row g-3 mb-4">
                {[
                    { label: 'TOTAL STUDENTS', value: students.length, color: '#2d6a9f' },
                    { label: 'UNASSIGNED', value: unassigned.length, color: '#fd7e14' },
                    { label: 'ASSIGNED', value: existingMappings.length, color: '#28a745' },
                    { label: 'COUNSELORS', value: counselors.length, color: '#6f42c1' },
                ].map((stat, i) => (
                    <div className="col-md-3" key={i}>
                        <div style={{
                            background: 'white', borderRadius: '10px', padding: '16px',
                            borderLeft: `4px solid ${stat.color}`, border: '1px solid #e0e7ef',
                            borderLeftWidth: '4px'
                        }}>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{stat.label}</div>
                            <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e3a5f' }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Assignment Form */}
            <div style={{
                background: '#f7f9fc', borderRadius: '12px', padding: '20px',
                border: '1px solid #e0e7ef', marginBottom: '24px'
            }}>
                <h6 style={{ color: '#1e3a5f', fontWeight: 700, marginBottom: '16px' }}>
                    ➕ Assign Student to Counselor
                </h6>

                {unassigned.length === 0 && (
                    <div style={{
                        background: '#d4edda', borderRadius: '8px', padding: '12px 14px',
                        marginBottom: '14px', fontSize: '13px', color: '#155724'
                    }}>
                        ✅ All students are already assigned to counselors!
                    </div>
                )}

                <div className="row g-3">
                    <div className="col-md-5">
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Select Student
                        </label>
                        <select
                            value={selectedStudent}
                            onChange={e => setSelectedStudent(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 12px', borderRadius: '8px',
                                border: '1.5px solid #dde3f0', fontSize: '13px',
                                outline: 'none', background: 'white'
                            }}
                        >
                            <option value="">Select a student...</option>
                            {unassigned.map(s => (
                                <option key={s.id} value={s.id}>{s.fullName} ({s.universityName})</option>
                            ))}
                        </select>
                        <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                            {unassigned.length} unassigned students available
                        </div>
                    </div>

                    <div className="col-md-5">
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Select Counselor
                        </label>
                        <select
                            value={selectedCounselor}
                            onChange={e => setSelectedCounselor(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 12px', borderRadius: '8px',
                                border: '1.5px solid #dde3f0', fontSize: '13px',
                                outline: 'none', background: 'white'
                            }}
                        >
                            <option value="">Select a counselor...</option>
                            {counselors.map(c => (
                                <option key={c.id} value={c.id}>{c.fullName} ({c.department})</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-2" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button
                            onClick={handleAssign}
                            disabled={submitting || !selectedStudent || !selectedCounselor}
                            style={{
                                width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                                background: (!selectedStudent || !selectedCounselor) ? '#ccc' : 'linear-gradient(135deg, #1e3a5f, #2d6a9f)',
                                color: 'white', fontWeight: 600, fontSize: '13px',
                                cursor: (!selectedStudent || !selectedCounselor) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {submitting ? '...' : '✅ Assign'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Current Assignments */}
            <h6 style={{ color: '#1e3a5f', fontWeight: 700, marginBottom: '14px' }}>
                📋 Current Assignments ({existingMappings.length})
            </h6>

            {existingMappings.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '40px', background: '#f7f9fc',
                    borderRadius: '12px', color: '#888'
                }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔗</div>
                    <p>No assignments yet. Assign a student to a counselor above!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {existingMappings.map(mapping => (
                        <div key={mapping.id} style={{
                            background: 'white', borderRadius: '10px', padding: '16px',
                            border: '1px solid #e0e7ef', display: 'flex',
                            alignItems: 'center', gap: '14px'
                        }}>
                            {/* Student */}
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                                background: 'linear-gradient(135deg, #2d6a9f, #1e3a5f)',
                                color: 'white', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontWeight: 700, fontSize: '14px'
                            }}>
                                {getInitials(mapping.student?.fullName)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e3a5f' }}>
                                    {mapping.student?.fullName}
                                </div>
                                <div style={{ fontSize: '12px', color: '#888' }}>
                                    {mapping.student?.universityName}
                                </div>
                            </div>

                            {/* Arrow */}
                            <div style={{ fontSize: '18px', color: '#2d6a9f' }}>→</div>

                            {/* Counselor */}
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                                background: 'linear-gradient(135deg, #28a745, #1e7e34)',
                                color: 'white', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontWeight: 700, fontSize: '14px'
                            }}>
                                {getInitials(mapping.counselor?.fullName)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e3a5f' }}>
                                    {mapping.counselor?.fullName}
                                </div>
                                <div style={{ fontSize: '12px', color: '#888' }}>
                                    {mapping.counselor?.department}
                                </div>
                            </div>

                            {/* Feedback badge */}
                            {mapping.feedback && (
                                <span style={{
                                    background: '#d4edda', color: '#155724', padding: '3px 10px',
                                    borderRadius: '20px', fontSize: '11px', fontWeight: 600, flexShrink: 0
                                }}>
                                    ✓ Feedback
                                </span>
                            )}

                            {/* Remove button */}
                            <button
                                onClick={() => handleRemoveMapping(mapping.id)}
                                style={{
                                    background: '#f8d7da', color: '#721c24', border: 'none',
                                    borderRadius: '6px', padding: '6px 12px', fontSize: '12px',
                                    fontWeight: 600, cursor: 'pointer', flexShrink: 0
                                }}
                            >
                                🗑 Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentCounselorMapping;
