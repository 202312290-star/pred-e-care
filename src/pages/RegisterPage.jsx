import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("BHW");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, password, role);
      setSuccess("Account created successfully! Redirecting to login…");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">PRED-E-CARE</h1>
          <p className="register-subtitle">Create Your Account</p>
        </div>

        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}

        <form onSubmit={handleRegister} className="register-form">
          <div className="register-input-group">
            <label htmlFor="reg-fullname">Full Name</label>
            <input
              id="reg-fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Juan Dela Cruz"
              required
              disabled={loading}
            />
          </div>

          <div className="register-input-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              disabled={loading}
            />
          </div>

          <div className="register-row">
            <div className="register-input-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                disabled={loading}
              />
            </div>

            <div className="register-input-group">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="register-input-group">
            <label htmlFor="reg-role">Role</label>
            <select
              id="reg-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="BHW">Barangay Health Worker (BHW)</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Creating Account…" : "Create Account"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/" className="register-link">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
