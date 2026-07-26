import React, { useState } from 'react';
import './App.css';

// Import your sub-dashboards (make sure files match these names)
import DashboardA from './DashboardA';
import DashboardB from './DashboardB';
import DashboardC from './DashboardC';
import CriticalStockout from './CriticalStockout';

export default function App() {
  // State tracking which admin view is active
  const [activeTab, setActiveTab] = useState('patients'); // 'patients' is default view

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>

      {/* --- SIDEBAR --- */}
      <aside className="sidebar" style={{ width: '280px', backgroundColor: 'var(--sage)', padding: '2rem', flexShrink: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="barangay-logo-placeholder" style={{ width: '80px', height: '80px', margin: '0 auto', background: '#fff', borderRadius: '50%' }}></div>
          <h2 style={{ color: 'var(--white)', marginTop: '0.5rem' }}>PRED-E-CARE</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            className={`nav-link-btn ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            Base Patient Registry
          </button>

          <button
            className={`nav-link-btn ${activeTab === 'A' ? 'active' : ''}`}
            onClick={() => setActiveTab('A')}
          >
            Epidemiological Forecast
          </button>

          <button
            className={`nav-link-btn ${activeTab === 'B' ? 'active' : ''}`}
            onClick={() => setActiveTab('B')}
          >
            Operational Flow & BHW Hub
          </button>

          <button
            className={`nav-link-btn ${activeTab === 'C' ? 'active' : ''}`}
            onClick={() => setActiveTab('C')}
          >
            Inventory Optimization
          </button>

          <button
            className={`nav-link-btn emergency-trigger-btn ${activeTab === 'E' ? 'active-emergency' : 'pulse-alert'}`}
            onClick={() => setActiveTab('E')}
          >
            Critical Stockout Risk
          </button>
        </nav>
      </aside>

      {/* --- MAIN DISPLAY WORKSPACE --- */}
      <main className="main-content" style={{ flexGrow: 1, padding: '2.5rem', backgroundColor: 'var(--sand)', overflowY: 'auto' }}>

        {/* VIEW 1: BASE PATIENT REGISTRY (The view currently causing the layout breakdown) */}
        {activeTab === 'patients' && (
          <div className="view-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Patient Registry</h2>
              <button className="btn-alert" style={{ background: 'transparent', color: 'var(--clay)', border: '1px solid var(--clay)' }}>Clear All</button>
            </div>

            {/* Input Row Card */}
            <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="text" placeholder="Patient Name" style={{ flex: 2, padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
              <input type="number" placeholder="Age" style={{ flex: 1, padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
              <input type="text" placeholder="Symptoms" style={{ flex: 2, padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
              <button className="btn-primary" style={{ whiteSpace: 'nowrap' }}>+ Add Patient</button>
            </div>

            {/* Main Search Filter */}
            <input
              type="text"
              placeholder="Search patient by name..."
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
            />

            {/* Patient Registry Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Symptoms</th>
                    <th>Risk</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Rodrigo Duterte</td>
                    <td>81</td>
                    <td>Leukemia</td>
                    <td><span className="badge badge-low">Low</span></td>
                    <td><button className="btn-alert" style={{ background: 'transparent', color: '#B91C1C', padding: '0.25rem 0.5rem' }}>Delete</button></td>
                  </tr>
                  <tr>
                    <td>Imee Marcos</td>
                    <td>79</td>
                    <td>Tumor</td>
                    <td><span className="badge badge-low">Low</span></td>
                    <td><button className="btn-alert" style={{ background: 'transparent', color: '#B91C1C', padding: '0.25rem 0.5rem' }}>Delete</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SWAPPED VIEW MODULES */}
        {activeTab === 'A' && <DashboardA />}
        {activeTab === 'B' && <DashboardB />}
        {activeTab === 'C' && <DashboardC />}
        {activeTab === 'E' && <CriticalStockout />}

      </main>
    </div>
  );
}