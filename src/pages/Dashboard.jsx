import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import * as api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', zone: 'Purok 1', symptoms: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const showAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const fetchPatients = useCallback(async () => {
    try {
      const data = await api.getPatients();
      setPatients(data);
    } catch (err) {
      showAlert('Failed to load patients: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPatient = async () => {
    if (!form.name || !form.age || !form.symptoms) {
      showAlert('Please fill in all fields.');
      return;
    }
    setSaving(true);
    try {
      await api.addPatient({ name: form.name, age: form.age, zone: form.zone, symptoms: form.symptoms });
      setForm({ name: '', age: '', zone: 'Purok 1', symptoms: '' });
      showAlert('Patient added successfully.');
      await fetchPatients();
    } catch (err) {
      showAlert('Failed to add patient: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Delete this patient record?')) {
      try {
        await api.deletePatient(id);
        showAlert('Patient removed.');
        await fetchPatients();
      } catch (err) {
        showAlert('Failed to delete patient: ' + err.message);
      }
    }
  };

  const handleClearAll = async () => {
    if (patients.length === 0) return;
    if (window.confirm('Clear all patient records?')) {
      try {
        await api.clearAllPatients();
        showAlert('All records cleared.');
        await fetchPatients();
      } catch (err) {
        showAlert('Failed to clear records: ' + err.message);
      }
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const highRiskCount = patients.filter((p) => p.risk === 'High').length;

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading dashboard…</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="dash-header">
          <h1>Patient Registry</h1>
          {isAdmin && (
            <button className="btn btn-danger-outline btn-sm" onClick={handleClearAll} disabled={patients.length === 0}>
              Clear All
            </button>
          )}
        </div>

        {alertMsg && <div className="toast-alert">{alertMsg}</div>}

        <section className="input-group">
          <input type="text" name="name" placeholder="Patient Name" value={form.name} onChange={handleInputChange} disabled={saving} />
          <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleInputChange} disabled={saving} />
          <select name="zone" value={form.zone} onChange={handleInputChange} disabled={saving} className="input-select" style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #EADBCE', backgroundColor: '#FFF' }}>
            <option value="Purok 1">Purok 1</option>
            <option value="Purok 2">Purok 2</option>
            <option value="Purok 3">Purok 3</option>
            <option value="Purok 4">Purok 4</option>
            <option value="Purok 5">Purok 5</option>
            <option value="Purok 6">Purok 6</option>
          </select>
          <input type="text" name="symptoms" placeholder="Symptoms" value={form.symptoms} onChange={handleInputChange} disabled={saving} />
          <button className="btn btn-primary" onClick={handleAddPatient} disabled={saving}>
            {saving ? 'Adding…' : '+ Add Patient'}
          </button>
        </section>

        <input type="text" className="search-bar" placeholder="Search patient by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        <div className="stats-container">
          <div className="stat-chip"><span className="stat-label">Total</span><span className="stat-count">{patients.length}</span></div>
          <div className="stat-chip stat-chip-danger"><span className="stat-label">High Risk</span><span className="stat-count">{highRiskCount}</span></div>
          <div className="stat-chip"><span className="stat-label">Inventory Pred.</span><span className="stat-count">{Math.ceil(patients.length * 1.2)}</span></div>
        </div>

        {filteredPatients.length > 0 && (
          <div className="patient-list-wrapper">
            <table className="patient-table">
              <thead><tr><th>Name</th><th>Age</th><th>Purok</th><th>Symptoms</th><th>Risk</th>{isAdmin && <th>Action</th>}</tr></thead>
              <tbody>
                {filteredPatients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td><td>{p.age}</td><td>{p.zone || 'Purok 1'}</td><td>{p.symptoms}</td>
                    <td><span className={`risk-badge risk-${p.risk.toLowerCase()}`}>{p.risk}</span></td>
                    {isAdmin && <td><button className="btn btn-danger-outline btn-sm" onClick={() => handleDeletePatient(p.id)}>Delete</button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filteredPatients.length === 0 && patients.length > 0 && <p className="empty-msg">No patients match your search.</p>}
        {patients.length === 0 && <p className="empty-msg">No patients yet. Add one above to get started.</p>}

        <div className="modules-grid">
          <div className="module"><h3>Auto Alerts</h3><p className="module-text">{highRiskCount > 0 ? `${highRiskCount} patient(s) flagged as HIGH risk.` : 'No alerts at this time.'}</p></div>
          <div className="module"><h3>Disease Trends</h3><p className="module-text">Trend analysis will appear here.</p></div>
          <div className="module"><h3>Outreach Scheduler</h3><p className="footer-info">Next visit: Barangay Zone 3 - Friday</p>
            <button className="btn btn-outline btn-sm" onClick={() => alert('Scheduling module coming soon!')} style={{ marginTop: '8px' }}>Schedule Visit</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;