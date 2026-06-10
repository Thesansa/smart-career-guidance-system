import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const API_BASE = 'http://localhost:8080/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [overview, setOverview] = useState({});
    const [avgGrade, setAvgGrade] = useState(null);
    const [counselorActivity, setCounselorActivity] = useState({});
    const [popularCareers, setPopularCareers] = useState({});
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    useEffect(() => {
        fetchUsers();
        fetchOverview();
        fetchAvgGrade();
        fetchCounselorActivity();
        fetchPopularCareers();
    }, []);

    useEffect(() => {
        if (activeTab === 'logs') fetchLogs();
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/users/all`, { headers: authHeaders });
            if (res.ok) setUsers(await res.json());
        } catch { setError('Failed to load users.'); }
        finally { setLoading(false); }
    };

    const fetchOverview = async () => {
        try {
            const res = await fetch(`${API_BASE}/reports/overview`, { headers: authHeaders });
            if (res.ok) setOverview(await res.json());
        } catch {}
    };

    const fetchAvgGrade = async () => {
        try {
            const res = await fetch(`${API_BASE}/reports/average-grade`, { headers: authHeaders });
            if (res.ok) setAvgGrade(await res.json());
        } catch {}
    };

    const fetchCounselorActivity = async () => {
        try {
            const res = await fetch(`${API_BASE}/reports/counselor-activity`, { headers: authHeaders });
            if (res.ok) setCounselorActivity(await res.json());
        } catch {}
    };

    const fetchPopularCareers = async () => {
        try {
            const res = await fetch(`${API_BASE}/reports/popular-careers`, { headers: authHeaders });
            if (res.ok) setPopularCareers(await res.json());
        } catch {}
    };

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/logs/all`, { headers: authHeaders });
            if (res.ok) setLogs(await res.json());
            else setError('Failed to load logs.');
        } catch { setError('Error loading logs.'); }
        finally { setLoading(false); }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', headers: authHeaders });
            if (res.ok) { setMessage('User deleted.'); fetchUsers(); }
            else setError('Failed to delete user.');
        } catch { setError('Error deleting user.'); }
    };

    const deleteLog = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/logs/${id}`, { method: 'DELETE', headers: authHeaders });
            if (res.ok) { setMessage('Log deleted.'); fetchLogs(); }
            else setError('Failed to delete log.');
        } catch { setError('Error deleting log.'); }
    };

    const clearLogs = async () => {
        if (!window.confirm('Clear ALL system logs?')) return;
        try {
            const res = await fetch(`${API_BASE}/logs/clear`, { method: 'DELETE', headers: authHeaders });
            if (res.ok) { setMessage('All logs cleared.'); setLogs([]); }
            else setError('Failed to clear logs.');
        } catch { setError('Error clearing logs.'); }
    };

    const students = users.filter(u => u.role?.name === 'STUDENT');
    const counselors = users.filter(u => u.role?.name === 'COUNSELOR');
    const admins = users.filter(u => u.role?.name === 'ADMIN');

    const getRoleBadgeClass = (role) => {
        switch (role?.toUpperCase()) {
            case 'ADMIN': return 'badge-admin';
            case 'COUNSELOR': return 'badge-counselor';
            case 'STUDENT': return 'badge-student';
            default: return 'badge-default';
        }
    };

    const tabs = [
        { key: 'overview', label: '📊 Overview' },
        { key: 'users', label: '👥 Users' },
        { key: 'students', label: '🎓 Students' },
        { key: 'counselors', label: '🧑‍💼 Counselors' },
        { key: 'reports', label: '📈 Reports' },
        { key: 'logs', label: '🗂️ System Logs' },
    ];

    return (
        <div className="admin-dashboard">

            {/* Header */}
            <div className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Full control over users, reports, and system activity</p>
                </div>
                <span className="admin-badge">🔐 Administrator</span>
            </div>

            {/* Alerts */}
            {message && (
                <div className="alert alert-success">
                    {message}
                    <button onClick={() => setMessage('')}>×</button>
                </div>
            )}
            {error && (
                <div className="alert alert-error">
                    {error}
                    <button onClick={() => setError('')}>×</button>
                </div>
            )}

            {/* Stat Cards */}
            <div className="stats-grid">
                <div className="stat-card total">
                    <div className="stat-icon">👥</div>
                    <div><h3>{users.length}</h3><p>Total Users</p></div>
                </div>
                <div className="stat-card students">
                    <div className="stat-icon">🎓</div>
                    <div><h3>{students.length}</h3><p>Students</p></div>
                </div>
                <div className="stat-card counselors">
                    <div className="stat-icon">🧑‍💼</div>
                    <div><h3>{counselors.length}</h3><p>Counselors</p></div>
                </div>
                <div className="stat-card grade">
                    <div className="stat-icon">📝</div>
                    <div>
                        <h3>{avgGrade !== null ? Number(avgGrade).toFixed(2) : '—'}</h3>
                        <p>Avg Grade</p>
                    </div>
                </div>
                <div className="stat-card logs-stat">
                    <div className="stat-icon">🗂️</div>
                    <div>
                        <h3>{overview.totalLogs ?? logs.length}</h3>
                        <p>System Logs</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tab-bar">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'overview' && (
                <div className="tab-content">
                    <div className="two-col">
                        {/* Popular Careers */}
                        <div className="info-card">
                            <div className="info-card-header">
                                <h2>🏆 Popular Careers</h2>
                            </div>
                            {Object.keys(popularCareers).length === 0 ? (
                                <div className="empty-state">No career data yet.</div>
                            ) : (
                                <ul className="career-list">
                                    {Object.entries(popularCareers)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([career, count]) => (
                                            <li key={career}>
                                                <span className="career-name">{career}</span>
                                                <span className="career-count">{count}</span>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>

                        {/* Counselor Activity */}
                        <div className="info-card">
                            <div className="info-card-header">
                                <h2>🧑‍💼 Counselor Activity</h2>
                            </div>
                            {Object.keys(counselorActivity).length === 0 ? (
                                <div className="empty-state">No activity data yet.</div>
                            ) : (
                                <ul className="career-list">
                                    {Object.entries(counselorActivity).map(([name, count]) => (
                                        <li key={name}>
                                            <span className="career-name">{name}</span>
                                            <span className="career-count">{count} students</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── USERS / STUDENTS / COUNSELORS TABS ── */}
            {['users', 'students', 'counselors'].includes(activeTab) && (
                <div className="tab-content">
                    <div className="table-card">
                        <div className="table-header">
                            <h2>
                                {activeTab === 'users' && `All Users (${users.length})`}
                                {activeTab === 'students' && `Students (${students.length})`}
                                {activeTab === 'counselors' && `Counselors (${counselors.length})`}
                            </h2>
                        </div>
                        {loading ? (
                            <div className="loading-state">Loading...</div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(activeTab === 'users' ? users
                                        : activeTab === 'students' ? students
                                            : counselors
                                ).map(u => (
                                    <tr key={u.id}>
                                        <td className="muted">#{u.id}</td>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar">{u.username?.[0]?.toUpperCase()}</div>
                                                {u.username}
                                            </div>
                                        </td>
                                        <td>{u.email}</td>
                                        <td>
                                                <span className={`role-badge ${getRoleBadgeClass(u.role?.name)}`}>
                                                    {u.role?.name || 'N/A'}
                                                </span>
                                        </td>
                                        <td>
                                            <button className="btn-danger-sm" onClick={() => deleteUser(u.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                        {!loading && users.length === 0 && (
                            <div className="empty-state">No users found.</div>
                        )}
                    </div>
                </div>
            )}

            {/* ── REPORTS TAB ── */}
            {activeTab === 'reports' && (
                <div className="tab-content">
                    <div className="two-col">
                        <div className="info-card">
                            <div className="info-card-header"><h2>📊 System Overview</h2></div>
                            {Object.keys(overview).length === 0 ? (
                                <div className="empty-state">No overview data.</div>
                            ) : (
                                <ul className="overview-list">
                                    {Object.entries(overview).map(([key, val]) => (
                                        <li key={key}>
                                            <span className="ov-key">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="ov-val">{String(val)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="info-card">
                            <div className="info-card-header"><h2>📝 Average Grade</h2></div>
                            <div className="big-number-card">
                                <div className="big-number">
                                    {avgGrade !== null ? Number(avgGrade).toFixed(2) : '—'}
                                </div>
                                <p>Average grade across all students</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── LOGS TAB ── */}
            {activeTab === 'logs' && (
                <div className="tab-content">
                    <div className="table-card">
                        <div className="table-header">
                            <h2>System Logs ({logs.length})</h2>
                            {logs.length > 0 && (
                                <button className="btn-danger" onClick={clearLogs}>
                                    🗑️ Clear All Logs
                                </button>
                            )}
                        </div>
                        {loading ? (
                            <div className="loading-state">Loading logs...</div>
                        ) : logs.length === 0 ? (
                            <div className="empty-state">No system logs found.</div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Action</th>
                                    <th>Actor</th>
                                    <th>Timestamp</th>
                                    <th>Delete</th>
                                </tr>
                                </thead>
                                <tbody>
                                {logs.map(log => (
                                    <tr key={log.id}>
                                        <td className="muted">#{log.id}</td>
                                        <td>{log.action || log.message || '—'}</td>
                                        <td>
                                            <span className="actor-tag">{log.actor || log.username || '—'}</span>
                                        </td>
                                        <td className="muted">
                                            {log.timestamp
                                                ? new Date(log.timestamp).toLocaleString()
                                                : log.createdAt
                                                    ? new Date(log.createdAt).toLocaleString()
                                                    : '—'}
                                        </td>
                                        <td>
                                            <button className="btn-danger-sm" onClick={() => deleteLog(log.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;