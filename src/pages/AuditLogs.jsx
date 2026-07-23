import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import * as api from '../services/api';
import './AdminDashboard.css';
import './Overview.css';

const AuditLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await api.getActivity();
        setLogs(data || []);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="page-layout">
        <Sidebar />
        <div className="overview-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading system audit logs…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="overview-container">
        <div className="overview-header">
          <h1>System Audit Logs</h1>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/overview')}>
              ← Back to Overview
            </button>
          </div>
        </div>

        <p className="overview-subtitle">Comprehensive tracking of system events, security operations, and data modifications.</p>

        <div className="admin-card" style={{ padding: '2rem' }}>
          <div style={{ border: '1px solid #EADBCE', borderRadius: '8px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F5EBE1', borderBottom: '1px solid #EADBCE' }}>
                  <th style={{ padding: '1rem', color: '#5A432C', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Timestamp</th>
                  <th style={{ padding: '1rem', color: '#5A432C', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Action</th>
                  <th style={{ padding: '1rem', color: '#5A432C', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: '2.5rem', textAlign: 'center', color: '#8a7360' }}>
                      No audit logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #F5EBE1' }}>
                      <td style={{ padding: '1rem', color: '#9A8E8B', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem', color: '#4a3228', fontWeight: '600', fontSize: '0.95rem' }}>
                        {log.action}
                      </td>
                      <td style={{ padding: '1rem', color: '#7a6352', fontSize: '0.9rem' }}>
                        {log.detail}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
