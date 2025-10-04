import { useState } from 'react';
import { signup, login as apiLogin } from '../services/api.js';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Signup() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await signup(form);
      const { data } = await apiLogin({ email: form.email, password: form.password });
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
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-sub">Join and start adding and reviewing books. It’s free.</p>

      <form onSubmit={onSubmit} className="form auth-form" style={{ width: '100%' }}>
        <div className="flex w-full flex-col gap-2">
          <Input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Input type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Input type={showPw ? 'text' : 'password'} name="password" placeholder="Password" value={form.password} onChange={onChange} required minLength={6} />
        </div>

        {error && <p className="error" style={{ marginTop: 6 }}>{error}</p>}

        <Button type="submit" className="w-full ui-btn--primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create account'}
        </Button>
      </form>

      <p className="muted" style={{ marginTop: 12 }}>Already have an account? <Link to="/login">Login</Link></p>
    </section>
  );
}
