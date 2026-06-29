import { useState } from 'react';
import api from '../../api/axios';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/admin/auth/login', { email, password });
      localStorage.setItem('sv_admin_token', data.token);
      onLogin(data.email);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src="/logo.png"
            alt="Stackvine"
            style={{ height: 72, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(108,99,255,0.5))' }}
          />
        </div>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>Admin Panel</h1>
        <p>Stackvine admin — sign in to continue.</p>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="admin-field">
            <label>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@stackvine.io" />
          </div>
          <div className="admin-field">
            <label>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <p className="admin-err">{error}</p>}
          <button type="submit" className="admin-btn" style={{ padding: '12px', marginTop: 6 }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}
