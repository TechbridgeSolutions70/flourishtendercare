const availableFiles = import.meta.glob('../Public/downloaded files/**/*.*', {
  eager: true,
  query: '?url',
  import: 'default',
});
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import TestimonialSection from './TestimonialSection';

export default function HeroPostSection() {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const downloads = useMemo(() => {
    return Object.entries(availableFiles)
      .map(([path, url]) => {
        const name = path.split('/').pop();
        const extension = name?.split('.').pop()?.toLowerCase();
        return {
          name,
          url,
          type: extension === 'pdf' ? 'pdf' : 'image',
        };
      })
      .sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type.localeCompare(b.type);
      });
  }, []);

  const pdfFiles = downloads.filter((file) => file.type === 'pdf');
  const imageFiles = downloads.filter((file) => file.type === 'image');

  const openDownloads = () => {
    setSelectedFile(downloads[0] ?? null);
    setDownloadModalOpen(true);
  };

  return (
    <div>
      <section className="section hero-admissions-banner">
        <div className="hero-admissions-shell">
          <div className="hero-admissions-copy">
            <p className="eyebrow">Admissions in progress — 2026/2027</p>
            <h2>Apply for the 2026/2027 Academic Session</h2>
            <p>
              Admission into Flourish Tender Care is now open. Entrance examinations date will be communicated soon. Stay tuned to all our communications channels for updates and ensure your child secures a place in our nurturing learning environment.
            </p>
            <div className="hero-admissions-actions">
              <button type="button" className="btn btn-secondary" onClick={openDownloads}>
                Download application form
              </button>
              <button type="button" className="btn btn-secondary" onClick={openDownloads}>
                Download Fees
              </button>
              <a className="btn btn-primary" href="https://portal.flourishtendercare.com.ng/apply" target="_blank" rel="noreferrer">
                Register online
              </a>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  window.history.pushState({}, '', '/survey');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              >
                Take a survey
              </button>
            </div>
          </div>
        </div>
      </section>

      {testimonialModalOpen && (
        <TestimonialSection modalMode onClose={() => setTestimonialModalOpen(false)} />
      )}

      {downloadModalOpen && createPortal(
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setDownloadModalOpen(false)}>
          <div className="modal-card modal-full" onClick={(event) => event.stopPropagation()}>
            <div className="modal-body">
              <div className="modal-header">
                <div>
                  <h3>Download Student Resources</h3>
                  <p>Select a file to preview and then download it.</p>
                </div>
                <button type="button" className="modal-close" onClick={() => setDownloadModalOpen(false)} aria-label="Close modal">
                  ×
                </button>
              </div>

              <div className="download-preview">
                {selectedFile ? (
                  selectedFile.type === 'image' ? (
                    <img src={selectedFile.url} alt={selectedFile.name} />
                  ) : (
                    <iframe
                      title={selectedFile.name}
                      src={selectedFile.url}
                      sandbox="allow-same-origin allow-scripts"
                    />
                  )
                ) : (
                  <div className="preview-empty">
                    <strong>No file selected.</strong> Click any item below to see a quick preview.
                  </div>
                )}
              </div>

              {pdfFiles.length > 0 && (
                <div className="download-group">
                  <h4>PDF files</h4>
                  <ul className="download-list">
                    {pdfFiles.map((file) => (
                      <li
                        key={file.name}
                        className={`download-item ${selectedFile?.url === file.url ? 'active-download-item' : ''}`}
                      >
                        <button type="button" className="download-select" onClick={() => setSelectedFile(file)}>
                          {file.name}
                        </button>
                        <a className="btn btn-ghost" href={file.url} download>
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {imageFiles.length > 0 && (
                <div className="download-group">
                  <h4>Image files</h4>
                  <ul className="download-list">
                    {imageFiles.map((file) => (
                      <li
                        key={file.name}
                        className={`download-item ${selectedFile?.url === file.url ? 'active-download-item' : ''}`}
                      >
                        <button type="button" className="download-select" onClick={() => setSelectedFile(file)}>
                          {file.name}
                        </button>
                        <a className="btn btn-ghost" href={file.url} download>
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setDownloadModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
