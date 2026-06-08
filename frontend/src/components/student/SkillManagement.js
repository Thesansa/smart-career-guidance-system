import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { skillsAPI, studentProfileAPI } from '../../services/api';
import './SkillManagement.css';

const SkillManagement = ({ onSkillsUpdated }) => {
    const { user } = useAuth();

    const [skills, setSkills] = useState([]);
    const [studentProfile, setStudentProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [formData, setFormData] = useState({ skillName: '', score: 50 });
    const [error, setError] = useState('');

    const proficiencyRanges = [
        { min: 0,  max: 25,  label: 'Beginner',    color: '#ff6b6b', description: 'Basic understanding' },
        { min: 26, max: 50,  label: 'Basic',        color: '#ffa726', description: 'Can perform with guidance' },
        { min: 51, max: 75,  label: 'Intermediate', color: '#4fc3f7', description: 'Comfortable and independent' },
        { min: 76, max: 100, label: 'Advanced',     color: '#66bb6a', description: 'Expert level proficiency' }
    ];

    useEffect(() => {
        fetchStudentData();
    }, [user]);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            setError('');
            if (!user?.id) return;
            const profileResponse = await studentProfileAPI.getProfileByUserId(user.id);
            if (profileResponse.data) {
                setStudentProfile(profileResponse.data);
                const skillsResponse = await skillsAPI.getStudentSkills(profileResponse.data.id);
                setSkills(skillsResponse.data || []);
            } else {
                setStudentProfile(null);
            }
        } catch (error) {
            setError('Error loading profile or skills.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!studentProfile) return;

        if (!formData.skillName.trim()) {
            setError('Please enter a skill name.');
            return;
        }

        const skillData = {
            skillName: formData.skillName.trim(),
            score: formData.score,
            student: { id: studentProfile.id },
            assessmentDate: new Date().toISOString().split('T')[0]
        };

        try {
            if (editingSkill) {
                await skillsAPI.updateSkill(editingSkill.id, skillData);
            } else {
                await skillsAPI.addSkill(skillData);
            }
            await fetchStudentData();
            if (onSkillsUpdated) onSkillsUpdated();
            resetForm();
        } catch (error) {
            setError('Error saving skill.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this skill?')) return;
        try {
            await skillsAPI.deleteSkill(id);
            await fetchStudentData();
            if (onSkillsUpdated) onSkillsUpdated();
        } catch {
            setError('Error deleting skill.');
        }
    };

    const handleEdit = (skill) => {
        setEditingSkill(skill);
        setFormData({ skillName: skill.skillName, score: skill.score });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({ skillName: '', score: 50 });
        setEditingSkill(null);
        setShowForm(false);
        setError('');
    };

    const getProficiencyInfo = (score) =>
        proficiencyRanges.find(r => score >= r.min && score <= r.max) || proficiencyRanges[0];

    if (loading) {
        return <div className="skill-management loading"><p>Loading skills...</p></div>;
    }

    return (
        <div className="skill-management">

            <div className="skills-header">
                <h2>🎯 My Skills & Proficiencies</h2>
                {studentProfile && (
                    <button onClick={() => setShowForm(true)} className="sk-btn-add">
                        + Add New Skill
                    </button>
                )}
            </div>

            {error && <div className="sk-error">{error}</div>}

            {showForm && studentProfile && (
                <div className="skill-form-overlay">
                    <div className="skill-form">
                        <div className="form-header">
                            <h3>{editingSkill ? '✏️ Edit Skill' : '➕ Add New Skill'}</h3>
                            <button onClick={resetForm} className="close-btn">&times;</button>
                        </div>

                        {error && <div className="sk-error">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Skill Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., JavaScript, Design, Python"
                                    value={formData.skillName}
                                    onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Proficiency: <strong>{formData.score}%</strong>
                                    <span className="proficiency-tag" style={{ backgroundColor: getProficiencyInfo(formData.score).color }}>
                                        {getProficiencyInfo(formData.score).label}
                                    </span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.score}
                                    onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                                    className="skill-slider"
                                />
                                <div className="slider-labels">
                                    <span>0%</span>
                                    <span>25%</span>
                                    <span>50%</span>
                                    <span>75%</span>
                                    <span>100%</span>
                                </div>
                            </div>

                            <div className="sk-form-actions">
                                <button type="submit" className="sk-btn-save">
                                    {editingSkill ? 'Update Skill' : 'Add Skill'}
                                </button>
                                <button type="button" onClick={resetForm} className="sk-btn-cancel">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {studentProfile && (
                <div className="skills-grid">
                    {skills.length === 0 ? (
                        <div className="no-skills">
                            <p>No skills added yet.</p>
                            <button className="sk-btn-add" onClick={() => setShowForm(true)}>
                                Add Your First Skill
                            </button>
                        </div>
                    ) : (
                        skills.map(skill => {
                            const p = getProficiencyInfo(skill.score);
                            return (
                                <div key={skill.id} className="skill-card">
                                    <div className="skill-card-header">
                                        <h4>{skill.skillName}</h4>
                                        <div className="skill-actions">
                                            <button onClick={() => handleEdit(skill)} className="sk-btn-edit">Edit</button>
                                            <button onClick={() => handleDelete(skill.id)} className="sk-btn-delete">Delete</button>
                                        </div>
                                    </div>

                                    <div className="skill-score-row">
                                        <span className="skill-score">{skill.score}%</span>
                                        <span className="skill-label" style={{ color: p.color, backgroundColor: p.color + '20' }}>
                                            {p.label}
                                        </span>
                                    </div>

                                    <div className="skill-bar-track">
                                        <div
                                            className="skill-bar-fill"
                                            style={{ width: `${skill.score}%`, backgroundColor: p.color }}
                                        />
                                    </div>

                                    <div className="skill-date">
                                        {new Date(skill.assessmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default SkillManagement;