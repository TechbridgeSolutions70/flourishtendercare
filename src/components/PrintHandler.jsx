import { useMemo } from 'react';

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

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

export default function PrintHandler({
  logoUrl,
  heading,
  printUrl,
  printTimestamp,
  items,
  columns,
  printScope,
  selectedIds,
  preview = false,
}) {
  const visibilityClass = preview ? 'print-preview-screen' : '';
  const printableItems = useMemo(() => {
    if (printScope !== 'selected' || !selectedIds?.size) {
      return items;
    }
    const selectedSet = selectedIds instanceof Set ? selectedIds : new Set(selectedIds);
    return items.filter((item) => selectedSet.has(item.id ?? item['id']));
  }, [items, printScope, selectedIds]);

  const scopeLabel = printScope === 'selected' && selectedIds?.size
    ? `Selected rows (${selectedIds.size})`
    : 'All rows';

  return (
    <section className={`admin-print-layout ${visibilityClass}`}>
      <div className="admin-print-header">
        <img src={logoUrl} alt="School logo" className="admin-print-logo" />
        <div className="admin-print-branding">
          <h1>Flourish Tender Care</h1>
          <p>123 Flourish Drive, Ikorodu, Lagos, Nigeria</p>
          <p>Phone: +234 803 738 3820 | Email: admin@flourishtendercare.com.ng</p>
        </div>
        <div className="admin-print-document-title">
          <strong>{heading}</strong>
        </div>
      </div>

      <div className="admin-print-document-summary">
        <div>
          <strong>Report</strong>
          <div>{heading}</div>
        </div>
        <div>
          <strong>Scope</strong>
          <div>{scopeLabel}</div>
        </div>
        <div>
          <strong>Records</strong>
          <div>{printableItems.length}</div>
        </div>
        <div>
          <strong>Printed</strong>
          <div>{printTimestamp || new Date().toLocaleString()}</div>
        </div>
      </div>

      <div className="admin-print-body">
        {printableItems.length === 0 ? (
          <p className="admin-print-empty">No records are available for printing.</p>
        ) : (
          printableItems.map((item, index) => (
            <article className="admin-print-record" key={item.id ?? index}>
              <div className="admin-print-record-header">
                <span>Record {index + 1}</span>
                {item.created_at && <span>{formatDate(item.created_at)}</span>}
              </div>
              <div className="admin-print-record-grid-wrapper">
                <dl className="admin-print-record-grid">
                  {columns.map((column) => (
                    <div className="admin-print-record-row" key={column.key}>
                      <dt>{column.label}</dt>
                      <dd>{formatFieldValue(item, column)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="admin-print-footer">
        <div className="print-footer-left">{printUrl}</div>
        <div className="print-footer-right">Printed: {printTimestamp || new Date().toLocaleString()}</div>
      </div>
    </section>
  );
}
