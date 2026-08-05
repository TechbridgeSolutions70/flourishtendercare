import { useState, useEffect } from 'react';
import useResponsive from '../hooks/useResponsive';
import { Mail, KeyRound } from 'lucide-react';
import { adminSignIn, getCurrentSession, supabase } from '../lib/supabaseClient';
import { useToast } from '../components/ToastProvider';
import logoUrl from '../Public/logo/logo1.jpeg';

const styles = {
  page: { minHeight: '100vh', padding: '0', background: 'var(--bg-app)', color: 'var(--text-main)' },
  panel: { background: 'var(--bg-surface)', borderRadius: '28px', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.12)', padding: '2rem 1.75rem', width: '100%', maxWidth: '420px', backdropFilter: 'blur(16px)', border: '1px solid var(--modal-border)' },
  container: { width: '100%', maxWidth: '420px', margin: '0 auto', padding: '1rem' },
  input: { width: '100%', padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.95rem', minHeight: '3rem' },
  submit: { borderRadius: '999px', border: 'none', padding: '0.85rem 1rem', background: 'var(--accent)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', width: '100%', minHeight: '3.2rem' },
  alert: { marginTop: '0.6rem', padding: '0.8rem 1rem', background: '#fee2e2', borderRadius: '10px', color: '#991b1b', fontSize: '0.95rem' },
  info: { marginTop: '0.75rem', textAlign: 'center', color: '#475569', fontSize: '0.92rem' },
};

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionExists, setSessionExists] = useState(false);
  const { addToast } = useToast();
  const { isMobile } = useResponsive();

  const localInputStyle = {
    ...styles.input,
    paddingTop: isMobile ? '0.7rem' : '0.75rem',
    paddingRight: isMobile ? '0.9rem' : '1rem',
    paddingBottom: isMobile ? '0.7rem' : '0.75rem',
    paddingLeft: isMobile ? '3.2rem' : '3.8rem',
    fontSize: isMobile ? '0.92rem' : styles.input.fontSize,
  };

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
            <h1 className="admin-login-title">Already signed in</h1>
            <p className="admin-login-subtitle">You're already signed in. Redirecting to your dashboard.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-login-page" style={styles.page}>
      <div className="admin-login-background" />
      <div className="admin-panel-container" style={styles.container}>
        <div className="admin-login-panel" style={styles.panel}>
          <div className="admin-login-brand">
            <img src={logoUrl} alt="School logo" className="admin-login-logo" />
            <div>
              <p className="admin-login-tag">Your Webapp Admin portal</p>
              <h1 className="admin-login-title">Admin Login</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <label className="admin-login-label">
              Email
              <div className="admin-input-with-icon">
                <Mail size={16} className="admin-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  style={localInputStyle}
                  className="admin-login-input"
                  required
                />
              </div>
            </label>

            <label className="admin-login-label">
              Password
              <div className="admin-input-with-icon">
                <KeyRound size={16} className="admin-input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  style={localInputStyle}
                  className="admin-login-input"
                  required
                />
              </div>
            </label>

            <button type="submit" style={styles.submit} className="admin-login-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            {error && <div className="admin-alert" style={styles.alert}>{error}</div>}
            <div className="admin-login-info" style={styles.info}>Enter your administrator credentials to access the dashboard.</div>
          </form>
        </div>
      </div>
    </main>
  );
}
