import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useResponsive from '../hooks/useResponsive';
import {
  adminSignOut,
  fetchContactMessages,
  fetchSurveyResponses,
  fetchTestimonials,
  getCurrentSession,
  supabase,
} from '../lib/supabaseClient';
import { Mail, FileText, MessageCircle, RefreshCw, LogOut, ShieldCheck, Menu } from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import logoUrl from '../Public/logo/logo1.jpeg';

let hasShownSupabaseWarning = false;

const styles = {
  page: { minHeight: '100vh', padding: '1.25rem', background: 'var(--bg-app)', color: 'var(--text-main)' },
  container: { maxWidth: '1040px', margin: '0 auto' },
  header: { marginBottom: '1rem' },
  panel: { background: 'var(--bg-surface)', borderRadius: '14px', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)', padding: '1.2rem', border: '1px solid var(--modal-border)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem' },
  title: { margin: 0, fontSize: 'clamp(1.25rem, 2.2vw, 1.6rem)' },
  subtitle: { margin: '0.35rem 0 0', color: 'var(--text-muted)', fontSize: '0.95rem' },
  button: { borderRadius: '999px', border: 'none', padding: '0.6rem 0.9rem', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' },
  primaryButton: { background: 'var(--accent)', color: '#fff' },
  secondaryButton: { background: 'var(--bg-surface-alt)', color: 'var(--text-main)' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.6rem' },
  card: { background: 'var(--card-bg)', borderRadius: '12px', padding: '0.6rem', minHeight: '64px' },
  cardTitle: { margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.35rem' },
  cardValue: { fontSize: '1.1rem', margin: 0, color: 'var(--text-main)' },
  tableWrapper: { overflowX: 'auto', marginTop: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { background: 'var(--bg-surface-alt)' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem' },
  td: { padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border-color)', verticalAlign: 'top', color: 'var(--text-main)', fontSize: '0.9rem' },
  inputGroup: { display: 'grid', gap: '0.6rem', marginTop: '0.6rem' },
  inputLabel: { display: 'block', fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' },
  input: { width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', fontSize: '0.95rem', color: 'var(--text-main)' },
  alert: { marginTop: '0.6rem', padding: '0.8rem 1rem', background: 'var(--accent-soft)', borderRadius: '10px', color: 'var(--accent-strong)' },
};

function SummaryCard({ title, value, icon: Icon }) {
  return (
    <div className="admin-card" style={styles.card}>
      <div className="admin-card-heading">
        <div className="admin-card-icon-wrapper">
          <Icon size={18} />
        </div>
        <p className="admin-card-title" style={styles.cardTitle}>{title}</p>
      </div>
      <p className="admin-card-value" style={styles.cardValue}>{value}</p>
    </div>
  );
}

function DataTable({ title, items, columns, emptyText }) {
  const tableRef = useRef(null);
  const scrollStep = 320;

  const scrollLeft = () => {
    tableRef.current?.scrollBy({ left: -scrollStep, behavior: 'smooth' });
  };

  const scrollRight = () => {
    tableRef.current?.scrollBy({ left: scrollStep, behavior: 'smooth' });
  };

  return (
    <div className="admin-table-section" style={{ marginTop: '1.75rem' }}>
      <div className="admin-table-headline" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
      <h2 className="admin-table-title" style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>{title}</h2>
        {items.length > 0 && (
          <div className="admin-scroll-controls">
            <button type="button" className="admin-scroll-btn" onClick={scrollLeft} aria-label="Scroll table left">←</button>
            <button type="button" className="admin-scroll-btn" onClick={scrollRight} aria-label="Scroll table right">→</button>
          </div>
        )}
      </div>
      <div ref={tableRef} className="admin-table-wrapper" style={styles.tableWrapper}>
        {items.length === 0 ? (
          <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>{emptyText}</p>
        ) : (
          <table className="admin-table" style={styles.table}>
            <thead className="admin-table-head" style={styles.tableHead}>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="admin-table-header" style={styles.th}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id ?? index}>
                  {columns.map((column) => (
                    <td key={column.key} className="admin-table-cell" style={styles.td}>{column.render ? column.render(item) : item[column.key] ?? '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
function Skeleton({ style: inlineStyle }) {
  return <div className="skeleton" style={inlineStyle} />;
}

export default function AdminDashboard() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem('flurish-theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
      window.localStorage.setItem('flurish-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSubject, setEmailSubject] = useState('Admin dashboard notification');
  const [emailBody, setEmailBody] = useState('Here is an important update from the admin dashboard.');
  const [sendingEmail, setSendingEmail] = useState(false);
  const { addToast } = useToast();
  const { isMobile } = useResponsive();
  const [surveys, setSurveys] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const refreshData = async () => {
    setLoading(true);

    const [surveyResult, contactResult, testimonialResult] = await Promise.all([
      fetchSurveyResponses(),
      fetchContactMessages(),
      fetchTestimonials(),
    ]);

    if (surveyResult.error || contactResult.error || testimonialResult.error) {
      const message = 'Unable to load dashboard data. Confirm Supabase is configured and that the tables exist.';
      addToast(message, { type: 'error', duration: 5000 });
    }

    setSurveys(surveyResult.data || []);
    setContacts(contactResult.data || []);
    setTestimonials(testimonialResult.data || []);
    setLoading(false);
  };

  const sendEmailNotification = async (event) => {
    event.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) {
      addToast('Subject and body are required to send the notification.', { type: 'error' });
      return;
    }

    setSendingEmail(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: emailSubject, body: emailBody }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send notification email.');
      }

      addToast('Notification email sent successfully.', { type: 'success' });
    } catch (error) {
      addToast(error.message || 'Failed to send notification email.', { type: 'error' });
    } finally {
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const sessionResult = await getCurrentSession();
      setSupabaseReady(!sessionResult.error);
      setSession(sessionResult.data?.session ?? null);
      setInitialized(true);
      if (sessionResult.data?.session) {
        refreshData();
      }
    };

    init();

    const listener = supabase.auth.onAuthStateChange((event, authSession) => {
      setSession(authSession?.session ?? null);
      if (authSession?.session) {
        refreshData();
      } else {
        setSurveys([]);
        setContacts([]);
        setTestimonials([]);
      }
    });

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  useEffect(() => {
    if (initialized && !session) {
      window.location.href = '/login';
    }
  }, [initialized, session]);

  useEffect(() => {
    if (!supabaseReady && !hasShownSupabaseWarning) {
      addToast('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.', { type: 'error', duration: 8000 });
      hasShownSupabaseWarning = true;
    }
  }, [supabaseReady, addToast]);

  const handleSignOut = async () => {
    setLoading(true);
    const { error: signOutError } = await adminSignOut();
    if (signOutError) {
      const message = signOutError.message || 'Unable to sign out.';
      addToast(message, { type: 'error', duration: 5000 });
    }
    setLoading(false);
  };

  const surveyColumns = useMemo(
    () => [
      { key: 'parentName', label: 'Parent name' },
      { key: 'childrenNames', label: 'Child(ren)' },
      { key: 'class', label: 'Class/Grade' },
      { key: 'overallSatisfaction', label: 'Overall' },
      { key: 'created_at', label: 'Received', render: (item) => new Date(item.created_at).toLocaleString() },
    ],
    []
  );

  const contactColumns = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'message', label: 'Message' },
      { key: 'created_at', label: 'Received', render: (item) => new Date(item.created_at).toLocaleString() },
    ],
    []
  );

  const testimonialColumns = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'text', label: 'Testimonial' },
      { key: 'created_at', label: 'Received', render: (item) => new Date(item.created_at).toLocaleString() },
    ],
    []
  );

  if (!supabaseReady) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.panel}>
            <div style={styles.sectionHeader}>
              <div style={{ flex: 1 }}>
                <Skeleton style={{ width: '40%', height: '2.2rem', borderRadius: 8, marginBottom: '0.6rem' }} />
                <Skeleton style={{ width: '60%', height: '1rem', borderRadius: 6 }} />
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <Skeleton style={{ width: '4.6rem', height: '2.2rem', borderRadius: 999 }} />
                <Skeleton style={{ width: '4.6rem', height: '2.2rem', borderRadius: 999 }} />
              </div>
            </div>

            <div style={styles.cardGrid}>
              <Skeleton style={{ height: 120, borderRadius: 18 }} />
              <Skeleton style={{ height: 120, borderRadius: 18 }} />
              <Skeleton style={{ height: 120, borderRadius: 18 }} />
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <Skeleton style={{ height: 220, borderRadius: 14 }} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-dashboard-page" style={styles.page}>
        <div className="admin-panel-container" style={styles.container}>
          <div className="admin-dashboard-panel" style={styles.panel}>
            <div className="admin-dashboard-header" style={styles.sectionHeader}>
              <div>
                <h1 className="admin-dashboard-title" style={styles.title}>Admin access required</h1>
                <p className="admin-dashboard-subtitle" style={styles.subtitle}>You will be redirected to the login page if your session is not active.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // adjust a few styles for small screens
  const localStyles = {
    ...styles,
    container: { ...styles.container, maxWidth: isMobile ? '94%' : styles.container.maxWidth },
    card: { ...styles.card, padding: isMobile ? '0.65rem' : styles.card.padding, minHeight: isMobile ? '76px' : styles.card.minHeight },
    cardTitle: { ...styles.cardTitle, fontSize: isMobile ? '0.85rem' : styles.cardTitle.fontSize },
    cardValue: { ...styles.cardValue, fontSize: isMobile ? '1.25rem' : styles.cardValue.fontSize },
    sectionHeader: { ...styles.sectionHeader, gap: isMobile ? '0.5rem' : styles.sectionHeader.gap },
  };

  return (
    <main className="admin-dashboard-page" style={styles.page}>
      <div className="admin-panel-container" style={styles.container}>
        <div className="admin-dashboard-panel" style={styles.panel}>
          {isMobile && (
            <div className="admin-dashboard-mobile-navbar">
              <div className="mobile-nav-left">
                <img src={logoUrl} alt="School logo" className="mobile-nav-logo" />
                <p className="mobile-nav-title">Flourish Tender Care</p>
              </div>
              <div className="mobile-nav-right">
                <button
                  type="button"
                  className="mobile-nav-icon-button"
                  onClick={refreshData}
                  disabled={loading}
                  aria-label="Refresh data"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  type="button"
                  className="mobile-nav-icon-button"
                  onClick={toggleMobileMenu}
                  aria-label="Open menu"
                >
                  <Menu size={16} />
                </button>
              </div>
            </div>
          )}
          {isMobile && mobileMenuOpen && (
            <div className="admin-mobile-menu-panel">
              <button className="admin-mobile-menu-item" type="button" onClick={handleSignOut} disabled={loading}>
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          )}
          <div className="admin-dashboard-header" style={{
            ...styles.sectionHeader,
            display: isMobile ? 'none' : 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: styles.sectionHeader.gap,
            width: '100%',
          }}>
            <div>
              <h1 className="admin-dashboard-title" style={localStyles.title}>Admin dashboard</h1>
              <p className="admin-dashboard-subtitle" style={localStyles.subtitle}>Overview of survey responses, contact submissions, and parent testimonials.</p>
            </div>
            <div className="admin-dashboard-controls" style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end' }}>
              <button className="admin-action-btn admin-action-secondary" style={{ ...styles.button, ...styles.secondaryButton, display: 'inline-flex', alignItems: 'center' }} type="button" onClick={refreshData} disabled={loading}>
                {loading ? <span className="btn-spinner" aria-hidden /> : <RefreshCw size={16} />}
                <span>{loading ? 'Processing' : 'Refresh'}</span>
              </button>
              <button className="admin-action-btn" style={{ ...styles.button, ...styles.primaryButton, display: 'inline-flex', alignItems: 'center' }} type="button" onClick={handleSignOut} disabled={loading}>
                {loading ? <span className="btn-spinner" aria-hidden /> : <LogOut size={16} />}
                <span>Sign out</span>
              </button>
            </div>
          </div>

          {/* Stats row like the screenshot: 4 colored stat boxes */}
          <div className="dashboard-stats-grid">
            <div className="stat-box stat-orange">
              <div className="stat-label">Students</div>
              <div className="stat-value">{surveys.length}</div>
            </div>
            <div className="stat-box stat-green">
              <div className="stat-label">Teachers</div>
              <div className="stat-value">{12}</div>
            </div>
            <div className="stat-box stat-red">
              <div className="stat-label">Classes</div>
              <div className="stat-value">{8}</div>
            </div>
            <div className="stat-box stat-blue">
              <div className="stat-label">Visitors</div>
              <div className="stat-value">{contacts.length}</div>
            </div>
          </div>

          {/* Main dashboard grid: small left card and large right map/card */}
          <div className="dashboard-main-grid">
            <div className="dashboard-left">
              <div className="admin-card" style={{ padding: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Task</h3>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '120px', display: 'grid', placeItems: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'conic-gradient(var(--accent) 0 75%, var(--accent-soft) 0)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700 }}>80%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-right">
              <div className="admin-card" style={{ padding: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>World Map</h3>
                <p style={{ marginTop: '0.45rem', color: 'var(--text-muted)' }}>Map of the distribution of users around the world</p>
                <div style={{ marginTop: '0.75rem', width: '100%', height: 160, background: 'linear-gradient(180deg, var(--preview-surface), var(--card-bg))', borderRadius: 8 }} />
              </div>
            </div>
          </div>

          {/* Traffic log table */}
          <section style={{ marginTop: '0.85rem' }}>
            <h3 style={{ margin: '0 0 0.6rem 0', color: 'var(--text-main)' }}>Traffic log</h3>
            <DataTable
              title="Recent visitors"
              items={contacts}
              columns={contactColumns}
              emptyText="No visitors logged yet."
            />
          </section>

          <section className="admin-email-notification" style={{ marginTop: '1.75rem', borderRadius: '20px', padding: '1.35rem', background: 'var(--modal-surface-alt)', border: '1px solid var(--modal-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>Send notification email</h2>
                <p style={{ margin: '0.6rem 0 0', color: 'var(--text-muted)', lineHeight: 1.6 }}>Configure the subject and body, then send a message through the mail API.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ padding: '0.5rem 0.9rem', borderRadius: '999px', background: 'var(--accent-soft)', color: 'var(--accent-strong)' }}>Email service: SendGrid</span>
              </div>
            </div>

            <form onSubmit={sendEmailNotification} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <label style={{ display: 'grid', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Subject
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(event) => setEmailSubject(event.target.value)}
                  style={{ width: '100%', minHeight: '3rem', borderRadius: '14px', border: '1px solid rgba(15, 23, 42, 0.14)', padding: '0.9rem 1rem', fontSize: '1rem' }}
                />
              </label>

              <label style={{ display: 'grid', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Body
                <textarea
                  value={emailBody}
                  onChange={(event) => setEmailBody(event.target.value)}
                  rows={5}
                  style={{ width: '100%', borderRadius: '14px', border: '1px solid rgba(15, 23, 42, 0.14)', padding: '0.9rem 1rem', fontSize: '1rem', resize: 'vertical' }}
                />
              </label>

              <button type="submit" className="admin-action-btn" style={{ ...styles.button, ...styles.primaryButton, width: 'fit-content' }} disabled={sendingEmail}>
                {sendingEmail ? 'Sending…' : 'Send notification'}
              </button>
            </form>
          </section>

          <DataTable
            title="Latest survey responses"
            items={surveys}
            columns={surveyColumns}
            emptyText="No survey responses have been received yet."
          />
          <DataTable
            title="Latest contact messages"
            items={contacts}
            columns={contactColumns}
            emptyText="No contact messages have been received yet."
          />
          <DataTable
            title="Latest testimonials"
            items={testimonials}
            columns={testimonialColumns}
            emptyText="No testimonials have been submitted yet."
          />
          {/* floating theme toggle rendered into document.body via portal below */}
        </div>
      </div>
      {typeof document !== 'undefined' && createPortal(
        <div className="admin-floating-theme" aria-hidden>
          <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{theme === 'dark' ? 'Dark' : 'Light'}</span>
          <button type="button" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? '☾' : '☀'}</button>
        </div>,
        document.body
      )}
    </main>
  );
}
