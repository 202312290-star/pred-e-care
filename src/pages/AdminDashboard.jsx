import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import Sidebar from './Sidebar';
import * as api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [mapZones, setMapZones] = useState([]);
  const [illnesses, setIllnesses] = useState([]);
  const [alertFunnelData, setAlertFunnelData] = useState([]);
  const [bhwMatrix, setBhwMatrix] = useState([]);
  const [inventoryForecast, setInventoryForecast] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role !== 'admin') {
        navigate('/dashboard');
        return;
      }

      // Fetch dashboard datasets and user list
      const [dashA, dashB, dashC, usersList] = await Promise.all([
        api.getDashboardA(),
        api.getDashboardB(),
        api.getDashboardC(),
        api.getUsers()
      ]);

      setMapZones(dashA.mapZones || []);
      setIllnesses(dashA.illnesses || []);
      setAlertFunnelData(dashB.alertFunnel || []);
      setBhwMatrix(dashB.bhwMatrix || []);
      
      // Map inventory forecast names if needed
      if (dashC && dashC.inventoryForecast) {
        const mappedForecast = dashC.inventoryForecast.map(item => ({
          day: item.day_label,
          supply: parseInt(item.supply, 10),
          projected_demand: parseInt(item.projected_demand, 10)
        }));
        setInventoryForecast(mappedForecast);
      }

      setUsers(usersList || []);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(userId);
        // Refresh list
        const usersList = await api.getUsers();
        setUsers(usersList);
      } catch (err) {
        alert('Failed to delete user: ' + err.message);
      }
    }
  };

  // Determine stockout risk from inventory data
  const getStockoutAnalysis = () => {
    if (inventoryForecast.length === 0) return null;

    let stockoutDay = null;
    let crossoverDay = null;

    for (let i = 0; i < inventoryForecast.length; i++) {
      const item = inventoryForecast[i];
      if (item.supply <= 0 && !stockoutDay) {
        stockoutDay = item.day;
      }
      if (item.projected_demand > item.supply && !crossoverDay) {
        crossoverDay = item.day;
      }
    }

    return { stockoutDay, crossoverDay };
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading Admin Command Center...</p>
          </div>
        </main>
      </div>
    );
  }

  const analysis = getStockoutAnalysis();

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <div className="dash-header">
          <h1>Admin Command Center</h1>
        </div>
        
        {/* DASHBOARD A: Epidemiological & Trend Forecast */}
        <section className="admin-module-section">
          <h2 className="section-title">Epidemiological & Trend Forecast</h2>
          
          <div className="modules-grid-2">
            <div className="module admin-card">
              <h3>Geographical Risk Map</h3>
              <p className="module-text">Barangay density by predicted cases</p>
              
              <div className="admin-risk-grid">
                {mapZones.map((zone) => (
                  <div key={zone.id} className={`admin-zone-box risk-${zone.risk}`}>
                    <span className="zone-name">{zone.name}</span>
                    <span className="zone-cases">{zone.cases} Cases</span>
                    <span className="zone-trend">{zone.trend}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="module admin-card">
              <h3>Top Predicted Illnesses (30 Days)</h3>
              <p className="module-text">Projections based on historical & weather data</p>
              
              <div className="admin-illness-list">
                {illnesses.map((item, i) => (
                  <div key={i} className={`illness-row severity-${item.severity}`}>
                    <div className="illness-details">
                      <h4>{item.disease}</h4>
                      <p>{item.prediction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Operational Flow & BHW Activity Hub */}
        <section className="admin-module-section">
          <h2 className="section-title">Operational Flow</h2>
          
          <div className="modules-grid-2">
            <div className="module admin-card">
              <h3>Alert Status Funnel</h3>
              <p className="module-text">Efficiency of critical alert handling</p>
              
              <div className="admin-chart-wrap-sm">
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={alertFunnelData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#4a3228' }} width={120} />
                    <RechartsTooltip cursor={{fill: '#f5ebe0'}} contentStyle={{ borderRadius: '8px', border: '1px solid #d5c4a1' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="module admin-card">
              <h3>BHW Assignment Matrix</h3>
              <div className="admin-bhw-table-wrap">
                <table className="admin-bhw-table">
                  <thead>
                    <tr>
                      <th>Staff Member</th>
                      <th>Zone</th>
                      <th>Pending Alerts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bhwMatrix.map((bhw) => (
                      <tr key={bhw.id}>
                        <td style={{ fontWeight: '600' }}>{bhw.name}</td>
                        <td style={{ color: '#7a6352' }}>{bhw.zone}</td>
                        <td>
                          <span className={`risk-badge risk-${bhw.status === 'Overloaded' ? 'high' : 'low'}`}>
                            {bhw.alerts} Critical
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Predictive Inventory Optimization */}
        <section className="admin-module-section">
          <h2 className="section-title">Predictive Inventory Optimization</h2>
          
          <div className="module admin-card">
            <h3>Stock Exhaustion Forecast</h3>
            <p className="module-text">Projected essential medicine burn rate vs current supply</p>
            
            <div className="admin-chart-wrap-lg">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={inventoryForecast} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ddd0" />
                  <XAxis dataKey="day" stroke="#8a7360" tick={{ fill: '#8a7360' }} />
                  <YAxis stroke="#8a7360" tick={{ fill: '#8a7360' }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #d5c4a1', borderRadius: '8px', color: '#4a3228' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="supply" 
                    name="Current Supply Level" 
                    stroke="#3d7a45" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projected_demand" 
                    name="Projected Disease Demand" 
                    stroke="#b5493a" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="admin-alert-box">
              {analysis?.stockoutDay ? (
                <span><strong>CRITICAL STOCKOUT RISK:</strong> Inventory projected to hit zero by <strong>{analysis.stockoutDay}</strong>. Crossover point is at <strong>{analysis.crossoverDay}</strong>. Emergency procurement advised immediately.</span>
              ) : (
                <span><strong>STATUS:</strong> Inventory levels within stable forecast.</span>
              )}
            </div>
          </div>
        </section>

        {/* USER MANAGEMENT SECTION */}
        <section className="admin-module-section">
          <h2 className="section-title">User Management</h2>
          <div className="module admin-card" style={{ padding: '2rem' }}>
            <h3>Registered System Users</h3>
            <p className="module-text">Manage barangay workers, nurses, and administrator roles.</p>
            
            <div style={{ border: '1px solid #EADBCE', borderRadius: '8px', overflowX: 'auto', marginTop: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F5EBE1', borderBottom: '1px solid #EADBCE' }}>
                    <th style={{ padding: '1rem', color: '#5A432C', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Full Name</th>
                    <th style={{ padding: '1rem', color: '#5A432C', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Email</th>
                    <th style={{ padding: '1rem', color: '#5A432C', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Role</th>
                    <th style={{ padding: '1rem', color: '#5A432C', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#8a7360' }}>No users found.</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #F5EBE1' }}>
                        <td style={{ padding: '1rem', color: '#4a3228', fontWeight: '600', fontSize: '0.95rem' }}>{u.full_name}</td>
                        <td style={{ padding: '1rem', color: '#7a6352', fontSize: '0.9rem' }}>{u.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            fontWeight: '700', 
                            fontSize: '0.8rem', 
                            color: u.role === 'admin' ? '#8b5e3c' : '#3d7a45', 
                            backgroundColor: u.role === 'admin' ? '#f5ebe0' : '#e2ece9',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'inline-block'
                          }}>
                            {u.role === 'admin' ? 'Admin' : 'BHW'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <button 
                            className="btn btn-danger-outline btn-sm"
                            onClick={() => handleDeleteUser(u.id)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default AdminDashboard;
