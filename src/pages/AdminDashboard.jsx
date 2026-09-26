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
  fetchAdminTestimonials,
  fetchSentEmails,
  fetchSurveyResponses,
  fetchTestimonials,
  getCurrentSession,
  saveSentEmail,
  setTestimonialPublished,
  supabase,
  updateSentEmail,
} from '../lib/supabaseClient';
import {
  Mail,
  FileText,
  MessageCircle,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Menu,
  Globe,
  Instagram,
  Linkedin,
  Facebook,
  MapPin,
  Phone,
  ArrowRight,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  AlignLeft,
  AlignCenter,
  Quote,
  Undo2,
  Redo2,
  Heading1,
  Trash2,
} from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import PrintHandler from '../components/PrintHandler';
import logoUrl from '../Public/logo/logo1.jpeg';

let hasShownSupabaseWarning = false;

const splitEmailList = (value) => [...new Set(String(value || '')
  .split(/[,;\n]+/)
  .map((item) => item.trim())
  .filter(Boolean))];

const isEmailAddress = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const sentEmailFromRecord = (record) => ({
  id: record.id,
  supabaseId: record.id,
  to: (record.recipients || []).join(', '),
  cc: (record.cc || []).join(', '),
  subject: record.subject,
  body: record.html_body || '',
  ctaLabel: record.metadata?.ctaLabel || 'Visit website',
  ctaLink: record.metadata?.ctaLink || '',
  sentAt: record.sent_at || record.created_at,
  status: record.status,
});

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

