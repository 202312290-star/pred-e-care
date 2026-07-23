import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/api';
import logo from '../assets/logonidiaz.jpg';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const navItems = [
    { label: 'Patient Registry', path: '/dashboard' },
    { label: 'Supply Registry', path: '/dashboard-c' },
    { label: 'BHW Assignment', path: '/dashboard-b' },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Panel', path: '/admin' });
    navItems.push({ label: 'Epidemiological Forecast', path: '/dashboard-a' });
    navItems.push({ label: 'Critical Stockouts', path: '/critical-stockout' });
    navItems.push({ label: 'Audit Logs', path: '/audit-logs' });
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="PRED-E-CARE Logo" className="sidebar-logo" />
        <h2>PRED-E-CARE</h2>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li
              key={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </li>
          ))}
          <li className="logout" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;