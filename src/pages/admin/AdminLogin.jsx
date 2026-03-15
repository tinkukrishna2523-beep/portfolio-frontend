import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import './AdminLogin.css';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/admin/login', { password });
      login(res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__box">
        <div className="admin-login__logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="9" height="9" rx="2" fill="#0066FF"/>
            <rect x="13" y="2" width="9" height="9" rx="2" fill="#0066FF" opacity="0.4"/>
            <rect x="2" y="13" width="9" height="9" rx="2" fill="#0066FF" opacity="0.4"/>
            <rect x="13" y="13" width="9" height="9" rx="2" fill="#0066FF"/>
          </svg>
        </div>
        <h1>Admin Panel</h1>
        <p>Enter your password to manage portfolio content</p>

        <form onSubmit={handleSubmit}>
          <div className="admin-login__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
              disabled={loading}
            />
          </div>

          {error && <div className="admin-login__error">{error}</div>}

          <button type="submit" className="admin-login__btn" disabled={loading}>
            {loading ? <><span className="spin"/> Signing in...</> : 'Sign In →'}
          </button>
        </form>

        <a href="/" className="admin-login__back">← Back to Portfolio</a>
      </div>
    </div>
  );
};

export default AdminLogin;