function DetailRecordModal({ logoUrl, heading, item, columns, onClose, onPrint, onTogglePublish }) {
  const [showAllFields, setShowAllFields] = useState(false);
  const visibleColumns = showAllFields ? columns : columns.slice(0, 8);
  const hiddenCount = Math.max(0, columns.length - 8);
  const canTogglePublish = Boolean(onTogglePublish);

  return (
    <div className="detail-record-modal" role="dialog" aria-modal="true" aria-label="Record details">
      <div className="detail-record-backdrop" onClick={onClose} />
      <div className="detail-record-card">
        <div className="detail-record-letterhead">
          <div className="detail-record-letterhead-branding">
            <a href="/" aria-label="Go to Flourish Tender Care home">
              <img src={logoUrl} alt="Flourish Tender Care" className="detail-record-letterhead-logo" />
            </a>
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
            {canTogglePublish && (
              <button
                type="button"
                className="admin-action-btn"
                onClick={() => onTogglePublish(item)}
              >
                {item?.is_published ? 'Unpublish testimonial' : 'Publish to testimonial slider'}
              </button>
            )}
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

function DataTable({ title, items, columns, emptyText, rowSelection, rowActions, printScope, detailHeading, onDetail }) {
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
                          <button
                            type="button"
                            className="admin-table-detail-trigger"
                            onClick={() => onDetail?.(item, detailHeading, columns)}
                            aria-label={`View ${column.label} details`}
                          >
                            <span className="admin-table-cell-content">{value}</span>
                          </button>
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
                            {typeof button.label === 'function' ? button.label(item) : button.label}
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
  const [emailBody, setEmailBody] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [carbonCopyEmails, setCarbonCopyEmails] = useState('');
  const [ctaLabel, setCtaLabel] = useState('Visit our website');
  const [ctaLink, setCtaLink] = useState('https://flourishtendercare.com.ng');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);
  const [emailPendingDelete, setEmailPendingDelete] = useState(null);
  const [deletingSentEmail, setDeletingSentEmail] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState('https://');
  const { addToast } = useToast();
  const { isMobile } = useResponsive();
  const [surveys, setSurveys] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedSurveyIds, setSelectedSurveyIds] = useState(new Set());
  const [selectedContactIds, setSelectedContactIds] = useState(new Set());
  const [selectedTestimonialIds, setSelectedTestimonialIds] = useState(new Set());
  const [previewedTestimonialIds, setPreviewedTestimonialIds] = useState(new Set());
  const [classFilter, setClassFilter] = useState('All');
  const [printScope, setPrintScope] = useState('all');
  const [printTimestamp, setPrintTimestamp] = useState('');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);
  const [detailRecordHeading, setDetailRecordHeading] = useState('');
  const [detailRecordColumns, setDetailRecordColumns] = useState([]);
  const [testimonialAction, setTestimonialAction] = useState(null);
  const [processingTestimonialAction, setProcessingTestimonialAction] = useState(false);
  const [isDetailPrinting, setIsDetailPrinting] = useState(false);
  const printUrl = typeof window !== 'undefined' ? window.location.origin : 'https://flourishtendercare.com.ng';
  const [supabaseReady, setSupabaseReady] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const refreshData = async () => {
    setLoading(true);

    const [surveyResult, contactResult, testimonialResult, sentEmailResult] = await Promise.all([
      fetchSurveyResponses(),
      fetchContactMessages(),
      fetchAdminTestimonials(),
      fetchSentEmails(),
    ]);

    if (surveyResult.error || contactResult.error || testimonialResult.error || sentEmailResult.error) {
      const message = 'Unable to load dashboard data. Confirm Supabase is configured and that the tables exist.';
      addToast(message, { type: 'error', duration: 5000 });
    }

    setSurveys(surveyResult.data || []);
    setContacts(contactResult.data || []);
    setTestimonials(testimonialResult.data || []);
    setSentEmails((sentEmailResult.data || []).map(sentEmailFromRecord));
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

  const handlePublishTestimonial = (item) => {
    if (!item.is_published && !previewedTestimonialIds.has(item.id)) {
      addToast('Preview the testimonial before publishing it.', { type: 'error', duration: 5000 });
      return;
    }
    setTestimonialAction({ kind: item.is_published ? 'unpublish' : 'publish', item });
  };

  const confirmTestimonialAction = async () => {
    if (!testimonialAction) return;
    const { kind, item } = testimonialAction;
    setProcessingTestimonialAction(true);
    try {
      if (kind === 'delete' || kind === 'delete-selected') {
        const items = kind === 'delete-selected' ? testimonialAction.items : [item];
        const ids = items.map((testimonial) => testimonial.id);
        const { error } = kind === 'delete-selected'
          ? await deleteTestimonials(ids)
          : await deleteTestimonial(item.id);
        if (error) throw error;
        setTestimonials((current) => current.filter((testimonial) => !ids.includes(testimonial.id)));
        setSelectedTestimonialIds((current) => new Set([...current].filter((id) => !ids.includes(id))));
        if (detailRecord && ids.includes(detailRecord.id)) closeDetailRecord();
        addToast(kind === 'delete-selected' ? 'Selected testimonials deleted.' : 'Testimonial deleted.', { type: 'success', duration: 4000 });
      } else {
        const isPublished = kind === 'publish';
        const { error } = await setTestimonialPublished(item.id, isPublished);
        if (error) throw error;
        setTestimonials((current) => current.map((testimonial) => (
          testimonial.id === item.id ? { ...testimonial, is_published: isPublished } : testimonial
        )));
        setDetailRecord((current) => (current?.id === item.id ? { ...current, is_published: isPublished } : current));
        addToast(isPublished ? 'Testimonial published to the slider.' : 'Testimonial unpublished from the slider.', { type: 'success', duration: 4000 });
      }
      setTestimonialAction(null);
    } catch (error) {
      addToast(error.message || 'Unable to update testimonial.', { type: 'error', duration: 5000 });
    } finally {
      setProcessingTestimonialAction(false);
    }
  };

  const handleResendEmail = (entry) => {
    setEmailSubject(entry.subject || 'Admin dashboard notification');
    setEmailBody('');
    setRecipientEmail(entry.to || '');
    setCarbonCopyEmails(entry.cc || '');
    setCtaLabel(entry.ctaLabel || 'Visit our website');
    setCtaLink(entry.ctaLink || 'https://flourishtendercare.com.ng');
    setActiveTab('email');
    addToast('Fresh branded email loaded into the composer. You can edit it before sending again.', { type: 'success', duration: 4000 });
  };

  const handleDeleteSentEmail = async () => {
    if (!emailPendingDelete) return;
    setDeletingSentEmail(true);
    try {
      if (emailPendingDelete.supabaseId) {
        const { error } = await deleteSentEmail(emailPendingDelete.supabaseId);
        if (error) throw error;
      }

      setSentEmails((current) => current.filter((entry) => entry.id !== emailPendingDelete.id));
      setEmailPendingDelete(null);
      addToast('Email removed from saved history.', { type: 'success', duration: 4000 });
    } catch (error) {
      addToast(error.message || 'Unable to delete saved email.', { type: 'error', duration: 5000 });
    } finally {
      setDeletingSentEmail(false);
    }
  };

  const sendEmailNotification = async (event) => {
    event.preventDefault();

    const recipients = splitEmailList(recipientEmail);
    const carbonCopies = splitEmailList(carbonCopyEmails);
    if (!recipients.length) {
      addToast('A recipient email is required to send a custom client email.', { type: 'error' });
      return;
    }
    if ([...recipients, ...carbonCopies].some((address) => !isEmailAddress(address))) {
      addToast('Enter valid email addresses separated by commas, semicolons, or new lines.', { type: 'error' });
      return;
    }
    if (!emailSubject.trim() || !emailBody.trim()) {
      addToast('Subject and body are required to send the notification.', { type: 'error' });
      return;
    }

    setSendingEmail(true);
    let pendingRecord = null;
    let emailSent = false;
    try {
      const callToActionLabel = ctaLabel.trim() || 'Visit our website';
      const callToActionLink = ctaLink.trim() || 'https://flourishtendercare.com.ng';
      const { data: savedRecord, error: saveError } = await saveSentEmail({
        email_type: 'manual',
        sender_email: session?.user?.email || 'admin@flourishtendercare.com.ng',
        recipients,
        cc: carbonCopies,
        subject: emailSubject.trim(),
        html_body: emailBody,
        text_body: emailBody
          .replace(/<br\s*\/?>(\s*)/gi, '\n')
          .replace(/<\/(p|div|li)>/gi, '\n')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/gi, ' ')
          .replace(/[ \t]+/g, ' ')
          .trim(),
        metadata: { ctaLabel: callToActionLabel, ctaLink: callToActionLink },
        status: 'pending',
      });
      if (saveError) throw new Error('Email was not sent because its history could not be saved to Supabase.');
      pendingRecord = savedRecord;

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipients,
          cc: carbonCopies,
          subject: emailSubject,
          body: emailBody,
          ctaLabel: callToActionLabel,
          ctaLink: callToActionLink,
        }),
      });

      const responseText = await response.text();
      let result = {};
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        result = {};
      }
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send notification email.');
      }
      emailSent = true;
      const sentAt = new Date().toISOString();
      const { data: updatedRecord, error: updateError } = await updateSentEmail(pendingRecord.id, {
        status: 'sent',
        provider_message_id: result.providerMessageId || null,
        sent_at: sentAt,
      });

      const sentEmail = {
        id: pendingRecord.id,
        supabaseId: pendingRecord.id,
        to: recipients.join(', '),
        cc: carbonCopies.join(', '),
        subject: emailSubject.trim(),
        body: emailBody,
        ctaLabel: ctaLabel.trim() || 'Visit our website',
        ctaLink: ctaLink.trim() || 'https://flourishtendercare.com.ng',
        sentAt,
        status: updatedRecord?.status || (updateError ? 'pending' : 'sent'),
      };

      setSentEmails((current) => [sentEmail, ...current.filter((entry) => entry.id !== pendingRecord.id)].slice(0, 100));
      addToast(
        updateError ? 'Email sent and saved, but its delivery status could not be updated.' : 'Client email sent successfully.',
        { type: updateError ? 'error' : 'success', duration: 5000 }
      );
      setRecipientEmail('');
      setCarbonCopyEmails('');
    } catch (error) {
      if (pendingRecord && !emailSent) {
        const { data: failedRecord } = await updateSentEmail(pendingRecord.id, {
          status: 'failed',
          error: error.message || 'Email send failed.',
        });
        const failedEmail = sentEmailFromRecord(failedRecord || { ...pendingRecord, status: 'failed' });
        setSentEmails((current) => [failedEmail, ...current.filter((entry) => entry.id !== pendingRecord.id)].slice(0, 100));
      }
      addToast(error.message || 'Failed to send notification email.', { type: 'error', duration: 5000 });
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

  const handleDeleteTestimonial = (item) => {
    setTestimonialAction({ kind: 'delete', item });
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
    if (activeTab === 'messages') {
      const items = testimonials.filter((testimonial) => selectedTestimonialIds.has(testimonial.id));
      setTestimonialAction({ kind: 'delete-selected', items });
      return;
    }
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
      { key: 'is_published', label: 'Status', render: (item) => item.is_published ? 'Published' : 'Awaiting review' },
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
      { key: 'messages', label: 'Testimonials', count: testimonials.filter((item) => !item.is_published).length, subtitle: 'Review pending submissions' },
      { key: 'email', label: 'Email', count: 0, subtitle: 'Compose and send a branded email' },
      { key: 'sent-email', label: 'Sent Email', count: sentEmails.length, subtitle: 'Emails sent from this dashboard' },
    ],
    [contacts.length, surveys.length, testimonials.length, sentEmails.length]
  );

  const applyRichTextFormat = (command, value = null) => {
    if (typeof document === 'undefined') return;
    const editor = document.getElementById('email-message-editor');
    if (editor) {
      editor.focus();
    }
    document.execCommand(command, false, value);
    if (editor) {
      setEmailBody(editor.innerHTML);
    }
  };

  const openLinkModal = () => {
    setLinkUrlInput('https://');
    setLinkModalOpen(true);
  };

  const confirmLinkInsert = () => {
    const trimmedUrl = linkUrlInput.trim();
    if (!trimmedUrl) {
      addToast('Please provide a valid website link.', { type: 'error', duration: 3000 });
      return;
    }

    applyRichTextFormat('createLink', trimmedUrl);
    setLinkModalOpen(false);
    setLinkUrlInput('https://');
  };

  const socialLinks = useMemo(() => [
    { label: 'Facebook', href: 'https://facebook.com/flourishtendercare1', icon: Facebook },
    { label: 'Instagram', href: 'https://instagram.com/flourishtendercare1', icon: Instagram },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/flourishtendercare1', icon: Linkedin },
    { label: 'Website', href: 'https://flourishtendercare.com.ng', icon: Globe },
  ], []);

  const renderEmailComposer = () => (
    <section className="admin-dashboard-tab-panel admin-email-notification" style={{ display: 'grid', gap: '1.25rem' }}>
      <div style={{ background: '#f3f6f5', border: '1px solid rgba(11, 95, 85, 0.15)', borderRadius: '18px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', padding: '0.75rem 0.9rem 0', background: '#eef3f2' }}>
          {['Compose Email', 'Send Email'].map((item, index) => (
            <button
              key={item}
              type="button"
              style={{
                border: 'none',
                borderRadius: index === 0 ? '10px 10px 0 0' : '10px',
                padding: '0.7rem 1rem',
                background: index === 0 ? '#ffffff' : '#edf5f3',
                color: index === 0 ? '#123a3a' : '#375266',
                fontWeight: 700,
                boxShadow: index === 0 ? '0 -1px 0 rgba(11,95,85,0.08)' : 'none',
                cursor: 'pointer',
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '1rem', padding: '1rem', background: '#ffffff' }}>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ display: 'grid', gap: '0.5rem', color: '#1a2e2f', fontWeight: 700 }}>
              Email Subject
              <input type="text" value={emailSubject} onChange={(event) => setEmailSubject(event.target.value)} style={{ ...styles.input, borderColor: 'rgba(11,95,85,0.2)', background: '#f8fbfa', borderRadius: '12px' }} />
            </label>
          </div>

          <div style={{ display: 'grid', gap: '0.6rem' }}>
            <label style={{ display: 'grid', gap: '0.5rem', color: '#1a2e2f', fontWeight: 700 }}>
              Email message
            </label>

            <div style={{ border: '1px solid rgba(11,95,85,0.2)', borderRadius: '16px', overflow: 'hidden', background: '#f8fbfa' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.7rem 0.8rem', borderBottom: '1px solid rgba(11,95,85,0.12)', background: '#edf3f2' }}>
                {[
                  { action: 'bold', label: 'Bold', icon: Bold },
                  { action: 'italic', label: 'Italic', icon: Italic },
                  { action: 'underline', label: 'Underline', icon: Underline },
                  { action: 'formatBlock', value: 'h1', label: 'Heading', icon: Heading1 },
                  { action: 'insertUnorderedList', label: 'Bullet list', icon: List },
                  { action: 'insertOrderedList', label: 'Numbered list', icon: ListOrdered },
                  { action: 'justifyLeft', label: 'Align left', icon: AlignLeft },
                  { action: 'justifyCenter', label: 'Align center', icon: AlignCenter },
                  { action: 'formatBlock', value: 'blockquote', label: 'Quote', icon: Quote },
                  { action: 'createLink', label: 'Link', icon: Link2 },
                  { action: 'undo', label: 'Undo', icon: Undo2 },
                  { action: 'redo', label: 'Redo', icon: Redo2 },
                ].map(({ action, label, icon: Icon, value }) => (
                  <button
                    key={label}
                    type="button"
                    title={label}
                    aria-label={label}
                    onClick={() => {
                      if (action === 'createLink') {
                        openLinkModal();
                        return;
                      }
                      applyRichTextFormat(action, value ?? null);
                    }}
                    style={{
                      border: '1px solid rgba(11,95,85,0.18)',
                      background: '#fff',
                      borderRadius: '8px',
                      padding: '0.5rem 0.7rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#183a41',
                    }}
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>

              <div
                id="email-message-editor"
                contentEditable
                suppressContentEditableWarning
                onInput={(event) => setEmailBody(event.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: emailBody || '<p>Here is an important update from the admin dashboard.</p>' }}
                style={{
                  minHeight: '180px',
                  padding: '1rem',
                  lineHeight: 1.7,
                  color: '#20333f',
                  fontSize: '1rem',
                  outline: 'none',
                  background: '#ffffff',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <label style={{ display: 'grid', gap: '0.5rem', color: '#1a2e2f', fontWeight: 700 }}>
              Recipient email
              <input type="text" value={recipientEmail} onChange={(event) => setRecipientEmail(event.target.value)} placeholder="family@example.com, parent@example.com" style={{ ...styles.input, borderColor: 'rgba(11,95,85,0.2)', background: '#f8fbfa' }} />
            </label>

            <label style={{ display: 'grid', gap: '0.5rem', color: '#1a2e2f', fontWeight: 700 }}>
              CC emails
              <input type="text" value={carbonCopyEmails} onChange={(event) => setCarbonCopyEmails(event.target.value)} placeholder="Optional copied emails" style={{ ...styles.input, borderColor: 'rgba(11,95,85,0.2)', background: '#f8fbfa' }} />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <label style={{ display: 'grid', gap: '0.5rem', color: '#1a2e2f', fontWeight: 700 }}>
              Button label
              <input type="text" value={ctaLabel} onChange={(event) => setCtaLabel(event.target.value)} placeholder="Visit our website" style={{ ...styles.input, borderColor: 'rgba(11,95,85,0.2)', background: '#f8fbfa' }} />
            </label>

            <label style={{ display: 'grid', gap: '0.5rem', color: '#1a2e2f', fontWeight: 700 }}>
              Button link
              <input type="url" value={ctaLink} onChange={(event) => setCtaLink(event.target.value)} placeholder="https://flourishtendercare.com.ng" style={{ ...styles.input, borderColor: 'rgba(11,95,85,0.2)', background: '#f8fbfa' }} />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button type="submit" className="admin-action-btn" style={{ ...styles.button, ...styles.primaryButton, width: 'min(100%, 260px)', minHeight: '48px' }} disabled={sendingEmail} aria-busy={sendingEmail} onClick={(event) => sendEmailNotification(event)}>
              {sendingEmail && <span className="btn-spinner" aria-hidden="true" />}
              {sendingEmail ? 'SENDING...' : 'SEND EMAIL'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ borderRadius: '22px', overflow: 'hidden', border: '1px solid rgba(11,95,85,0.15)', background: '#f8fbfa', boxShadow: '0 18px 40px rgba(11,95,85,0.08)' }}>
        <div style={{ background: 'linear-gradient(135deg, #0b5f55 0%, #1d7c72 100%)', padding: '1.6rem 1rem 1.1rem', textAlign: 'center', color: '#fff' }}>
          <img src={logoUrl} alt="Flourish Tender Care" style={{ width: '88px', height: '88px', objectFit: 'cover', borderRadius: '22px', border: '2px solid rgba(255,255,255,0.25)', background: '#fff', padding: '5px' }} />
          <div style={{ marginTop: '0.8rem', fontSize: '0.72rem', letterSpacing: '0.22rem', fontWeight: 800, opacity: 0.9 }}>FLOURISH TENDER CARE</div>
          <h4 style={{ margin: '0.85rem 0 0', fontSize: 'clamp(1.5rem, 2vw, 2.5rem)', fontWeight: 800, textAlign: 'center' }}>{emailSubject || 'Admin dashboard notification'}</h4>
        </div>

        <div style={{ background: '#ffffff', padding: '1.6rem 1.2rem 1.3rem', color: '#1d2f38' }}>
          <div dangerouslySetInnerHTML={{ __html: emailBody || '<p>Here is an important update from the admin dashboard.</p>' }} style={{ fontSize: '1rem', lineHeight: 1.8 }} />
          {ctaLink && (
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <a
                href={ctaLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #d91c7d 0%, #c23087 100%)',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '0.9rem 1.4rem',
                  borderRadius: '999px',
                  fontWeight: 700,
                  boxShadow: '0 12px 24px rgba(217, 28, 125, 0.18)',
                }}
              >
                {ctaLabel}
                <ArrowRight size={16} />
              </a>
            </div>
          )}
        </div>

        <div style={{ background: '#edf5f2', padding: '1.15rem 1rem 1.5rem', borderTop: '1px solid rgba(11,95,85,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2.2rem', height: '2.2rem', borderRadius: '50%', background: '#ffffff', color: '#0b5f55', border: '1px solid rgba(11,95,85,0.12)' }}>
                <Icon size={16} />
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.9rem' }}>
            <a
              href={ctaLink || 'https://flourishtendercare.com.ng'}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #d91c7d 0%, #c23087 100%)',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.8rem 1.2rem',
                borderRadius: '999px',
                fontWeight: 700,
                boxShadow: '0 12px 24px rgba(217, 28, 125, 0.18)',
              }}
            >
              {ctaLabel || 'Visit website'}
              <ArrowRight size={16} />
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', color: '#3d5d6b', fontSize: '0.82rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} /> Peaceville Estate, Badore, Ajah</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={14} /> +234 803 738 3820</span>
          </div>
        </div>
      </div>
    </section>
  );

  const renderSentEmailTab = () => (
    <section className="admin-dashboard-tab-panel" style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Sent email</h3>
          <p style={{ margin: '0.6rem 0 0', color: 'var(--text-muted)', lineHeight: 1.6 }}>All emails sent from this dashboard are listed here for quick review.</p>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#46656d', background: '#edf6f4', borderRadius: '999px', padding: '0.35rem 0.7rem' }}>{sentEmails.length} saved</span>
      </div>

      {sentEmails.length === 0 ? (
        <div style={{ background: '#ffffff', border: '1px solid rgba(11,95,85,0.1)', borderRadius: '16px', padding: '1rem' }}>
          <p style={{ margin: 0, color: '#56707a', lineHeight: 1.6 }}>No emails have been sent yet. Once a message is sent, it will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          {sentEmails.map((entry) => (
            <article key={entry.id} style={{ background: '#ffffff', border: '1px solid rgba(11,95,85,0.12)', borderRadius: '16px', padding: '1rem', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                <strong style={{ color: '#123a3a', fontSize: '1rem' }}>{entry.subject}</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#46656d', fontSize: '0.78rem' }}>{new Date(entry.sentAt).toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => setEmailPendingDelete(entry)}
                    aria-label={`Delete email: ${entry.subject}`}
                    title="Delete email"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', border: '1px solid #f1b5b5', background: '#fff5f5', color: '#a61b1b', borderRadius: '8px', padding: '0.4rem 0.6rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>
              <div style={{ color: '#47626a', fontSize: '0.85rem', marginBottom: '0.5rem' }}>To: {entry.to}{entry.cc ? ` • CC: ${entry.cc}` : ''}</div>
              <div dangerouslySetInnerHTML={{ __html: entry.body || '<p></p>' }} style={{ color: '#1d2f38', lineHeight: 1.7, fontSize: '0.95rem' }} />
              {entry.ctaLink && (
                <div style={{ marginTop: '0.9rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <a
                      href={entry.ctaLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        background: 'linear-gradient(135deg, #d91c7d 0%, #c23087 100%)',
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '0.7rem 1.1rem',
                        borderRadius: '999px',
                        fontWeight: 700,
                        boxShadow: '0 10px 20px rgba(217, 28, 125, 0.15)',
                      }}
                    >
                      {entry.ctaLabel || 'Visit website'}
                      <ArrowRight size={16} />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleResendEmail(entry)}
                      style={{
                        border: 'none',
                        background: '#edf5f3',
                        color: '#123a3a',
                        borderRadius: '999px',
                        padding: '0.7rem 1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Resend email
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );

  const renderTabContent = () => {
    if (activeTab === 'email') {
      return renderEmailComposer();
    }

    if (activeTab === 'sent-email') {
      return renderSentEmailTab();
    }

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
            detailHeading="Survey submission details"
            onDetail={openDetailRecord}
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
            emptyText="No testimonials have been submitted yet."
            rowSelection={{ selectedIds: selectedTestimonialIds, onToggle: toggleSelectTestimonial }}
            detailHeading="Testimonial details"
            onDetail={openDetailRecord}
            rowActions={{
              header: 'Actions',
              buttons: [
                {
                  key: 'view',
                  label: 'Preview',
                  variant: 'primary',
                  onClick: (item) => {
                    setPreviewedTestimonialIds((current) => new Set([...current, item.id]));
                    openDetailRecord(item, 'Testimonial details', testimonialColumns);
                  },
                },
                {
                  key: 'toggle-publish',
                  label: (item) => item.is_published ? 'Unpublish' : 'Publish',
                  onClick: handlePublishTestimonial,
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  onClick: (item) => handleDeleteTestimonial(item),
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
          detailHeading="Visitor record details"
          onDetail={openDetailRecord}
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

            <button type="submit" className="admin-action-btn" style={{ ...styles.button, ...styles.primaryButton, width: 'fit-content' }} disabled={sendingEmail} aria-busy={sendingEmail}>
              {sendingEmail && <span className="btn-spinner" aria-hidden="true" />}
              {sendingEmail ? 'SENDING...' : 'SEND NOTIFICATION'}
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
                <a href="/" aria-label="Go to Flourish Tender Care home">
                  <img src={logoUrl} alt="School logo" className="mobile-nav-logo" />
                </a>
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
                <span className="admin-dashboard-tab-count">{tab.count > 0 ? tab.count : <Mail size={14} />}</span>
              </button>
            ))}
          </div>

          {renderTabContent()}
        </div>
      </div>

      {linkModalOpen && (
        <div className="link-modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.56)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
          <div style={{ width: 'min(100%, 560px)', background: '#1b1a2a', borderRadius: '18px', boxShadow: '0 20px 45px rgba(15, 23, 42, 0.32)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.4rem 1.3rem 1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.95rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#f3f4f6', fontSize: '1.1rem' }}>Add link</h3>
                <p style={{ margin: '0.4rem 0 0', color: '#d7d8df', fontSize: '0.9rem' }}>Paste the URL for this link.</p>
              </div>
            </div>

            <input
              type="url"
              value={linkUrlInput}
              onChange={(event) => setLinkUrlInput(event.target.value)}
              autoFocus
              placeholder="https://"
              style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: '#2a2940', color: '#fff', padding: '0.9rem 1rem', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                style={{ border: 'none', background: '#c7b9ef', color: '#1d1832', borderRadius: '999px', padding: '0.7rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLinkInsert}
                style={{ border: 'none', background: '#8d7ae8', color: '#fff', borderRadius: '999px', padding: '0.7rem 1.4rem', fontWeight: 700, cursor: 'pointer' }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {emailPendingDelete && (
        <div
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget && !deletingSentEmail) setEmailPendingDelete(null);
          }}
          style={{ position: 'fixed', inset: 0, zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(15, 23, 42, 0.56)' }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="delete-sent-email-title" style={{ width: 'min(100%, 440px)', background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.3rem', boxShadow: '0 24px 64px rgba(15, 23, 42, 0.28)' }}>
            <h3 id="delete-sent-email-title" style={{ margin: 0, fontSize: '1.1rem' }}>Delete saved email?</h3>
            <p style={{ margin: '0.7rem 0 0', color: 'var(--text-muted)', lineHeight: 1.55 }}>
              “{emailPendingDelete.subject}” will be removed from saved history. This does not recall the email from recipients.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.2rem' }}>
              <button type="button" onClick={() => setEmailPendingDelete(null)} disabled={deletingSentEmail} style={{ ...styles.button, ...styles.secondaryButton }}>
                Cancel
              </button>
              <button type="button" onClick={handleDeleteSentEmail} disabled={deletingSentEmail} style={{ ...styles.button, background: '#b42318', color: '#fff', opacity: deletingSentEmail ? 0.7 : 1 }}>
                {deletingSentEmail ? 'Deleting...' : 'Delete email'}
              </button>
            </div>
          </section>
        </div>
      )}

      {testimonialAction && (
        <div
                  role="presentation"
                  onClick={(event) => {
                    if (event.target === event.currentTarget && !processingTestimonialAction) setTestimonialAction(null);
                  }}
                  style={{ position: 'fixed', inset: 0, zIndex: 10002, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(15, 23, 42, 0.56)' }}
                >
                  <section role="dialog" aria-modal="true" aria-labelledby="testimonial-action-title" style={{ width: 'min(100%, 440px)', background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.3rem', boxShadow: '0 24px 64px rgba(15, 23, 42, 0.28)' }}>
                    <h3 id="testimonial-action-title" style={{ margin: 0, fontSize: '1.1rem' }}>
                      {testimonialAction.kind === 'delete-selected'
                        ? `Delete ${testimonialAction.items.length} selected testimonials?`
                        : testimonialAction.kind === 'delete'
                          ? 'Delete testimonial?'
                          : testimonialAction.kind === 'publish'
                            ? 'Publish testimonial?'
                            : 'Unpublish testimonial?'}
                    </h3>
                    <p style={{ margin: '0.7rem 0 0', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                      {testimonialAction.kind === 'delete-selected'
                        ? `${testimonialAction.items.length} selected testimonials will be permanently removed.`
                        : testimonialAction.kind === 'delete'
                        ? `“${testimonialAction.item.name}” will be permanently removed.`
                        : testimonialAction.kind === 'publish'
                          ? `“${testimonialAction.item.name}” will appear in the public testimonial slider.`
                          : `“${testimonialAction.item.name}” will be hidden from the public testimonial slider.`}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1.2rem' }}>
                      <button type="button" onClick={() => setTestimonialAction(null)} disabled={processingTestimonialAction} style={{ ...styles.button, ...styles.secondaryButton }}>
                        Cancel
                      </button>
                      <button type="button" onClick={confirmTestimonialAction} disabled={processingTestimonialAction} style={{ ...styles.button, background: testimonialAction.kind.startsWith('delete') ? '#b42318' : 'var(--accent-strong)', color: '#fff', opacity: processingTestimonialAction ? 0.7 : 1 }}>
                        {processingTestimonialAction ? 'Working...' : testimonialAction.kind.startsWith('delete') ? 'Delete' : testimonialAction.kind === 'publish' ? 'Publish' : 'Unpublish'}
                      </button>
                    </div>
                  </section>
                </div>
              )}

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
          onTogglePublish={detailRecordHeading === 'Testimonial details' ? handlePublishTestimonial : undefined}
        />,
        document.body
      )}

    </main>
  );
}
