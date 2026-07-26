const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ── AUTH ────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.findUserByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  db.logActivity('User login', user.name);

  res.json({
    message: 'Login successful',
    user: { id: user.id, email: user.email, name: user.name },
  });
});

// ── PATIENTS — GET ALL ─────────────────────────────────────────────
app.get('/api/patients', (req, res) => {
  const patients = db.getAllPatients();
  res.json(patients);
});

// ── PATIENTS — ADD ─────────────────────────────────────────────────
app.post('/api/patients', (req, res) => {
  const { name, age, symptoms } = req.body;

  if (!name || !age || !symptoms) {
    return res.status(400).json({ error: 'Name, age, and symptoms are required.' });
  }

  const newPatient = db.addPatient(name, age, symptoms);
  res.status(201).json(newPatient);
});

// ── PATIENTS — UPDATE ──────────────────────────────────────────────
app.put('/api/patients/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, age, symptoms } = req.body;

  const updated = db.updatePatient(id, { name, age, symptoms });

  if (!updated) {
    return res.status(404).json({ error: 'Patient not found.' });
  }

  res.json(updated);
});

// ── PATIENTS — DELETE ONE ──────────────────────────────────────────
app.delete('/api/patients/:id', (req, res) => {
  const id = Number(req.params.id);
  const deleted = db.deletePatient(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Patient not found.' });
  }

  res.json({ message: 'Patient deleted.', id });
});

// ── PATIENTS — CLEAR ALL ──────────────────────────────────────────
app.delete('/api/patients', (req, res) => {
  const count = db.clearAllPatients();
  res.json({ message: 'All patient records cleared.', count });
});

// ── STATS ──────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const stats = db.getStats();
  res.json(stats);
});

// ── ACTIVITY LOG ───────────────────────────────────────────────────
app.get('/api/activity', (req, res) => {
  const activities = db.getRecentActivity(20);
  res.json(activities);
});

// ── START SERVER ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ PRED-E-CARE Backend running on http://localhost:${PORT}`);
  console.log(`📦 Using SQLite database`);
});
