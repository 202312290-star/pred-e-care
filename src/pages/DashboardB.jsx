import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import Sidebar from './Sidebar';
import * as api from '../services/api';
import './AdminDashboard.css';
import './Overview.css';

const DashboardB = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const [alertFunnel, setAlertFunnel] = useState([]);
  const [bhwMatrix, setBhwMatrix] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [staffName, setStaffName] = useState('');
  const [zone, setZone] = useState('');
  const [alerts, setAlerts] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch alert funnel from original endpoint
      const dashboardData = await api.getDashboardB();
      setAlertFunnel(dashboardData.alertFunnel || []);

      // Fetch bhw assignments from new endpoint
      const response = await fetch('http://localhost/ecare/bhw_handler.php');
      const data = await response.json();
      if (data.status === 'success') {
        setBhwMatrix(data.data);
      }
    } catch (err) {
      console.error('Failed to load Dashboard B data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!staffName.trim() || !zone.trim() || !alerts) {
      alert("Please complete all fields to log an assignment.");
      return;
    }

    const payload = {
      name: staffName.trim(),
      zone: zone.trim(),
      alerts: parseInt(alerts, 10)
    };

    try {
      const response = await fetch('http://localhost/ecare/bhw_handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.status === 'success') {
        setStaffName('');
        setZone('');
        setAlerts('');
        fetchData(); // Refresh history
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Form dispatch failure:", error);
    }
  };

  if (loading) {
    return (
      <div className="page-layout">
        <Sidebar />
        <div className="overview-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading operational data…</p>
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
          <h1>{isAdmin ? "Operational Flow" : "BHW Assignment"}</h1>
          {isAdmin && (
            <div className="header-actions">
              <button className="btn btn-secondary" onClick={() => navigate('/overview')}>
                ← Back to Overview
              </button>
            </div>
          )}
        </div>

        <div className="modules-grid-2">
          <div className="module admin-card">
            <h3>Alert Status Funnel</h3>
            <p className="module-text">Efficiency of critical alert handling</p>
            <div className="admin-chart-wrap-sm">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={alertFunnel} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#4a3228' }} width={120} />
                  <RechartsTooltip cursor={{ fill: '#f5ebe0' }} contentStyle={{ borderRadius: '8px', border: '1px solid #d5c4a1' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="module admin-card">
            <h3>BHW Assignment & History</h3>

            {/* Add BHW Assignment Form */}
            <form onSubmit={handleAddAssignment} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#6b4f3a', marginBottom: '0.25rem', display: 'block' }}>Staff Member</label>
                <input
                  type="text" placeholder="e.g. Maria Santos"
                  value={staffName} onChange={(e) => setStaffName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #d5c4a1', borderRadius: '6px' }}
                />
              </div>
              <div style={{ flex: '1 1 120px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#6b4f3a', marginBottom: '0.25rem', display: 'block' }}>Zone</label>
                <input
                  type="text" placeholder="e.g. Purok 1"
                  value={zone} onChange={(e) => setZone(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #d5c4a1', borderRadius: '6px' }}
                />
              </div>
              <div style={{ flex: '1 1 100px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#6b4f3a', marginBottom: '0.25rem', display: 'block' }}>Pending Alerts</label>
                <input
                  type="number" placeholder="0"
                  value={alerts} onChange={(e) => setAlerts(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid #d5c4a1', borderRadius: '6px' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', height: '40px' }}>
                + Assign
              </button>
            </form>

            <div className="admin-bhw-table-wrap" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              <table className="admin-bhw-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Zone</th>
                    <th>Pending Alerts</th>
                    <th>Logged At</th>
                  </tr>
                </thead>
                <tbody>
                  {bhwMatrix.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1rem', color: '#7a6352' }}>No assignments logged.</td></tr>
                  ) : bhwMatrix.map((bhw) => (
                    <tr key={bhw.id}>
                      <td style={{ fontWeight: '600' }}>{bhw.name}</td>
                      <td style={{ color: '#7a6352' }}>{bhw.zone}</td>
                      <td>
                        <span className={`risk-badge risk-${bhw.status === 'Overloaded' ? 'high' : 'low'}`}>
                          {bhw.alerts} Critical
                        </span>
                      </td>
                      <td style={{ color: '#9A8E8B', fontSize: '0.85rem' }}>
                        {new Date(bhw.logged_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardB;
