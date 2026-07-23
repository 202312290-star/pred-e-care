// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Patient from "./pages/Patient";
import Overview from "./pages/Overview";
import AdminDashboard from "./pages/AdminDashboard";
import DashboardA from "./pages/DashboardA";
import DashboardB from "./pages/DashboardB";
import DashboardC from "./pages/DashboardC";
import CriticalStockout from "./pages/CriticalStockout";
import AuditLogs from "./pages/AuditLogs";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.role === 'BHW') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient" element={<Patient />} />
        <Route path="/dashboard-a" element={<DashboardA />} />
        <Route path="/dashboard-b" element={<DashboardB />} />
        <Route path="/dashboard-c" element={<DashboardC />} />
        
        {/* Admin Only Routes */}
        <Route path="/overview" element={<AdminRoute><Overview /></AdminRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/critical-stockout" element={<AdminRoute><CriticalStockout /></AdminRoute>} />
        <Route path="/audit-logs" element={<AdminRoute><AuditLogs /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}