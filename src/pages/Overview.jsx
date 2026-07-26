import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from './Sidebar';
import * as api from '../services/api';
import './Overview.css';

const Overview = () => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    criticalRisk: 0,
    pendingConsults: 0,
    weeklyTrend: [],
  });
  const [activities, setActivities] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [statsData, activityData] = await Promise.all([
        api.getStats(),
        api.getActivity(),
      ]);
      setStats(statsData);
      setActivities(activityData);
    } catch (err) {
      console.error('Failed to load overview data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await api.exportReport();
    } catch (err) {
      alert('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="page-layout">
        <Sidebar />
        <div className="overview-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading overview…</p>
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
          <h1>System Overview</h1>
          <div className="header-actions">
            <button
              id="btn-refresh-overview"
              className={`btn btn-secondary ${refreshing ? 'btn-loading' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? '↻ Refreshing…' : '↻ Refresh'}
            </button>
            <button
              id="btn-export-overview"
              className="btn btn-primary"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? '↓ Exporting…' : '↓ Export Report'}
            </button>
          </div>
        </div>

        {/* Top Stat Cards */}
        <div className="stats-grid">
          <div className="card" onClick={() => navigate('/patient')} title="View all patients">
            <h3>Total Patients</h3>
            <p className="stat-value">{stats.totalPatients}</p>
            <span className="card-action">View all →</span>
          </div>
          <div className="card card-alert">
            <h3>Critical Risk</h3>
            <p className="stat-value alert">{stats.criticalRisk}</p>
            <span className="card-action">Review cases →</span>
          </div>
          <div className="card" onClick={() => navigate('/dashboard')} title="Go to dashboard">
            <h3>Pending Consults</h3>
            <p className="stat-value">{stats.pendingConsults}</p>
            <span className="card-action">Open dashboard →</span>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="content-grid">
          <div className="section-card">
            <div className="section-header">
              <h2>Weekly Trend</h2>
            </div>
            <div className="chart-container">
              {stats.weeklyTrend && stats.weeklyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.weeklyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8ddd0" />
                    <XAxis dataKey="day" tick={{ fill: '#6b4f3a', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#6b4f3a', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ddd0c0',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                      }}
                    />
                    <Bar dataKey="actions" fill="#8b5e3c" radius={[4, 4, 0, 0]} name="Actions" />
                    <Bar dataKey="patients" fill="#d5c4a1" radius={[4, 4, 0, 0]} name="Patients" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="placeholder-chart">
                  <p>No trend data available yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">
              <h2>Recent Activity</h2>
            </div>
            {activities.length > 0 ? (
              <ul className="activity-list">
                {activities.slice(0, 8).map((a) => (
                  <li key={a.id}>
                    <div className="activity-item">
                      <span className="activity-action">{a.action}:</span>{' '}
                      <strong>{a.detail}</strong>
                      <span className="activity-time">{formatTimestamp(a.timestamp)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-msg">No activity yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;