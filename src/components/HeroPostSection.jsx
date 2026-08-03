const availableFiles = import.meta.glob('../Public/downloaded files/**/*.*', { eager: true, as: 'url' });
import logo from '../Public/logo/logo1.jpeg';

import { useEffect, useMemo, useRef, useState } from 'react';

export default function HeroPostSection() {
  const modalBodyRef = useRef(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [surveyCategory, setSurveyCategory] = useState('existing-parents');
  const [surveyName, setSurveyName] = useState('');
  const [surveyEmail, setSurveyEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [childClass, setChildClass] = useState('');
  const [overallSatisfaction, setOverallSatisfaction] = useState('');
  const [portalEase, setPortalEase] = useState('');
  const [teacherSatisfaction, setTeacherSatisfaction] = useState('');
  const [teacherQuality, setTeacherQuality] = useState('');
  const [classroomManagement, setClassroomManagement] = useState('');
  const [communicationWithParents, setCommunicationWithParents] = useState('');
  const [careConcern, setCareConcern] = useState('');
  const [professionalism, setProfessionalism] = useState('');
  const [encouragement, setEncouragement] = useState('');
  const [teacherProgressCommunication, setTeacherProgressCommunication] = useState('');
  const [teacherRespect, setTeacherRespect] = useState('');
  const [teacherApproachability, setTeacherApproachability] = useState('');
  const [teacherMotivation, setTeacherMotivation] = useState('');
  const [teacherHadConcern, setTeacherHadConcern] = useState('');
  const [concernResolved, setConcernResolved] = useState('');
  const [appreciateTeacher, setAppreciateTeacher] = useState('');
  const [improveTeaching, setImproveTeaching] = useState('');
  const [portalFeedback, setPortalFeedback] = useState('');
  const [areasForImprovement, setAreasForImprovement] = useState('');
  const [finalComments, setFinalComments] = useState('');
  const [prospectiveNeed, setProspectiveNeed] = useState('');
  const [prospectiveQuestions, setProspectiveQuestions] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const surveySampleQuestions = {
    'existing-parents': [
      'What has been most helpful from Flourish Tender Care so far?',
      'What could make our admissions support even better?',
      'How can we improve communication with your family?',
    ],
    'prospective-parents': [
      'What are the top priorities for your child’s school experience?',
      'What grade or program information do you need most?',
      'What questions do you have about the admissions process?',
    ],
  };

  const resetSurveyFields = (category = 'existing-parents') => {
    setSurveyCategory(category);
    setSurveySubmitted(false);
    setSurveyName('');
    setSurveyEmail('');
    setChildName('');
    setChildClass('');
    setOverallSatisfaction('');
    setPortalEase('');
    setTeacherSatisfaction('');
    setTeacherQuality('');
    setClassroomManagement('');
    setCommunicationWithParents('');
    setCareConcern('');
    setProfessionalism('');
    setEncouragement('');
    setTeacherProgressCommunication('');
    setTeacherRespect('');
    setTeacherApproachability('');
    setTeacherMotivation('');
    setTeacherHadConcern('');
    setConcernResolved('');
    setAppreciateTeacher('');
    setImproveTeaching('');
    setPortalFeedback('');
    setAreasForImprovement('');
    setFinalComments('');
    setProspectiveNeed('');
    setProspectiveQuestions('');
  };

  const updateSurveyUrl = (category) => {
    const route = category === 'prospective-parents' ? '/prospective_parent' : '/existing_parent';
    if (window.location.pathname !== route) {
      window.history.replaceState({}, '', route);
    }
  };

  const openSurveyModal = (category = 'existing-parents') => {
    resetSurveyFields(category);
    setSurveyModalOpen(true);
    updateSurveyUrl(category);
  };

  const closeSurveyModal = () => {
    setSurveyModalOpen(false);
    setSurveySubmitted(false);
    const currentPath = window.location.pathname;
    if (currentPath === '/existing_parent' || currentPath === '/prospective_parent') {
      window.history.replaceState({}, '', '/');
    }
  };

  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, '');
    if (path === '/existing_parent' || path === '/prospective_parent') {
      const category = path === '/prospective_parent' ? 'prospective-parents' : 'existing-parents';
      resetSurveyFields(category);
      setSurveyModalOpen(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('survey') === '1') {
      const category = params.get('category');
      if (category === 'prospective-parents' || category === 'existing-parents') {
        resetSurveyFields(category);
      }
      setSurveyModalOpen(true);
    }
  }, []);

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
    <>
      <section className="section hero-admissions-banner" data-aos="fade-up">
        <div className="hero-admissions-shell">
          <div className="hero-admissions-copy">
            <p className="eyebrow">Admissions in progress — 2026/2027</p>
            <h2>Apply for the 2026/2027 Academic Session</h2>
            <p>
              Admission into Flourish Tender Care is now open. Entrance examinations are scheduled for 15th, 20th and 27th March 2025.
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
              <button type="button" className="btn btn-secondary" onClick={() => openSurveyModal('existing-parents')}>
                Take a survey
              </button>
            </div>
            <div className="survey-link-row">
              <a className="survey-link" href="/existing_parent">
                Existing Parents survey
              </a>
              <a className="survey-link" href="/prospective_parent">
                Prospective Parents survey
              </a>
            </div>
          </div>
        </div>
      </section>

      {downloadModalOpen && (
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
        </div>
      )}

      {surveyModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={closeSurveyModal}>
          <div className="modal-card survey-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-body" ref={modalBodyRef}>
              <div className="modal-header">
                <div className="survey-letterhead">
                  <div>
                    <p className="survey-letterhead-title">Flourish Tender Care</p>
                    <p className="survey-letterhead-subtitle">School experience questionnaire</p>
                  </div>
                </div>
                <button type="button" className="modal-close" onClick={closeSurveyModal} aria-label="Close modal">
                  ×
                </button>
              </div>

              <div className="survey-intro">
                <h3>{surveyCategory === 'existing-parents' ? 'Existing Parents Survey' : 'Prospective Parents Survey'}</h3>
                <p>
                  {surveyCategory === 'existing-parents'
                    ? 'Your feedback helps us deepen our teacher and learning experience, portal support, and overall family engagement.'
                    : 'Help us understand your priorities before applying so we can make your admissions journey smooth and personal.'}
                </p>
              </div>

              {surveySubmitted ? (
                <div className="survey-success">
                  <h4>Thanks for sharing!</h4>
                  <p>
                    We’ve received your response. A member of our admissions team will review it and reach out if there’s anything else we need.
                  </p>
                  <div className="survey-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={closeSurveyModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form className="survey-form" onSubmit={(event) => {
                  event.preventDefault();
                  setSurveySubmitted(true);
                }}>
                  <div className="survey-category-tabs">
                    <button
                      type="button"
                      className={`survey-category-tab ${surveyCategory === 'existing-parents' ? 'active' : ''}`}
                      onClick={() => {
                        resetSurveyFields('existing-parents');
                        updateSurveyUrl('existing-parents');
                      }}
                    >
                      Existing Parents
                    </button>
                    <button
                      type="button"
                      className={`survey-category-tab ${surveyCategory === 'prospective-parents' ? 'active' : ''}`}
                      onClick={() => {
                        resetSurveyFields('prospective-parents');
                        updateSurveyUrl('prospective-parents');
                      }}
                    >
                      Prospective Parents
                    </button>
                  </div>

                  <div className="survey-input-row">
                    <label>
                      Your name
                      <input
                        type="text"
                        value={surveyName}
                        onChange={(event) => setSurveyName(event.target.value)}
                        placeholder="Jane Doe"
                      />
                    </label>
                    <label>
                      Email address
                      <input
                        type="email"
                        value={surveyEmail}
                        onChange={(event) => setSurveyEmail(event.target.value)}
                        placeholder="name@example.com"
                      />
                    </label>
                  </div>

                  {surveyCategory === 'existing-parents' ? (
                    <>
                      <div className="survey-section">
                        <h4>Section A: Parent Information</h4>
                        <div className="survey-input-row">
                          <label>
                            Child’s name
                            <input
                              type="text"
                              value={childName}
                              onChange={(event) => setChildName(event.target.value)}
                              placeholder="Amina"
                            />
                          </label>
                          <label>
                            Class/Grade
                            <input
                              type="text"
                              value={childClass}
                              onChange={(event) => setChildClass(event.target.value)}
                              placeholder="Primary 2"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="survey-section">
                        <h4>Section B: Overall School Experience</h4>
                        <fieldset className="survey-fieldset">
                          <legend>How satisfied are you with your child’s overall school experience?</legend>
                          <div className="survey-option-list">
                            {['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'].map((option) => (
                              <label key={option} className="survey-option">
                                <input
                                  type="radio"
                                  name="overall-satisfaction"
                                  value={option}
                                  checked={overallSatisfaction === option}
                                  onChange={() => setOverallSatisfaction(option)}
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <fieldset className="survey-fieldset">
                          <legend>School portal experience (if used)</legend>
                          <textarea
                            value={portalFeedback}
                            onChange={(event) => setPortalFeedback(event.target.value)}
                            placeholder="How easy is the portal to use, and what could we improve?"
                          />
                        </fieldset>
                      </div>

                      <div className="survey-section">
                        <h4>Section C: Teachers & Learning Experience</h4>
                        <fieldset className="survey-fieldset">
                          <legend>How satisfied are you with your child's class teacher?</legend>
                          <div className="survey-option-list">
                            {['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'].map((option) => (
                              <label key={option} className="survey-option">
                                <input
                                  type="radio"
                                  name="teacher-satisfaction"
                                  value={option}
                                  checked={teacherSatisfaction === option}
                                  onChange={() => setTeacherSatisfaction(option)}
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <fieldset className="survey-fieldset survey-matrix">
                          <legend>How would you rate your child's teacher in the following areas?</legend>
                          {[
                            ['Teaching Quality', teacherQuality, setTeacherQuality],
                            ['Classroom Management', classroomManagement, setClassroomManagement],
                            ['Communication with Parents', communicationWithParents, setCommunicationWithParents],
                            ['Care and Concern for Pupils', careConcern, setCareConcern],
                            ['Professionalism', professionalism, setProfessionalism],
                            ['Encouragement of Learning', encouragement, setEncouragement],
                          ].map(([label, value, setter]) => (
                            <label key={label} className="survey-matrix-row">
                              <span>{label}</span>
                              <select value={value} onChange={(event) => setter(event.target.value)}>
                                <option value="">Choose</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                                <option value="Poor">Poor</option>
                              </select>
                            </label>
                          ))}
                        </fieldset>
                        <fieldset className="survey-fieldset">
                          <legend>Does your child's teacher communicate effectively about your child's progress?</legend>
                          <div className="survey-option-list">
                            {['Always', 'Often', 'Sometimes', 'Rarely', 'Never'].map((option) => (
                              <label key={option} className="survey-option">
                                <input
                                  type="radio"
                                  name="progress-communication"
                                  value={option}
                                  checked={teacherProgressCommunication === option}
                                  onChange={() => setTeacherProgressCommunication(option)}
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <fieldset className="survey-fieldset">
                          <legend>Do you feel your child is treated with love, patience, and respect by the teachers?</legend>
                          <div className="survey-option-list">
                            {['Always', 'Most of the Time', 'Sometimes', 'Rarely', 'Never'].map((option) => (
                              <label key={option} className="survey-option">
                                <input
                                  type="radio"
                                  name="teacher-respect"
                                  value={option}
                                  checked={teacherRespect === option}
                                  onChange={() => setTeacherRespect(option)}
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <fieldset className="survey-fieldset">
                          <legend>How approachable are your child's teachers when you have concerns or questions?</legend>
                          <div className="survey-option-list">
                            {['Very Approachable', 'Approachable', 'Neutral', 'Difficult to Reach', 'Not Approachable'].map((option) => (
                              <label key={option} className="survey-option">
                                <input
                                  type="radio"
                                  name="teacher-approachability"
                                  value={option}
                                  checked={teacherApproachability === option}
                                  onChange={() => setTeacherApproachability(option)}
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <fieldset className="survey-fieldset">
                          <legend>Do you believe your child's teacher motivates and encourages learning?</legend>
                          <div className="survey-option-list">
                            {['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'].map((option) => (
                              <label key={option} className="survey-option">
                                <input
                                  type="radio"
                                  name="teacher-motivation"
                                  value={option}
                                  checked={teacherMotivation === option}
                                  onChange={() => setTeacherMotivation(option)}
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <fieldset className="survey-fieldset">
                          <legend>Have you ever had a concern regarding a teacher?</legend>
                          <div className="survey-option-list">
                            {['Yes', 'No'].map((option) => (
                              <label key={option} className="survey-option">
                                <input
                                  type="radio"
                                  name="teacher-concern"
                                  value={option}
                                  checked={teacherHadConcern === option}
                                  onChange={() => setTeacherHadConcern(option)}
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                          {teacherHadConcern === 'Yes' && (
                            <div className="survey-option-subgroup">
                              <p>Was it resolved satisfactorily?</p>
                              <div className="survey-option-list">
                                {['Yes', 'Partially', 'No'].map((option) => (
                                  <label key={option} className="survey-option">
                                    <input
                                      type="radio"
                                      name="concern-resolved"
                                      value={option}
                                      checked={concernResolved === option}
                                      onChange={() => setConcernResolved(option)}
                                    />
                                    {option}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </fieldset>
                        <div className="survey-textarea">
                          <label>
                            What do you appreciate most about your child's teacher?
                            <textarea
                              value={appreciateTeacher}
                              onChange={(event) => setAppreciateTeacher(event.target.value)}
                              placeholder="Share a few strengths or positive examples."
                            />
                          </label>
                        </div>
                        <div className="survey-textarea">
                          <label>
                            What improvements would you like to see from our teaching staff?
                            <textarea
                              value={improveTeaching}
                              onChange={(event) => setImproveTeaching(event.target.value)}
                              placeholder="What could make learning, communication or care even better?"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="survey-section">
                        <h4>Section D: School Portal Feedback</h4>
                        <fieldset className="survey-fieldset">
                          <legend>How easy is the school portal to use?</legend>
                          <div className="survey-option-list">
                            {['Very Easy', 'Easy', 'Neutral', 'Difficult', 'Very Difficult'].map((option) => (
                              <label key={option} className="survey-option">
                                <input
                                  type="radio"
                                  name="portal-ease"
                                  value={option}
                                  checked={portalEase === option}
                                  onChange={() => setPortalEase(option)}
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <div className="survey-textarea">
                          <label>
                            Share any portal feedback
                            <textarea
                              value={portalFeedback}
                              onChange={(event) => setPortalFeedback(event.target.value)}
                              placeholder="Tell us what worked well and what could improve."
                            />
                          </label>
                        </div>
                      </div>

                      <div className="survey-section">
                        <h4>Section E: Areas for Improvement</h4>
                        <div className="survey-textarea">
                          <label>
                            Where can Flourish Tender Care improve?
                            <textarea
                              value={areasForImprovement}
                              onChange={(event) => setAreasForImprovement(event.target.value)}
                              placeholder="Share the areas you’d most like us to improve."
                            />
                          </label>
                        </div>
                      </div>

                      <div className="survey-section">
                        <h4>Section F: Final Comments</h4>
                        <div className="survey-textarea">
                          <label>
                            Final comments
                            <textarea
                              value={finalComments}
                              onChange={(event) => setFinalComments(event.target.value)}
                              placeholder="Any final thoughts or suggestions?"
                            />
                          </label>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="survey-section">
                        <h4>Section A: Parent Information</h4>
                        <div className="survey-input-row">
                          <label>
                            Your name
                            <input
                              type="text"
                              value={surveyName}
                              onChange={(event) => setSurveyName(event.target.value)}
                              placeholder="Jane Doe"
                            />
                          </label>
                          <label>
                            Email address
                            <input
                              type="email"
                              value={surveyEmail}
                              onChange={(event) => setSurveyEmail(event.target.value)}
                              placeholder="name@example.com"
                            />
                          </label>
                        </div>
                        <div className="survey-input-row">
                          <label>
                            Child’s age/grade
                            <input
                              type="text"
                              value={childClass}
                              onChange={(event) => setChildClass(event.target.value)}
                              placeholder="Primary 2"
                            />
                          </label>
                          <label>
                            What brings you here?
                            <input
                              type="text"
                              value={prospectiveNeed}
                              onChange={(event) => setProspectiveNeed(event.target.value)}
                              placeholder="Interest in academics, care, location..."
                            />
                          </label>
                        </div>
                      </div>

                      <div className="survey-section">
                        <h4>Section B: Prospective Parent Questions</h4>
                        <div className="survey-textarea">
                          <label>
                            What do you need most from our admissions team?
                            <textarea
                              value={prospectiveQuestions}
                              onChange={(event) => setProspectiveQuestions(event.target.value)}
                              placeholder="Tell us what questions you have or the information you need."
                            />
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="survey-actions">
                    <button type="button" className="btn btn-secondary" onClick={closeSurveyModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={surveySubmitted}>
                      {surveySubmitted ? 'Thanks!' : 'Submit survey'}
                    </button>
                  </div>
                </form>
              )}
            </div>
            <button
              type="button"
              className="modal-scroll-top"
              onClick={() => modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
