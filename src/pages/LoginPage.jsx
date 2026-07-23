import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      localStorage.setItem('user', JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <div className="header">
          <h1 className="title">PRED-E-CARE</h1>
          <p className="subtitle">
            Barangay Predictive Health &amp; Care System
          </p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin} className="form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <p className="footer-text">
          Secure access system for barangay health monitoring
        </p>

        <p className="demo-credentials">
          Demo: admin@ecare.com / admin123
        </p>

        <p className="footer-text">
          Don't have an account?{" "}
          <Link to="/register" className="register-link">Create one here</Link>
        </p>
      </div>
    </div>
  );
}