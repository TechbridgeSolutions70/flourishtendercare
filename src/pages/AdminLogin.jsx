import { useState, useEffect } from 'react';
import { ShieldCheck, Mail, KeyRound } from 'lucide-react';
import { adminSignIn, getCurrentSession, supabase } from '../lib/supabaseClient';
import { useToast } from '../components/ToastProvider';

const styles = {
  page: { minHeight: '100vh', padding: '2rem', background: '#f8fafc', color: '#111827' },
  container: { maxWidth: '560px', margin: '0 auto' },
  panel: { background: '#fff', borderRadius: '20px', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)', padding: '2rem' },
  header: { marginBottom: '1.25rem' },
  title: { margin: 0, fontSize: 'clamp(1.95rem, 3vw, 2.5rem)' },
  subtitle: { margin: '0.85rem 0 0', color: '#475569', lineHeight: 1.6 },
  form: { display: 'grid', gap: '1rem' },
  label: { display: 'grid', gap: '0.5rem', fontWeight: 700, color: '#111827' },
  input: { width: '100%', padding: '0.95rem 1rem', borderRadius: '14px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '1rem' },
  submit: { marginTop: '1rem', borderRadius: '999px', border: 'none', padding: '0.95rem 1rem', background: '#7c3aed', color: '#fff', fontWeight: 700, cursor: 'pointer' },
  alert: { marginTop: '1rem', padding: '1rem 1.2rem', background: '#fee2e2', borderRadius: '14px', color: '#991b1b' },
  info: { marginTop: '1rem', padding: '1rem 1.2rem', background: '#eff6ff', borderRadius: '14px', color: '#1d4ed8' },
};

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionExists, setSessionExists] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const init = async () => {
      const result = await getCurrentSession();
      if (result.data?.session) {
        setSessionExists(true);
      }
    };
    init();

    const listener = supabase.auth.onAuthStateChange((event, authSession) => {
      setSessionExists(Boolean(authSession?.session));
    });

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await adminSignIn(email, password);
    if (signInError) {
      const message = signInError.message || 'Unable to sign in.';
      setError(message);
      addToast(message, { type: 'error', duration: 5000 });
      setLoading(false);
      return;
    }

    window.location.href = '/dashboard';
  };

  useEffect(() => {
    if (sessionExists) {
      window.location.href = '/dashboard';
    }
  }, [sessionExists]);

  if (sessionExists) {
    return (
      <main className="admin-login-page" style={styles.page}>
        <div className="admin-panel-container" style={styles.container}>
          <div className="admin-login-panel" style={styles.panel}>
            <h1 className="admin-login-title" style={styles.title}>Already signed in</h1>
            <p className="admin-login-subtitle" style={styles.subtitle}>You are signed in and can now access the admin dashboard at <strong>/dashboard</strong>.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-login-page" style={styles.page}>
      <div className="admin-panel-container" style={styles.container}>
        <div className="admin-login-panel" style={styles.panel}>
          <header className="admin-login-header" style={styles.header}>
            <div className="admin-login-hero">
              <ShieldCheck size={32} className="admin-login-hero-icon" />
              <div>
                <h1 style={styles.title}>Secure admin portal</h1>
                <p style={styles.subtitle}>Authorized team members only. Enter your administrator credentials to continue.</p>
              </div>
            </div>
            <div className="admin-login-illustration">
              <div className="admin-illustration-shape" />
              <p className="admin-illustration-copy">Secure operations, fast review, and trusted access for your school administration.</p>
            </div>
          </header>

          <form onSubmit={handleSubmit} style={styles.form} className="admin-login-form">
            <label style={styles.label} className="admin-login-label">
              Email
              <div className="admin-input-with-icon">
                <Mail size={16} className="admin-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  style={styles.input}
                  className="admin-login-input"
                  required
                />
              </div>
            </label>

            <label style={styles.label} className="admin-login-label">
              Password
              <div className="admin-input-with-icon">
                <KeyRound size={16} className="admin-input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  style={styles.input}
                  className="admin-login-input"
                  required
                />
              </div>
            </label>

            <button type="submit" style={styles.submit} className="admin-login-submit" disabled={loading}>
              {loading ? 'Signing in…' : <><ShieldCheck size={16} /> Sign in</>}
            </button>

            {error && <div className="admin-alert" style={styles.alert}>{error}</div>}
            <div className="admin-login-info" style={styles.info}>Use your administrator credentials to access the secure dashboard.</div>
          </form>
        </div>
      </div>
    </main>
  );
}
