import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import Sidebar from './Sidebar';
import * as api from '../services/api';

export default function DashboardC() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const [chartData, setChartData] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [medName, setMedName] = useState('');
  const [qty, setQty] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [loading, setLoading] = useState(true);

  // Targets inventory.php endpoint file directly
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch forecast data from database if admin
      if (isAdmin) {
        const forecastResponse = await api.getDashboardC();
        if (forecastResponse && forecastResponse.inventoryForecast) {
          const mappedForecast = forecastResponse.inventoryForecast.map(item => ({
            name: item.day_label,
            currentSupply: parseInt(item.supply, 10),
            projectedDemand: parseInt(item.projected_demand, 10)
          }));
          setChartData(mappedForecast);
        }
      }

      const response = await fetch('http://localhost/ecare/inventory.php');
      const data = await response.json();
      if (data.status === 'success') {
        setInventory(data.data);
      }
    } catch (error) {
      console.error("Database connectivity broken:", error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!medName.trim() || !qty || !dateAdded) {
      alert("Please complete all input fields.");
      return;
    }

    const payload = {
      medicine_name: medName.trim(),
      quantity_added: parseInt(qty, 10),
      date_received: dateAdded
    };

    try {
      const response = await fetch('http://localhost/ecare/inventory.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === 'success') {
        setMedName('');
        setQty('');
        setDateAdded('');
        fetchInventory();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Transmission breakdown:", error);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#FDF8F2', fontFamily: 'system-ui, -apple-system, sans-serif', boxSizing: 'border-box' }}>

      <Sidebar />

      {/* RIGHT MAIN WORKSPACE PANELS */}
      <div style={{ flex: 1, padding: '2.5rem', overflowX: 'hidden', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#3A2813', fontWeight: '800', margin: 0 }}>
            {isAdmin ? "Predictive Inventory Optimization" : "Supply Registry"}
          </h2>
          {isAdmin && <button style={{ background: '#EADBCE', color: '#5A432C', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>← Back to Overview</button>}
        </div>

        {/* CHART ROW (Admin Only) */}
        {isAdmin && (
          <div style={{ background: '#FFF', borderRadius: '12px', border: '1px solid #EADBCE', padding: '1.75rem', marginBottom: '2.5rem' }}>
            <h3 style={{ margin: '0 0 0.25rem 0', color: '#3A2813', fontSize: '1.15rem' }}>Stock Exhaustion Forecast</h3>
            <p style={{ color: '#9A8E8B', fontSize: '0.85rem', margin: '0 0 2rem 0' }}>Projected essential medicine burn rate vs current supply</p>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2ECE4" />
                  <XAxis dataKey="name" stroke="#9A8E8B" dy={10} />
                  <YAxis stroke="#9A8E8B" dx={-10} />
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                  <Line type="monotone" dataKey="currentSupply" stroke="#5B6E5B" strokeWidth={3} name="Current Supply Level" />
                  <Line type="monotone" dataKey="projectedDemand" stroke="#A07660" strokeDasharray="5 5" strokeWidth={3} name="Projected Disease Demand" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ENTRY REGISTRY ROW */}
        <div style={{ background: '#FFF', borderRadius: '12px', border: '1px solid #EADBCE', padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1.75rem 0', color: '#3A2813', fontSize: '1.2rem' }}>Supply Stock Entry Registry</h3>

          <form onSubmit={handleAddMedicine} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div style={{ flex: '1 1 250px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: '#5A432C' }}>Medicine / Variant Designation</label>
              <input type="text" placeholder="e.g., Cetirizine 10mg tab" value={medName} onChange={(e) => setMedName(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #EADBCE', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: '#5A432C' }}>Batch Qty Received</label>
              <input type="number" placeholder="e.g., 250" value={qty} onChange={(e) => setQty(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #EADBCE', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: '#5A432C' }}>Date Logged</label>
              <input type="date" value={dateAdded} onChange={(e) => setDateAdded(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #EADBCE', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ background: '#8C6246', color: '#FFF', border: 'none', padding: '0.8rem 2rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', height: '44px' }}>Enter</button>
          </form>

          <div style={{ border: '1px solid #EADBCE', borderRadius: '8px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8F4EC', borderBottom: '1px solid #EADBCE' }}>
                  <th style={{ padding: '1.1rem 1rem', fontSize: '0.8rem', color: '#5A432C' }}>MEDICINE NAME</th>
                  <th style={{ padding: '1.1rem 1rem', fontSize: '0.8rem', color: '#5A432C' }}>QUANTITY ADDED</th>
                  <th style={{ padding: '1.1rem 1rem', fontSize: '0.8rem', color: '#5A432C' }}>DATE RECEIVED</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#9A8E8B' }}>Querying database layers...</td></tr>
                ) : inventory.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2.5rem', color: '#9A8E8B' }}>No stock entries found.</td></tr>
                ) : (
                  inventory.map((item) => (
                    <tr key={item.item_id} style={{ borderBottom: '1px solid #EADBCE', background: '#FFF' }}>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>{item.medicine_name}</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: '700', color: '#137333' }}>+{item.quantity_added} units</td>
                      <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{item.date_received}</td>
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
}