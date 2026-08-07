import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useResponsive from '../hooks/useResponsive';
import {
  adminSignOut,
  deleteSurveyResponse,
  deleteSurveyResponses,
  deleteContactMessage,
  deleteContactMessages,
  deleteTestimonial,
  deleteTestimonials,
  fetchContactMessages,
  fetchSurveyResponses,
  fetchTestimonials,
  getCurrentSession,
  supabase,
} from '../lib/supabaseClient';
import { Mail, FileText, MessageCircle, RefreshCw, LogOut, ShieldCheck, Menu } from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import PrintHandler from '../components/PrintHandler';
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

function formatFieldValue(item, column) {
  if (column.render) {
    return column.render(item);
  }

  const rawKey = column.key;
  const snakeKey = rawKey.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
  const value = item[rawKey] ?? item[snakeKey];

  if (value === undefined || value === null || value === '') {
    return '—';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 0);
  }

  return String(value);
}

function DetailRecordModal({ logoUrl, heading, item, columns, onClose, onPrint }) {
  const [showAllFields, setShowAllFields] = useState(false);
  const visibleColumns = showAllFields ? columns : columns.slice(0, 8);
  const hiddenCount = Math.max(0, columns.length - 8);

  return (
    <div className="detail-record-modal" role="dialog" aria-modal="true" aria-label="Record details">
      <div className="detail-record-backdrop" onClick={onClose} />
      <div className="detail-record-card">
        <div className="detail-record-letterhead">
          <div className="detail-record-letterhead-branding">
            <img src={logoUrl} alt="Flourish Tender Care" className="detail-record-letterhead-logo" />
            <div>
              <p className="detail-record-letterhead-eyebrow">Flourish Tender Care</p>
              <h2 className="detail-record-letterhead-title">Comprehensive Summary Details</h2>
              <p className="detail-record-letterhead-copy">Below is a summary of the selected record.</p>
            </div>
          </div>
          <div className="detail-record-letterhead-meta">
            <span>Printed view</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="detail-record-toolbar">
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>{heading}</h3>
            <p style={{ margin: '0.35rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Important fields are shown on cards below.</p>
          </div>
          <div className="detail-record-actions">
            <button type="button" className="admin-action-btn admin-action-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="admin-action-btn" onClick={onPrint}>
              Print record
            </button>
          </div>
        </div>

        <div className="detail-record-body">
          <div className="detail-record-card-grid">
            {visibleColumns.map((column) => (
              <article key={column.key} className="detail-record-card-item">
                <dt>{column.label}</dt>
                <dd>{formatFieldValue(item, column)}</dd>
              </article>
            ))}
          </div>
          {hiddenCount > 0 && (
            <button
              type="button"
              className="detail-record-toggle"
              onClick={() => setShowAllFields((current) => !current)}
              aria-expanded={showAllFields}
            >
              {showAllFields ? 'Show fewer fields' : `Show ${hiddenCount} more field${hiddenCount > 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DataTable({ title, items, columns, emptyText, rowSelection, rowActions, printScope }) {
  const tableRef = useRef(null);
  const scrollStep = 320;

  const scrollLeft = () => {
    tableRef.current?.scrollBy({ left: -scrollStep, behavior: 'smooth' });
  };

  const scrollRight = () => {
    tableRef.current?.scrollBy({ left: scrollStep, behavior: 'smooth' });
  };

  const allSelected = rowSelection?.selectedIds && items.length > 0 && items.every((item) => rowSelection.selectedIds.has(item.id));

  const toggleAll = () => {
    if (!rowSelection || !rowSelection.onToggle) return;
    if (allSelected) {
      items.forEach((item) => rowSelection.onToggle(item.id, false));
    } else {
      items.forEach((item) => rowSelection.onToggle(item.id, true));
    }
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
                {rowSelection && (
                  <th className="admin-table-header" style={styles.th}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th key={column.key} className="admin-table-header" style={styles.th}>{column.label}</th>
                ))}
                {rowActions && <th className="admin-table-header" style={styles.th}>{rowActions.header || 'Actions'}</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const id = item.id ?? index;
                const isHiddenInPrint = printScope === 'selected' && rowSelection?.selectedIds && !rowSelection.selectedIds.has(id);
                return (
                  <tr key={id} className={isHiddenInPrint ? 'print-hidden' : undefined}>
                    {rowSelection && (
                      <td className="admin-table-cell" style={styles.td}>
                        <input
                          type="checkbox"
                          checked={rowSelection.selectedIds?.has(id) || false}
                          onChange={() => rowSelection.onToggle(id)}
                          aria-label={`Select row ${id}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => {
                      const rawKey = column.key;
                      const snakeKey = rawKey.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
                      const value = column.render ? column.render(item) : (item[rawKey] ?? item[snakeKey] ?? '—');
                      return (
                        <td key={column.key} className="admin-table-cell" style={styles.td}>
                          <div className="admin-table-cell-content">{value}</div>
                        </td>
                      );
                    })}
                    {rowActions && (
                      <td className="admin-table-cell" style={styles.td}>
                        {rowActions.buttons?.map((button) => (
                          <button
                            type="button"
                            key={button.key}
                            className={button.variant === 'primary' ? 'admin-action-btn' : 'admin-action-btn admin-action-secondary'}
                            onClick={() => button.onClick(item)}
                            disabled={button.disabled}
                          >
                            {button.label}
                          </button>
                        ))}
                      </td>
                    )}
                  </tr>
                );
              })}
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
  const [selectedSurveyIds, setSelectedSurveyIds] = useState(new Set());
  const [selectedContactIds, setSelectedContactIds] = useState(new Set());
  const [selectedTestimonialIds, setSelectedTestimonialIds] = useState(new Set());
  const [classFilter, setClassFilter] = useState('All');
  const [printScope, setPrintScope] = useState('all');
  const [printTimestamp, setPrintTimestamp] = useState('');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);
  const [detailRecordHeading, setDetailRecordHeading] = useState('');
  const [detailRecordColumns, setDetailRecordColumns] = useState([]);
  const [isDetailPrinting, setIsDetailPrinting] = useState(false);
  const printUrl = typeof window !== 'undefined' ? window.location.origin : 'https://flourishtendercare.com.ng';
  const [supabaseReady, setSupabaseReady] = useState(null);
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

  const openDetailRecord = (item, heading, columns) => {
    setDetailRecord(item);
    setDetailRecordHeading(heading);
    setDetailRecordColumns(columns);
  };

  const closeDetailRecord = () => {
    setDetailRecord(null);
    setDetailRecordHeading('');
    setDetailRecordColumns([]);
  };

  const printDetailRecord = () => {
    if (!detailRecord) return;
    const timestamp = new Date().toLocaleString();
    setPrintTimestamp(timestamp);
    setIsPrinting(true);

    if (typeof document !== 'undefined') {
      document.body.classList.add('admin-printing');
      const sheetId = 'detail-record-print-style';
      let styleEl = document.getElementById(sheetId);
      if (styleEl) {
        styleEl.remove();
      }

      styleEl = document.createElement('style');
      styleEl.id = sheetId;
      styleEl.textContent = '@page { size: portrait; margin: 0.75in; }';
      document.head.appendChild(styleEl);

      const cleanup = () => {
        document.body.classList.remove('admin-printing');
        setIsPrinting(false);
        const existing = document.getElementById(sheetId);
        if (existing) existing.remove();
        window.removeEventListener('afterprint', cleanup);
      };
      window.addEventListener('afterprint', cleanup);
    }

    window.setTimeout(() => {
      window.print();
    }, 250);
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
      window.location.replace('/login');
    }
  }, [initialized, session]);

  useEffect(() => {
    if (supabaseReady === false && initialized && !hasShownSupabaseWarning) {
      addToast('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.', { type: 'error', duration: 8000 });
      hasShownSupabaseWarning = true;
    }
  }, [supabaseReady, initialized, addToast]);

  const handleSignOut = async () => {
    setLoading(true);
    const { error: signOutError } = await adminSignOut();
    if (signOutError) {
      const message = signOutError.message || 'Unable to sign out.';
      addToast(message, { type: 'error', duration: 5000 });
    }
    setLoading(false);
  };

  const toggleSelection = (id, selected, setter) => {
    setter((prev) => {
      const next = new Set(prev);
      if (typeof selected === 'boolean') {
        if (selected) next.add(id);
        else next.delete(id);
      } else {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  };

  const toggleSelectSurvey = (id, selected) => toggleSelection(id, selected, setSelectedSurveyIds);
  const toggleSelectContact = (id, selected) => toggleSelection(id, selected, setSelectedContactIds);
  const toggleSelectTestimonial = (id, selected) => toggleSelection(id, selected, setSelectedTestimonialIds);

  const handleDeleteSurvey = async (id) => {
    if (!window.confirm('Delete this survey response?')) return;
    setLoading(true);
    const { error } = await deleteSurveyResponse(id);
    if (error) {
      const message = error.message || 'Unable to delete survey response.';
      addToast(message, { type: 'error', duration: 5000 });
    } else {
      addToast('Survey response deleted.', { type: 'success', duration: 4000 });
      refreshData();
      setSelectedSurveyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    setLoading(false);
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this visitor record?')) return;
    setLoading(true);
    const { error } = await deleteContactMessage(id);
    if (error) {
      const message = error.message || 'Unable to delete visitor record.';
      addToast(message, { type: 'error', duration: 5000 });
    } else {
      addToast('Visitor record deleted.', { type: 'success', duration: 4000 });
      refreshData();
      setSelectedContactIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    setLoading(false);
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    setLoading(true);
    const { error } = await deleteTestimonial(id);
    if (error) {
      const message = error.message || 'Unable to delete testimonial.';
      addToast(message, { type: 'error', duration: 5000 });
    } else {
      addToast('Testimonial deleted.', { type: 'success', duration: 4000 });
      refreshData();
      setSelectedTestimonialIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    setLoading(false);
  };

  const handleDeleteSelected = async () => {
    let ids = [];
    let deleteFn = null;
    let messageLabel = '';
    let successLabel = '';

    if (activeTab === 'survey') {
      ids = Array.from(selectedSurveyIds);
      deleteFn = deleteSurveyResponses;
      messageLabel = 'survey responses';
      successLabel = 'Selected survey responses have been deleted.';
    } else if (activeTab === 'visitors') {
      ids = Array.from(selectedContactIds);
      deleteFn = deleteContactMessages;
      messageLabel = 'visitor records';
      successLabel = 'Selected visitor records have been deleted.';
    } else {
      ids = Array.from(selectedTestimonialIds);
      deleteFn = deleteTestimonials;
      messageLabel = 'testimonials';
      successLabel = 'Selected testimonials have been deleted.';
    }

    if (!ids.length) return;
    if (!window.confirm(`Delete selected ${messageLabel}?`)) return;

    setLoading(true);
    const { error } = await deleteFn(ids);
    if (error) {
      const message = error.message || `Unable to delete selected ${messageLabel}.`;
      addToast(message, { type: 'error', duration: 5000 });
    } else {
      addToast(successLabel, { type: 'success', duration: 4000 });
      refreshData();
      if (activeTab === 'survey') setSelectedSurveyIds(new Set());
      else if (activeTab === 'visitors') setSelectedContactIds(new Set());
      else setSelectedTestimonialIds(new Set());
    }
    setLoading(false);
  };

  const handlePreview = () => {
    const timestamp = new Date().toLocaleString();
    setPrintTimestamp(timestamp);
    setShowPrintPreview(true);
  };

  const handlePrintFromPreview = () => {
    setShowPrintPreview(false);
    window.setTimeout(() => {
      handlePrint();
    }, 150);
  };

  const handlePrint = () => {
    const timestamp = new Date().toLocaleString();
    setPrintTimestamp(timestamp);
    setIsPrinting(true);

    if (typeof document !== 'undefined') {
      document.body.classList.add('admin-printing');

      const sheetId = 'survey-print-page-style';
      let styleEl = document.getElementById(sheetId);
      if (styleEl) {
        styleEl.remove();
      }

      styleEl = document.createElement('style');
      styleEl.id = sheetId;
      styleEl.textContent = activeTab === 'survey'
        ? '@page { size: landscape; margin: 0.75in; }'
        : '@page { size: portrait; margin: 0.75in; }';
      document.head.appendChild(styleEl);

      const cleanup = () => {
        document.body.classList.remove('admin-printing');
        setIsPrinting(false);
        const existing = document.getElementById(sheetId);
        if (existing) existing.remove();
        window.removeEventListener('afterprint', cleanup);
      };
      window.addEventListener('afterprint', cleanup);
    }

    window.setTimeout(() => {
      window.print();
    }, 300);
  };

  const surveyColumns = useMemo(
    () => [
      { key: 'parentName', label: 'Parent name' },
      { key: 'childrenNames', label: 'Child(ren)' },
      { key: 'class', label: 'Class / Grade' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'parentType', label: 'Parent type' },
      { key: 'overallSatisfaction', label: 'Overall satisfaction' },
      { key: 'schoolEnvironment', label: 'School environment' },
      { key: 'communicationSchool', label: 'Communication with school' },
      { key: 'couldRecommend', label: 'Would recommend?' },
      { key: 'schoolFacilities', label: 'Facilities' },
      { key: 'schoolValues', label: 'School values' },
      { key: 'teacherSatisfaction', label: 'Teacher quality' },
      { key: 'teacherCommunication', label: 'Teacher communication' },
      { key: 'childTreatedWithLove', label: 'Treated with love' },
      { key: 'teacherApproachability', label: 'Teacher approachability' },
      { key: 'teacherMotivation', label: 'Teacher motivation' },
      { key: 'hadTeacherConcern', label: 'Teacher concern?' },
      { key: 'concernResolution', label: 'Concern resolution' },
      { key: 'appreciateTeacher', label: 'Appreciation notes' },
      { key: 'improvementSuggestions', label: 'Improvement suggestions' },
      { key: 'portalUsage', label: 'Portal usage' },
      { key: 'portalFunctionality', label: 'Portal functionality' },
      { key: 'portalFeatures', label: 'Portal features' },
      { key: 'improvementPriority', label: 'Improvement priority' },
      { key: 'improvementComments', label: 'Improvement comments' },
      { key: 'generalComments', label: 'General comments' },
      {
        key: 'teacherMatrix',
        label: 'Teacher ratings',
        render: (item) => {
          if (!item.teacherMatrix && !item.teacher_matrix) return '—';
          const matrix = item.teacherMatrix || item.teacher_matrix;
          if (typeof matrix !== 'object' || matrix === null) return String(matrix || '—');
          return Object.entries(matrix)
            .map(([field, value]) => `${field.replace(/([A-Z])/g, ' $1').trim()}: ${value}`)
            .join(' • ');
        },
      },
      { key: 'created_at', label: 'Submitted', render: (item) => new Date(item.created_at).toLocaleString() },
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

  const [activeTab, setActiveTab] = useState('visitors');

  const filteredSurveys = useMemo(() => {
    if (classFilter === 'All') return surveys;
    return surveys.filter((survey) => {
      const surveyClass = survey.class ?? survey['class'] ?? '';
      return String(surveyClass).toLowerCase() === String(classFilter).toLowerCase();
    });
  }, [surveys, classFilter]);

  const availableClasses = useMemo(() => {
    const classes = new Set(['All']);
    surveys.forEach((survey) => {
      const surveyClass = survey.class ?? survey['class'] ?? '';
      if (surveyClass) classes.add(surveyClass);
    });
    return Array.from(classes).sort((a, b) => (a === 'All' ? -1 : String(a).localeCompare(String(b))));
  }, [surveys]);

  const activeSurveyCount = filteredSurveys.length;
  const selectedCount = activeTab === 'survey'
    ? selectedSurveyIds.size
    : activeTab === 'visitors'
      ? selectedContactIds.size
      : selectedTestimonialIds.size;

  const tabDefinitions = useMemo(
    () => [
      { key: 'visitors', label: 'Visitors', count: contacts.length, subtitle: 'Visitors on the main site' },
      { key: 'survey', label: 'Survey', count: surveys.length, subtitle: 'Survey responses received' },
      { key: 'messages', label: 'Messages', count: testimonials.length, subtitle: 'Testimonials and messages' },
    ],
    [contacts.length, surveys.length, testimonials.length]
  );

  const renderTabContent = () => {
    if (activeTab === 'survey') {
      return (
        <section className="admin-dashboard-tab-panel">
          <h3>Survey Submitted</h3>
          <p className="admin-dashboard-tab-description">Survey submissions received from families.</p>

          <div className="survey-controls-row">
            <div className="survey-filter-group">
              <label className="survey-filter-label">Filter by class/grade</label>
              <select
                className="survey-filter-select"
                value={classFilter}
                onChange={(event) => setClassFilter(event.target.value)}
              >
                {availableClasses.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="survey-print-actions">
              <div className="survey-print-scope">
                <label>
                  <input
                    type="radio"
                    name="print-scope"
                    value="all"
                    checked={printScope === 'all'}
                    onChange={() => setPrintScope('all')}
                  />
                  All rows
                </label>
                <label>
                  <input
                    type="radio"
                    name="print-scope"
                    value="selected"
                    checked={printScope === 'selected'}
                    onChange={() => setPrintScope('selected')}
                    disabled={selectedCount === 0}
                  />
                  Selected rows ({selectedCount})
                </label>
              </div>

              <div className="survey-action-buttons">
                <button type="button" className="admin-action-btn admin-action-secondary" onClick={handleDeleteSelected} disabled={selectedCount === 0 || loading}>
                  Delete selected
                </button>
                <button type="button" className="admin-action-btn admin-action-secondary" onClick={handlePreview} disabled={activeSurveyCount === 0}>
                  Preview PDF
                </button>
                <button type="button" className="admin-action-btn" onClick={handlePrint} disabled={activeSurveyCount === 0}>
                  Print responses
                </button>
              </div>
            </div>
          </div>

          <DataTable
            title={`Survey responses (${filteredSurveys.length})`}
            items={filteredSurveys}
            columns={surveyColumns}
            emptyText="No survey submissions yet."
            rowSelection={{ selectedIds: selectedSurveyIds, onToggle: toggleSelectSurvey }}
            rowActions={{
              header: 'Actions',
              buttons: [
                {
                  key: 'view',
                  label: 'View',
                  variant: 'primary',
                  onClick: (item) => openDetailRecord(item, 'Survey submission details', surveyColumns),
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  onClick: (item) => handleDeleteSurvey(item.id),
                },
              ],
            }}
            printScope={printScope}
          />
        </section>
      );
    }

    if (activeTab === 'messages') {
      return (
        <section className="admin-dashboard-tab-panel">
          <h3>Messages Sent</h3>
          <p className="admin-dashboard-tab-description">Messages submitted through the site.</p>

          <div className="survey-controls-row">
            <div className="survey-print-actions">
              <div className="survey-print-scope">
                <label>
                  <input
                    type="radio"
                    name="print-scope"
                    value="all"
                    checked={printScope === 'all'}
                    onChange={() => setPrintScope('all')}
                  />
                  All rows
                </label>
                <label>
                  <input
                    type="radio"
                    name="print-scope"
                    value="selected"
                    checked={printScope === 'selected'}
                    onChange={() => setPrintScope('selected')}
                    disabled={selectedCount === 0}
                  />
                  Selected rows ({selectedCount})
                </label>
              </div>

              <div className="survey-action-buttons">
                <button type="button" className="admin-action-btn admin-action-secondary" onClick={handleDeleteSelected} disabled={selectedCount === 0 || loading}>
                  Delete selected
                </button>
                <button type="button" className="admin-action-btn admin-action-secondary" onClick={handlePreview} disabled={testimonials.length === 0}>
                  Preview PDF
                </button>
                <button type="button" className="admin-action-btn" onClick={handlePrint} disabled={testimonials.length === 0}>
                  Print responses
                </button>
              </div>
            </div>
          </div>

          <DataTable
            title={`Testimonials (${testimonials.length})`}
            items={testimonials}
            columns={testimonialColumns}
            emptyText="No messages sent yet."
            rowSelection={{ selectedIds: selectedTestimonialIds, onToggle: toggleSelectTestimonial }}
            rowActions={{
              header: 'Actions',
              buttons: [
                {
                  key: 'view',
                  label: 'View',
                  variant: 'primary',
                  onClick: (item) => openDetailRecord(item, 'Testimonial details', testimonialColumns),
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  onClick: (item) => handleDeleteTestimonial(item.id),
                },
              ],
            }}
            printScope={printScope}
          />
        </section>
      );
    }

    return (
      <section className="admin-dashboard-tab-panel">
        <h3>Visitors</h3>
        <p className="admin-dashboard-tab-description">Visitors logged from the main site.</p>

        <div className="survey-controls-row">
          <div className="survey-print-actions">
            <div className="survey-print-scope">
              <label>
                <input
                  type="radio"
                  name="print-scope"
                  value="all"
                  checked={printScope === 'all'}
                  onChange={() => setPrintScope('all')}
                />
                All rows
              </label>
              <label>
                <input
                  type="radio"
                  name="print-scope"
                  value="selected"
                  checked={printScope === 'selected'}
                  onChange={() => setPrintScope('selected')}
                  disabled={selectedCount === 0}
                />
                Selected rows ({selectedCount})
              </label>
            </div>

            <div className="survey-action-buttons">
              <button type="button" className="admin-action-btn admin-action-secondary" onClick={handleDeleteSelected} disabled={selectedCount === 0 || loading}>
                Delete selected
              </button>
              <button type="button" className="admin-action-btn admin-action-secondary" onClick={handlePreview} disabled={contacts.length === 0}>
                Preview PDF
              </button>
              <button type="button" className="admin-action-btn" onClick={handlePrint} disabled={contacts.length === 0}>
                Print responses
              </button>
            </div>
          </div>
        </div>

        <DataTable
          title={`Visitor records (${contacts.length})`}
          items={contacts}
          columns={contactColumns}
          emptyText="No visitor records yet."
          rowSelection={{ selectedIds: selectedContactIds, onToggle: toggleSelectContact }}
          rowActions={{
            header: 'Actions',
            buttons: [
              {
                key: 'view',
                label: 'View',
                variant: 'primary',
                onClick: (item) => openDetailRecord(item, 'Visitor record details', contactColumns),
              },
              {
                key: 'delete',
                label: 'Delete',
                onClick: (item) => handleDeleteContact(item.id),
              },
            ],
          }}
          printScope={printScope}
        />
        <div className="admin-email-notification" style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>Send notification email</h2>
              <p style={{ margin: '0.6rem 0 0', color: 'var(--text-muted)', lineHeight: 1.6 }}>Send a notification directly from the visitors tab.</p>
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
        </div>
      </section>
    );
  };

  if (supabaseReady === null) {
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

  if (supabaseReady === false) {
    return (
      <main className="admin-dashboard-page" style={styles.page}>
        <div className="admin-panel-container" style={styles.container}>
          <div className="admin-dashboard-panel" style={styles.panel}>
            <div style={{ marginBottom: '1rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>Supabase configuration unavailable</h1>
              <p style={{ margin: '0.75rem 0 0', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Supabase could not initialize. Confirm the project has <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> set.
              </p>
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

  const printHeading = activeTab === 'survey'
    ? 'Survey Responses Report'
    : activeTab === 'visitors'
      ? 'Visitor Records Report'
      : 'Testimonial Messages Report';

  const printItems = activeTab === 'survey'
    ? filteredSurveys
    : activeTab === 'visitors'
      ? contacts
      : testimonials;

  const printColumns = activeTab === 'survey'
    ? surveyColumns
    : activeTab === 'visitors'
      ? contactColumns
      : testimonialColumns;

  const printSelectedIds = activeTab === 'survey'
    ? selectedSurveyIds
    : activeTab === 'visitors'
      ? selectedContactIds
      : selectedTestimonialIds;

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

          <div className="dashboard-stats-grid admin-dashboard-card-row">
            {tabDefinitions.map((tab) => (
              <div
                key={tab.key}
                className={`stat-box ${tab.key === 'visitors' ? 'stat-blue' : tab.key === 'survey' ? 'stat-orange' : 'stat-green'}`}
              >
                <div className="stat-label">{tab.label}</div>
                <div className="stat-value">{tab.count}</div>
              </div>
            ))}
          </div>

          <div className="admin-dashboard-tabs">
            {tabDefinitions.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`admin-dashboard-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="admin-dashboard-tab-label">{tab.label}</span>
                <span className="admin-dashboard-tab-count">{tab.count}</span>
              </button>
            ))}
          </div>

          {renderTabContent()}
        </div>
      </div>
      {showPrintPreview && (
        <div className="print-preview-modal visible" role="dialog" aria-modal="true">
          <div className="print-preview-backdrop" onClick={() => setShowPrintPreview(false)} />
          <div className="print-preview-content">
            <div className="print-preview-toolbar">
              <button type="button" className="admin-action-btn admin-action-secondary" onClick={() => setShowPrintPreview(false)}>
                Close Preview
              </button>
              <button type="button" className="admin-action-btn" onClick={handlePrintFromPreview}>
                Save to PDF
              </button>
            </div>
            <PrintHandler
              logoUrl={logoUrl}
              heading={printHeading}
              printUrl={printUrl}
              printTimestamp={printTimestamp}
              items={printItems}
              columns={printColumns}
              printScope={printScope}
              selectedIds={printSelectedIds}
              preview
            />
          </div>
        </div>
      )}

      {detailRecord && typeof document !== 'undefined' && createPortal(
        <DetailRecordModal
          logoUrl={logoUrl}
          heading={detailRecordHeading}
          item={detailRecord}
          columns={detailRecordColumns}
          onClose={closeDetailRecord}
          onPrint={printDetailRecord}
        />,
        document.body
      )}

    </main>
  );
}
