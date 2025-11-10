import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    reportsAPI,
    systemLogsAPI,
    userAPI
} from '../../services/api';
import './AdminDashboard.css';
import CounselorManagement from './CounselorManagement';
import StudentCounselorMapping from './StudentCounselorMapping';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [systemOverview, setSystemOverview] = useState({});
    const [logs, setLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [manualLog, setManualLog] = useState({ action: '', details: '' });

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);

            const [overviewResponse, logsResponse, usersResponse] = await Promise.all([
                reportsAPI.getSystemOverview(),
                systemLogsAPI.getAllLogs(),
                userAPI.getAllUsers()
            ]);

            setSystemOverview(overviewResponse.data);
            setLogs(logsResponse.data);
            setUsers(usersResponse.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const createManualLog = async () => {
        if (!manualLog.action.trim()) {
            alert('Please enter an action description');
            return;
        }

        try {
            // Create manual log entry
            const logEntry = {
                action: manualLog.action,
                actor: user.username,
                details: manualLog.details || null,
                timestamp: new Date().toISOString()
            };

            // For now, we'll simulate log creation since we don't have a manual log API endpoint
            // In a real system, you would call: await systemLogsAPI.createManualLog(logEntry);

            alert(`Manual log would be created:\nAction: ${manualLog.action}\nActor: ${user.username}`);

            // Clear the form
            setManualLog({ action: '', details: '' });

            // Refresh to see if any new automatic logs appear
            fetchAdminData();

        } catch (error) {
            console.error('Error creating manual log:', error);
            alert('Error creating manual log');
        }
    };

    if (loading) {
        return <div className="loading">Loading admin dashboard...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome, {user.username}</p>
            </div>

            <div className="dashboard-tabs">
                <button
                    className={activeTab === 'overview' ? 'tab-active' : ''}
                    onClick={() => setActiveTab('overview')}
                >
                    System Overview
                </button>
                <button
                    className={activeTab === 'counselors' ? 'tab-active' : ''}
                    onClick={() => setActiveTab('counselors')}
                >
                    Counselor Management
                </button>
                <button
                    className={activeTab === 'mapping' ? 'tab-active' : ''}
                    onClick={() => setActiveTab('mapping')}
                >
                    Student-Counselor Mapping
                </button>
                <button
                    className={activeTab === 'users' ? 'tab-active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button
                    className={activeTab === 'logs' ? 'tab-active' : ''}
                    onClick={() => setActiveTab('logs')}
                >
                    System Logs
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-tab">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Students</h3>
                                <p className="stat-value">{systemOverview.totalStudents || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Counselors</h3>
                                <p className="stat-value">{systemOverview.totalCounselors || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Recommendations</h3>
                                <p className="stat-value">{systemOverview.totalRecommendations || 0}</p>
                            </div>
                            <div className="stat-card">
                                <h3>System Logs</h3>
                                <p className="stat-value">{systemOverview.totalSystemLogs || 0}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'counselors' && (
                    <div className="counselors-tab">
                        <CounselorManagement />
                    </div>
                )}

                {activeTab === 'mapping' && (
                    <div className="mapping-tab">
                        <StudentCounselorMapping />
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="users-tab">
                        <h3>System Users</h3>
                        <div className="users-table">
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role?.name}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'logs' && (
                    <div className="logs-tab">
                        <div className="logs-header">
                            <h3>System Logs ({logs.length})</h3>
                            <button
                                onClick={() => systemLogsAPI.clearAllLogs().then(fetchAdminData)}
                                className="btn-danger"
                            >
                                Clear All Logs
                            </button>
                        </div>

                        {/* Manual Log Creation */}
                        <div className="manual-log-creation">
                            <h4>Add Manual Log Entry</h4>
                            <div className="manual-log-form">
                                <div className="form-group">
                                    <label>Action Description:</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Performed system maintenance"
                                        value={manualLog.action}
                                        onChange={(e) => setManualLog({...manualLog, action: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Details (Optional):</label>
                                    <textarea
                                        placeholder="Additional details about the action..."
                                        value={manualLog.details}
                                        onChange={(e) => setManualLog({...manualLog, details: e.target.value})}
                                        rows="3"
                                    />
                                </div>
                                <button
                                    onClick={createManualLog}
                                    className="btn-primary"
                                >
                                    Add Log Entry
                                </button>
                            </div>
                        </div>

                        <div className="logs-list">
                            {logs.length === 0 ? (
                                <div className="no-logs">
                                    <p>No system logs found.</p>
                                    <p>Logs will appear here when admins perform actions.</p>
                                </div>
                            ) : (
                                logs.map((log) => (
                                    <div key={log.id} className="log-item">
                                        <div className="log-header">
                                            <span className="log-actor">{log.actor || 'System'}</span>
                                            <span className="log-time">
                                                {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                                            </span>
                                        </div>
                                        <p className="log-action">{log.action || 'System action'}</p>
                                        {log.details && (
                                            <p className="log-details">{log.details}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;