import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import * as api from '../services/api';
import './AdminDashboard.css';
import './Overview.css';

const CriticalStockout = () => {
  const navigate = useNavigate();
  const [inventoryForecast, setInventoryForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getDashboardC();
        setInventoryForecast(data.inventoryForecast || []);
      } catch (err) {
        console.error('Failed to load stockout data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Determine stockout risk from inventory data
  const getStockoutAnalysis = () => {
    if (inventoryForecast.length === 0) return null;

    let stockoutDay = null;
    let crossoverDay = null;

    for (let i = 0; i < inventoryForecast.length; i++) {
      const item = inventoryForecast[i];
      if (item.supply <= 0 && !stockoutDay) {
        stockoutDay = item.day_label;
      }
      if (item.projected_demand > item.supply && !crossoverDay) {
        crossoverDay = item.day_label;
      }
    }

    return { stockoutDay, crossoverDay };
  };

  if (loading) {
    return (
      <div className="page-layout">
        <Sidebar />
        <div className="overview-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Analyzing stockout risk…</p>
          </div>
        </div>
      </div>
    );
  }

  const analysis = getStockoutAnalysis();

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="overview-container">
        <div className="overview-header">
          <h1>⚠ Critical Stockout Risk</h1>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/overview')}>
              ← Back to Overview
            </button>
          </div>
        </div>

        {/* Main Alert Banner */}
        <div className="admin-alert-box" style={{ marginBottom: '24px', fontSize: '1rem' }}>
          <strong>CRITICAL STOCKOUT RISK:</strong>
          Inventory projected to hit zero between Day 15 and Day 20 due to expected Dengue spike. Emergency procurement advised immediately.
        </div>

        {/* Risk Detail Cards */}
        <div className="modules-grid-2">
          <div className="module admin-card">
            <h3> Supply Depletion Timeline</h3>
            <div className="admin-illness-list">
              {inventoryForecast.map((item, i) => {
                let severity = 'low';
                if (item.supply <= 0) severity = 'high';
                else if (item.supply < 200) severity = 'medium';

                return (
                  <div key={i} className={`illness-row severity-${severity}`}>
                    <div className="illness-details">
                      <h4>{item.day_label}</h4>
                      <p>Supply: <strong>{item.supply}</strong> units | Projected Demand: <strong>{item.projected_demand}</strong> units</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="module admin-card">
            <h3> Risk Analysis Summary</h3>
            <div className="admin-illness-list">
              <div className="illness-row severity-high">
                <div className="illness-details">
                  <h4>Stockout Point</h4>
                  <p>{analysis?.stockoutDay ? `Supply reaches zero at ${analysis.stockoutDay}` : 'No stockout detected in forecast period'}</p>
                </div>
              </div>
              <div className="illness-row severity-medium">
                <div className="illness-details">
                  <h4>Demand Crossover</h4>
                  <p>{analysis?.crossoverDay ? `Demand exceeds supply at ${analysis.crossoverDay}` : 'Supply remains above demand'}</p>
                </div>
              </div>
              <div className="illness-row severity-high">
                <div className="illness-details">
                  <h4>Primary Cause</h4>
                  <p>Expected Dengue spike in Zone 2 & 4 driving increased medicine demand</p>
                </div>
              </div>
              <div className="illness-row severity-medium">
                <div className="illness-details">
                  <h4>Recommended Action</h4>
                  <p>Initiate emergency procurement. Contact regional health office for supplementary supplies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalStockout;
