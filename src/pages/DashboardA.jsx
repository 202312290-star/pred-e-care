import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import * as api from '../services/api';
import './AdminDashboard.css';
import './Overview.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, activeTab }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isFuture = data.type === 'future';
    
    // Choose appropriate title
    const valueLabel = activeTab === 'total' ? 'Total Patient Count' : activeTab === 'dengue' ? 'Dengue Specific Cases' : 'Influenza Cases';
    const value = isFuture ? data.predicted : data.actual;
    const color = activeTab === 'total' ? '#8b5e3c' : activeTab === 'dengue' ? '#b5493a' : '#3d7a45';

    return (
      <div style={{ background: '#fff', border: '1px solid #ddd0c0', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(92,61,46,0.1)' }}>
        <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#8a7360', letterSpacing: '0.5px' }}>
          {data.label}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></span>
          <span style={{ fontSize: '0.9rem', color: '#4a3228', fontWeight: '600' }}>
            {valueLabel}: <strong>{value} {value === 1 ? 'case' : 'cases'}</strong>
          </span>
        </div>
        <p style={{ margin: '6px 0 0 0', fontSize: '0.72rem', fontStyle: 'italic', color: isFuture ? '#8b5e3c' : '#7a6352', fontWeight: '600' }}>
          {isFuture ? '✨ ML Regression Model projection' : '✓ Verified Database Entry log'}
        </p>
      </div>
    );
  }
  return null;
};

