function PrivacyModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card privacy-modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-body">
          <div className="modal-header">
            <div>
              <p className="eyebrow">Privacy notice</p>
              <h3>How Flourish Tendercare uses your data</h3>
            </div>
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close privacy notice">
              ×
            </button>
          </div>

          <div className="privacy-content">
            <p>
              We use the information you share through our contact form, admission enquiries, or survey submissions only to reply to your questions, manage school communications, and improve the experience on our website.
            </p>
            <p>
              We do not sell, rent, or share your personal information with third-party advertisers or marketing partners. Any information you send may be handled by our school team and trusted service providers that help us run email, support, and secure storage services.
            </p>
            <p>
              We also store your privacy preference in your browser so the site can remember that you have reviewed this notice and keep the experience consistent on future visits.
            </p>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyModal;
