import { useState } from 'react';
import { login } from '../services/api.js';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await login(form);
      setToken(data.token); setUser(data.user);
      navigate('/home');
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <h1 className="auth-title">Login</h1>
      <p className="auth-sub">Welcome back. Please enter your details.</p>

      <form onSubmit={onSubmit} className="form auth-form" style={{ width: '100%' }}>
        <div className="flex w-full flex-col gap-2">
          <Input type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Input type={showPw ? 'text' : 'password'} name="password" placeholder="Password" value={form.password} onChange={onChange} required minLength={6} />
        </div>

        {error && <p className="error" style={{ marginTop: 6 }}>{error}</p>}

        <Button type="submit" className="w-full ui-btn--primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>
      </form>

      <p className="muted" style={{ marginTop: 12 }}>New here? <Link to="/signup">Create an account</Link></p>
    </section>
  );
}