const DashboardA = () => {
  const navigate = useNavigate();
  const [mapZones, setMapZones] = useState([]);
  const [illnesses, setIllnesses] = useState([]);
  const [trendForecast, setTrendForecast] = useState([]);
  const [forecastMetrics, setForecastMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('total');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getDashboardA();
        setMapZones(data.mapZones || []);
        setIllnesses(data.illnesses || []);
        setTrendForecast(data.trendForecast || []);
        setForecastMetrics(data.forecastMetrics || null);
      } catch (err) {
        console.error('Failed to load Dashboard A data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-layout">
        <Sidebar />
        <div className="overview-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading epidemiological data…</p>
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
          <h1>Epidemiological & Trend Forecast</h1>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/overview')}>
              ← Back to Overview
            </button>
          </div>
        </div>

        {/* PREDICTIVE TREND FORECAST CARD */}
        <div className="module admin-card" style={{ marginBottom: '2.5rem', padding: '2rem', background: '#fff', border: '1px solid #ddd0c0', borderRadius: '16px', boxShadow: '0 4px 12px rgba(92,61,46,0.04)' }}>
          {forecastMetrics?.isSimulation && (
            <div style={{ display: 'flex', alignItems: 'center', background: '#fef4e0', border: '1px solid #d5c4a1', borderRadius: '8px', padding: '12px 16px', marginBottom: '1.5rem', color: '#9a6b20', fontSize: '0.88rem' }}>
              <span style={{ fontSize: '1.25rem', marginRight: '10px' }}></span>
              <div>
                <strong>Simulation Mode Active:</strong> No patient records found in the database. The system is displaying a simulated SIR epidemiological outbreak curve. Add patient logs in the registry to activate real-time linear regression forecasting.
              </div>
            </div>
          )}
  
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#4a3228', fontWeight: '800', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#b5493a', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Feature Highlight</span>
                Interactive Predictive Algorithm Visualizer
              </h2>
              <p style={{ color: '#8a7360', fontSize: '0.88rem', margin: 0 }}>
                Visualizing past actual cases, current status, and 4-week future disease trajectory predictions based on database symptom matching.
              </p>
            </div>

            {/* TAB SELECTOR */}
            <div style={{ display: 'flex', background: '#f5ebe0', padding: '4px', borderRadius: '8px', border: '1px solid #e8ddd0' }}>
              <button 
                onClick={() => setActiveTab('total')} 
                style={{ 
                  background: activeTab === 'total' ? '#8b5e3c' : 'transparent', 
                  color: activeTab === 'total' ? '#fff' : '#5c3d2e', 
                  border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' 
                }}
              >
                Total Cases
              </button>
              <button 
                onClick={() => setActiveTab('dengue')} 
                style={{ 
                  background: activeTab === 'dengue' ? '#b5493a' : 'transparent', 
                  color: activeTab === 'dengue' ? '#fff' : '#5c3d2e', 
                  border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' 
                }}
              >
                Dengue Outbreaks
              </button>
              <button 
                onClick={() => setActiveTab('flu')} 
                style={{ 
                  background: activeTab === 'flu' ? '#3d7a45' : 'transparent', 
                  color: activeTab === 'flu' ? '#fff' : '#5c3d2e', 
                  border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' 
                }}
              >
                Influenza Trends
              </button>
            </div>
          </div>

          {/* GRID METRICS BAR */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: '#faf6f0', border: '1px solid #e8ddd0', borderRadius: '12px', padding: '1rem', marginBottom: '2rem' }}>
            <div style={{ borderRight: '1px solid #e8ddd0', paddingRight: '8px' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#8a7360', fontWeight: '700', letterSpacing: '0.5px' }}>Predictive Model</div>
              <div style={{ fontSize: '0.9rem', color: '#4a3228', fontWeight: '700', marginTop: '2px' }}>{forecastMetrics?.algorithm || 'Loading...'}</div>
            </div>
            <div style={{ borderRight: '1px solid #e8ddd0', paddingRight: '8px' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#8a7360', fontWeight: '700', letterSpacing: '0.5px' }}>Model Confidence</div>
              <div style={{ fontSize: '0.9rem', color: '#3d7a45', fontWeight: '700', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#3d7a45', borderRadius: '50%' }}></span>
                {forecastMetrics?.accuracy || 'Loading...'}
              </div>
            </div>
            <div style={{ borderRight: '1px solid #e8ddd0', paddingRight: '8px' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#8a7360', fontWeight: '700', letterSpacing: '0.5px' }}>Disease Trajectory</div>
              <div style={{ fontSize: '0.9rem', color: forecastMetrics?.trendDirection?.includes('Rising') ? '#b5493a' : '#5c3d2e', fontWeight: '700', marginTop: '2px' }}>
                {forecastMetrics?.trendDirection || 'Loading...'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#8a7360', fontWeight: '700', letterSpacing: '0.5px' }}>Forecast Range</div>
              <div style={{ fontSize: '0.9rem', color: '#4a3228', fontWeight: '700', marginTop: '2px' }}>Next 30 Days (4 Weeks)</div>
            </div>
          </div>

          {/* RECHARTS PLOT */}
          <div style={{ width: '100%', height: 320, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendForecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeTab === 'total' ? '#8b5e3c' : activeTab === 'dengue' ? '#b5493a' : '#3d7a45'} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={activeTab === 'total' ? '#8b5e3c' : activeTab === 'dengue' ? '#b5493a' : '#3d7a45'} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c4a882" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#c4a882" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e6da" />
                <XAxis dataKey="label" stroke="#8a7360" fontSize={11} tickLine={false} dy={10} />
                <YAxis stroke="#8a7360" fontSize={11} tickLine={false} dx={-10} allowDecimals={false} />
                <Tooltip content={<CustomTooltip activeTab={activeTab} />} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                
                {/* Reference line for the transition between Present and Future */}
                {trendForecast.find(d => d.type === 'present') && (
                  <ReferenceLine 
                    x={trendForecast.find(d => d.type === 'present').label} 
                    stroke="#8a7360" 
                    strokeWidth={2}
                    strokeDasharray="4 4" 
                    label={{ value: 'Current Week', fill: '#5c3d2e', fontSize: 10, fontWeight: '700', position: 'top', offset: 15 }} 
                  />
                )}

                {/* Actual Historical Path */}
                <Area 
                  type="monotone" 
                  dataKey={activeTab === 'total' ? 'actual' : activeTab === 'dengue' ? 'actualDengue' : 'actualFlu'} 
                  stroke={activeTab === 'total' ? '#8b5e3c' : activeTab === 'dengue' ? '#b5493a' : '#3d7a45'} 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                  name="Recorded Patient Count" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />

                {/* Future Forecast Path */}
                <Area 
                  type="monotone" 
                  dataKey={activeTab === 'total' ? 'predicted' : activeTab === 'dengue' ? 'predictedDengue' : 'predictedFlu'} 
                  stroke={activeTab === 'total' ? '#8b5e3c' : activeTab === 'dengue' ? '#b5493a' : '#3d7a45'} 
                  strokeWidth={3} 
                  strokeDasharray="6 6"
                  fillOpacity={1} 
                  fill="url(#colorPred)" 
                  name="Algorithm Forecast Projection" 
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="modules-grid-2">
          <div className="module admin-card">
            <h3>Geographical Risk Map</h3>
            <p className="module-text">Barangay density by predicted cases</p>
            <div className="admin-risk-grid">
              {mapZones.map((zone) => (
                <div key={zone.id} className={`admin-zone-box risk-${zone.risk}`} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="zone-name">{zone.name}</span>
                  <span className="zone-cases">{zone.cases} Cases</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 'auto', paddingTop: '8px' }}>
                    <span className="zone-trend">{zone.trend}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: zone.top_illness === 'Dengue' || zone.top_illness === 'Typhoid' ? '#b5493a' : '#8b5e3c', background: 'rgba(255,255,255,0.6)', padding: '2px 6px', borderRadius: '4px' }}>
                      Peak: {zone.top_illness}
                    </span>
                  </div>
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

        {/* --- HISTORICAL ZONE TIMELINES --- */}
        <div style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#4a3228', marginBottom: '0.5rem' }}>Purok Historical Timelines</h2>
          <p className="overview-subtitle" style={{ marginBottom: '1.5rem' }}>Past history trends and peak illnesses for each zone based on patient symptom logs.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {mapZones.map((zone) => (
              <div key={`history-${zone.id}`} className="module admin-card" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e8ddd0', borderRadius: '12px' }}>
                <h3 style={{ borderBottom: '2px solid #f5ebe0', paddingBottom: '0.75rem', margin: '0 0 1rem 0', color: '#5c3d2e', display: 'flex', justifyContent: 'space-between' }}>
                  {zone.name}
                  <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#8a7360' }}>{zone.cases} Total</span>
                </h3>

                {zone.history && zone.history.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', paddingBottom: '0.75rem', color: '#7a6352', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>Timeline</th>
                        <th style={{ textAlign: 'left', paddingBottom: '0.75rem', color: '#7a6352', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>Peak Illness</th>
                        <th style={{ textAlign: 'right', paddingBottom: '0.75rem', color: '#7a6352', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>Cases</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zone.history.map((hist, idx) => (
                        <tr key={idx} style={{ borderTop: '1px solid #f5ebe0' }}>
                          <td style={{ padding: '0.75rem 0', color: '#5c3d2e' }}>{hist.timeline}</td>
                          <td style={{ padding: '0.75rem 0', fontWeight: '600', color: hist.peak_illness === 'Dengue' || hist.peak_illness === 'Typhoid' ? '#b5493a' : '#8b5e3c' }}>
                            {hist.peak_illness}
                          </td>
                          <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#5c3d2e', fontWeight: '700' }}>{hist.cases}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                    <p style={{ color: '#b5a18a', fontStyle: 'italic', fontSize: '0.9rem', margin: 0 }}>No historical data logged.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardA;
