import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      toast.success('Account created! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'pratham123' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { name: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.12) 0%, transparent 60%)',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '40px',
        animation: 'fadeUp 0.4s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎓</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', marginBottom: '6px' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Join FlashCard today</p>
        </div>

        <form onSubmit={handleSubmit}>
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--text-muted)' }}>
                {label}
              </label>
              <input className="input" type={type} name={name} value={form[name]}
                onChange={handleChange} placeholder={placeholder} required />
            </div>
          ))}

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px', marginTop: '8px' }}>
            {loading ? '⏳ Creating...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent2)', textDecoration: 'none', fontWeight: 600 }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
