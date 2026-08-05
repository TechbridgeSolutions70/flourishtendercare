import { useEffect, useMemo, useRef, useState } from 'react';
import {
  adminSignOut,
  fetchContactMessages,
  fetchSurveyResponses,
  fetchTestimonials,
  getCurrentSession,
  supabase,
} from '../lib/supabaseClient';
import { Mail, FileText, MessageCircle, RefreshCw, LogOut, ShieldCheck } from 'lucide-react';
import { useToast } from '../components/ToastProvider';

const styles = {
  page: { minHeight: '100vh', padding: '2rem', background: '#f8fafc', color: '#111827' },
  container: { maxWidth: '1180px', margin: '0 auto' },
  header: { marginBottom: '1.5rem' },
  panel: { background: '#fff', borderRadius: '20px', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)', padding: '1.6rem' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' },
  title: { margin: 0, fontSize: 'clamp(1.75rem, 2.8vw, 2.25rem)' },
  subtitle: { margin: '0.5rem 0 0', color: '#475569' },
  button: { borderRadius: '999px', border: 'none', padding: '0.9rem 1.45rem', cursor: 'pointer', fontWeight: 700 },
  primaryButton: { background: '#7c3aed', color: '#fff' },
  secondaryButton: { background: '#f3f4f6', color: '#111827' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.5rem' },
  card: { background: '#eef2ff', borderRadius: '18px', padding: '1.2rem', minHeight: '130px' },
  cardTitle: { margin: 0, fontSize: '1rem', color: '#475569', marginBottom: '0.65rem' },
  cardValue: { fontSize: '2rem', margin: 0, color: '#111827' },
  tableWrapper: { overflowX: 'auto', marginTop: '1.5rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { background: '#eef2ff' },
  th: { textAlign: 'left', padding: '0.95rem 1rem', borderBottom: '1px solid #e2e8f0', color: '#475569' },
  td: { padding: '0.95rem 1rem', borderBottom: '1px solid #e5e7eb', verticalAlign: 'top', color: '#334155' },
  inputGroup: { display: 'grid', gap: '0.85rem', marginTop: '1rem' },
  inputLabel: { display: 'block', fontWeight: 700, color: '#111827' },
  input: { width: '100%', padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '1rem', color: '#111827' },
  alert: { marginTop: '1rem', padding: '1rem 1.2rem', background: '#fef3c7', borderRadius: '14px', color: '#92400e' },
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
        <h2 className="admin-table-title" style={{ margin: 0, fontSize: '1.15rem', color: '#111827' }}>{title}</h2>
        {items.length > 0 && (
          <div className="admin-scroll-controls">
            <button type="button" className="admin-scroll-btn" onClick={scrollLeft} aria-label="Scroll table left">←</button>
            <button type="button" className="admin-scroll-btn" onClick={scrollRight} aria-label="Scroll table right">→</button>
          </div>
        )}
      </div>
      <div ref={tableRef} className="admin-table-wrapper" style={styles.tableWrapper}>
        {items.length === 0 ? (
          <p style={{ margin: '1rem 0', color: '#6b7280' }}>{emptyText}</p>
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

export default function AdminDashboard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [surveys, setSurveys] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [initialized, setInitialized] = useState(false);

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

  useEffect(() => {
    if (initialized && !session) {
      window.location.href = '/login';
    }
  }, [initialized, session]);

  useEffect(() => {
    if (!supabaseReady) {
      addToast('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.', { type: 'error', duration: 8000 });
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
            <h1 style={styles.title}>Admin dashboard</h1>
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

  return (
    <main className="admin-dashboard-page" style={styles.page}>
      <div className="admin-panel-container" style={styles.container}>
        <div className="admin-dashboard-panel" style={styles.panel}>
          <div className="admin-dashboard-header" style={styles.sectionHeader}>
            <div>
              <h1 className="admin-dashboard-title" style={styles.title}>Admin dashboard</h1>
              <p className="admin-dashboard-subtitle" style={styles.subtitle}>Overview of survey responses, contact submissions, and parent testimonials.</p>
            </div>
            <div className="admin-dashboard-controls" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="admin-action-btn admin-action-secondary" style={{ ...styles.button, ...styles.secondaryButton }} type="button" onClick={refreshData} disabled={loading}>
                {loading ? 'Refreshing…' : 'Refresh'}
              </button>
              <button className="admin-action-btn" style={{ ...styles.button, ...styles.primaryButton }} type="button" onClick={handleSignOut} disabled={loading}>
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </div>

          <div className="admin-dashboard-card-grid" style={styles.cardGrid}>
            <SummaryCard title="Survey responses" value={surveys.length} icon={FileText} />
            <SummaryCard title="Contact messages" value={contacts.length} icon={Mail} />
            <SummaryCard title="Testimonials" value={testimonials.length} icon={MessageCircle} />
          </div>

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
        </div>
      </div>
    </main>
  );
}
