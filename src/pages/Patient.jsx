import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import * as api from '../services/api';
import './Patient.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', age: '', symptoms: '' });
  const [viewPatient, setViewPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const fetchPatients = useCallback(async () => {
    try {
      const data = await api.getPatients();
      setPatients(data);
    } catch (err) {
      console.error('Failed to load patients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const deletePatient = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.deletePatient(id);
        await fetchPatients();
      } catch (err) {
        alert('Failed to delete patient: ' + err.message);
      }
    }
  };

  const startEdit = (patient) => {
    setEditingId(patient.id);
    setEditForm({ name: patient.name, age: patient.age, symptoms: patient.symptoms });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', age: '', symptoms: '' });
  };

  const saveEdit = async (id) => {
    setSavingId(id);
    try {
      await api.updatePatient(id, {
        name: editForm.name,
        age: Number(editForm.age),
        symptoms: editForm.symptoms,
      });
      setEditingId(null);
      await fetchPatients();
    } catch (err) {
      alert('Failed to update patient: ' + err.message);
    } finally {
      setSavingId(null);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page-layout">
        <Sidebar />
        <div className="patients-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading patients…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="patients-container">
        <div className="patients-header">
          <h1>Patients Directory</h1>
          <span className="patient-count">{patients.length} patients</span>
        </div>

        <input
          type="text"
          placeholder="Search by name..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* View Modal */}
        {viewPatient && (
          <div className="modal-overlay" onClick={() => setViewPatient(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h2>{viewPatient.name}</h2>
              <p><strong>Age:</strong> {viewPatient.age}</p>
              <p><strong>Symptoms:</strong> {viewPatient.symptoms}</p>
              <p><strong>Risk Level:</strong> <span className={`risk-${viewPatient.risk.toLowerCase()}`}>{viewPatient.risk}</span></p>
              <button className="btn btn-secondary" onClick={() => setViewPatient(null)}>Close</button>
            </div>
          </div>
        )}

        <div className="table-wrapper">
          <table className="patients-table">
            <thead>
              <tr><th>Name</th><th>Age</th><th>Symptoms</th><th>Risk Level</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => (
                <tr key={patient.id}>
                  {editingId === patient.id ? (
                    <>
                      <td><input className="edit-input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                      <td><input className="edit-input" type="number" value={editForm.age} onChange={e => setEditForm({...editForm, age: e.target.value})} /></td>
                      <td><input className="edit-input" value={editForm.symptoms} onChange={e => setEditForm({...editForm, symptoms: e.target.value})} /></td>
                      <td><span className={`risk-${patient.risk.toLowerCase()}`}>{patient.risk}</span></td>
                      <td className="action-btns">
                        <button className="btn btn-primary btn-sm" onClick={() => saveEdit(patient.id)} disabled={savingId === patient.id}>
                          {savingId === patient.id ? 'Saving…' : 'Save'}
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{patient.name}</td>
                      <td>{patient.age}</td>
                      <td>{patient.symptoms}</td>
                      <td><span className={`risk-badge risk-${patient.risk.toLowerCase()}`}>{patient.risk}</span></td>
                      <td className="action-btns">
                        <button className="btn btn-outline btn-sm" onClick={() => setViewPatient(patient)}>View</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => startEdit(patient)}>Edit</button>
                        <button className="btn btn-danger-outline btn-sm" onClick={() => deletePatient(patient.id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && <p className="empty-msg">No patients found.</p>}
      </div>
    </div>
  );
};

export default Patients;