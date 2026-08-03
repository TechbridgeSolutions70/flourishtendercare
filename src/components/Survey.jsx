import { useState } from 'react';

export default function Survey() {
  const [formData, setFormData] = useState({
    parentName: '', childrenNames: '', class: '', email: '', phone: '', parentType: '',
    overallSatisfaction: '', schoolEnvironment: '', communicationSchool: '', couldRecommend: '',
    schoolFacilities: '', schoolValues: '', teacherSatisfaction: '', teacherMatrix: {},
    teacherCommunication: '', childTreatedWithLove: '', teacherApproachability: '',
    teacherMotivation: '', hadTeacherConcern: '', concernResolution: '',
    appreciateTeacher: '', improvementSuggestions: '', portalUsage: '',
    portalFunctionality: '', portalFeatures: '', improvementPriority: '',
    improvementComments: '', generalComments: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMatrixChange = (area, rating) => {
    setFormData(prev => ({ ...prev, teacherMatrix: { ...prev.teacherMatrix, [area]: rating } }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Survey submitted:', formData);
    setSubmitted(true);
  };

  const handleSuccessClose = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const styles = {
    section: {
      minHeight: 'auto',
      padding: 'clamp(2rem, 4vw, 4rem) clamp(1rem, 3vw, 2rem)',
      background: 'linear-gradient(135deg, #f8fbff 0%, #f4f7ff 45%, #eef5ff 100%)',
      position: 'relative',
      overflow: 'hidden'
    },
    container: { width: '100%', maxWidth: '1000px', margin: '0 auto' },
    header: {
      marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
      textAlign: 'center',
      padding: 'clamp(1.5rem, 3vw, 2.4rem)',
      borderRadius: '24px',
      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.09), rgba(14, 165, 233, 0.08))',
      border: '1px solid rgba(124, 58, 237, 0.14)',
      boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)'
    },
    eyebrow: { margin: 0, marginBottom: '0.7rem', fontSize: 'clamp(0.78rem, 2vw, 0.9rem)', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#7c3aed' },
    title: { margin: '0 0 0.95rem', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#111827' },
    subtitle: { margin: '0 auto', lineHeight: 1.8, color: '#4b5563', fontSize: 'clamp(0.94rem, 2vw, 1.05rem)', maxWidth: '700px' },
    form: {
      background: 'rgba(255, 255, 255, 0.96)',
      padding: 'clamp(1.25rem, 3vw, 2.4rem)',
      borderRadius: '24px',
      boxShadow: '0 18px 42px rgba(15, 23, 42, 0.08)',
      border: '1px solid rgba(15, 23, 42, 0.04)'
    },
    sectionTitle: {
      marginBottom: '1.25rem',
      marginTop: 'clamp(1.6rem, 3vw, 2.2rem)',
      padding: '0.95rem 1rem',
      borderRadius: '14px',
      background: 'linear-gradient(90deg, rgba(124, 58, 237, 0.09), rgba(14, 165, 233, 0.05))',
      border: '1px solid rgba(124, 58, 237, 0.12)'
    },
    sectionTitleText: { margin: 0, fontSize: 'clamp(1.05rem, 2.8vw, 1.3rem)', fontWeight: 700, color: '#111827' },
    sectionNumber: { color: '#7c3aed', marginRight: '0.5rem', fontWeight: 800 },
    questionGroup: {
      marginBottom: 'clamp(1rem, 2.4vw, 1.4rem)',
      padding: '1rem 1rem 1.1rem',
      borderRadius: '16px',
      background: 'rgba(248, 250, 252, 0.9)',
      border: '1px solid #eef2f7'
    },
    questionTitle: { margin: '0 0 0.9rem', fontSize: 'clamp(0.95rem, 2.2vw, 1.06rem)', fontWeight: 600, color: '#1f2937', lineHeight: 1.5 },
    selectorWrapper: { width: '100%' },
    selectorButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.55rem',
      width: '100%',
      padding: '0.8rem 0.95rem',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      background: '#ffffff',
      color: '#334155',
      fontSize: '0.95rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 6px 16px rgba(15, 23, 42, 0.03)',
      textAlign: 'left'
    },
    selectorButtonActive: {
      borderColor: '#7c3aed',
      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
      color: '#ffffff',
      boxShadow: '0 10px 22px rgba(124, 58, 237, 0.22)'
    },
    selectorButtonMuted: {
      color: '#64748b',
      background: '#f8fafc'
    },
    selectorDropdown: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      marginTop: '0.45rem',
      padding: '0.5rem',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      background: '#ffffff',
      boxShadow: '0 14px 32px rgba(15, 23, 42, 0.12)',
      zIndex: 20
    },
    selectorOption: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.7rem 0.8rem',
      borderRadius: '10px',
      border: '1px solid transparent',
      background: '#fff',
      color: '#334155',
      fontSize: '0.92rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'left'
    },
    selectorOptionActive: {
      background: 'rgba(124, 58, 237, 0.08)',
      borderColor: 'rgba(124, 58, 237, 0.2)',
      color: '#6d28d9'
    },
    selectorDot: { fontSize: '0.95rem', lineHeight: 1 },
    inputLabel: { display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#1f2937', fontSize: 'clamp(0.9rem, 1.6vw, 0.95rem)' },
    textInput: { width: '100%', padding: 'clamp(0.7rem, 1.8vw, 0.9rem)', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: 'clamp(0.9rem, 1.6vw, 0.95rem)', boxSizing: 'border-box', transition: 'all 0.3s ease', fontFamily: 'inherit', background: '#fff' },
    textInputFocus: { borderColor: '#7c3aed', outline: 'none', boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.12)' },
    textarea: { width: '100%', padding: 'clamp(0.7rem, 1.8vw, 0.9rem)', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: 'clamp(0.9rem, 1.6vw, 0.95rem)', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical', transition: 'all 0.3s ease', background: '#fff' },
    inputGroup: { marginBottom: 'clamp(1rem, 2vw, 1.25rem)' },
    matrixRow: { display: 'flex', flexDirection: 'column', gap: '0.45rem', padding: '0.75rem 0.85rem', borderRadius: '12px', background: '#ffffff', border: '1px solid #e5e7eb' },
    matrixLabel: { fontSize: '0.95rem', fontWeight: 600, color: '#334155' },
    matrixSelectWrapper: { width: '100%' },
    matrixSelectButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '0.7rem 0.8rem',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      background: '#f8fafc',
      color: '#334155',
      fontSize: '0.92rem',
      fontWeight: 600,
      cursor: 'pointer',
      textAlign: 'left'
    },
    matrixSelectButtonActive: {
      borderColor: '#7c3aed',
      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
      color: '#ffffff'
    },
    matrixSelectButtonMuted: {
      color: '#64748b',
      background: '#f8fafc'
    },
    matrixSelectDropdown: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      marginTop: '0.45rem',
      padding: '0.45rem',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      background: '#ffffff',
      boxShadow: '0 10px 24px rgba(15, 23, 42, 0.1)'
    },
    matrixSelectOption: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.65rem 0.7rem',
      borderRadius: '8px',
      border: '1px solid transparent',
      background: '#fff',
      color: '#334155',
      fontSize: '0.9rem',
      fontWeight: 600,
      cursor: 'pointer',
      textAlign: 'left'
    },
    matrixSelectOptionActive: {
      background: 'rgba(124, 58, 237, 0.08)',
      borderColor: 'rgba(124, 58, 237, 0.2)',
      color: '#6d28d9'
    },
    submitContainer: { marginTop: 'clamp(1.8rem, 4vw, 2.5rem)', paddingTop: 'clamp(1.2rem, 3vw, 1.8rem)', borderTop: '2px solid #e5e7eb', textAlign: 'center' },
    submitButton: { padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2.3rem)', borderRadius: '999px', background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', color: '#ffffff', border: 'none', fontSize: 'clamp(0.95rem, 2vw, 1rem)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 24px rgba(124, 58, 237, 0.25)' },
    successOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 9999
    },
    successCard: {
      width: '100%',
      maxWidth: '520px',
      padding: 'clamp(1.4rem, 3vw, 2rem)',
      borderRadius: '24px',
      background: '#ffffff',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      color: '#065f46',
      textAlign: 'center',
      boxShadow: '0 24px 60px rgba(2, 6, 23, 0.24)',
      position: 'relative'
    },
    successCloseButton: {
      position: 'absolute',
      top: '0.85rem',
      right: '0.85rem',
      border: 'none',
      background: '#f3f4f6',
      color: '#374151',
      width: '2.1rem',
      height: '2.1rem',
      borderRadius: '999px',
      fontSize: '1rem',
      cursor: 'pointer'
    },
    successIcon: { fontSize: '2.3rem', marginBottom: '0.7rem' },
    successTitle: { margin: '0 0 0.65rem', fontSize: 'clamp(1.2rem, 2.6vw, 1.5rem)', fontWeight: 800, color: '#111827' },
    successText: { margin: 0, lineHeight: 1.7, color: '#4b5563', fontSize: 'clamp(0.95rem, 2vw, 1rem)' },
    successButtonRow: { display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' },
    successButton: { padding: '0.8rem 1.2rem', borderRadius: '999px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' },
    successSecondaryButton: { padding: '0.8rem 1.2rem', borderRadius: '999px', background: '#f3f4f6', color: '#374151', border: 'none', fontWeight: 700, cursor: 'pointer' },
    footerText: { margin: '1rem 0 0', color: '#6b7280', fontSize: 'clamp(0.85rem, 1.6vw, 0.9rem)' },
    gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(1rem, 2vw, 1.25rem)', marginBottom: 'clamp(1rem, 2vw, 1.25rem)' },
    responsiveTableWrapper: { overflowX: 'auto', borderRadius: '12px', marginBottom: '0.75rem' }
  };

  const SelectorGroup = ({ name, options, value, onChange, placeholder = 'Click to select' }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (selectedValue) => {
      onChange({ target: { name, value: selectedValue } });
      setIsOpen(false);
    };

    return (
      <div style={styles.selectorWrapper}>
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          style={{ ...styles.selectorButton, ...(value ? styles.selectorButtonActive : styles.selectorButtonMuted) }}
        >
          <span>{value || placeholder}</span>
          <span style={styles.selectorDot}>{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div style={styles.selectorDropdown}>
            {options.map(option => {
              const isActive = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  style={{ ...styles.selectorOption, ...(isActive ? styles.selectorOptionActive : {}) }}
                >
                  <span>{option}</span>
                  <span style={styles.selectorDot}>{isActive ? '●' : '○'}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const MatrixSelector = ({ area, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ratings = ['Excellent', 'Good', 'Fair', 'Poor'];

    const handleSelect = (rating) => {
      onChange(area, rating);
      setIsOpen(false);
    };

    return (
      <div style={styles.matrixRow}>
        <div style={styles.matrixLabel}>{area}</div>
        <div style={styles.matrixSelectWrapper}>
          <button
            type="button"
            onClick={() => setIsOpen(prev => !prev)}
            style={{ ...styles.matrixSelectButton, ...(value ? styles.matrixSelectButtonActive : styles.matrixSelectButtonMuted) }}
          >
            <span>{value || 'Select rating'}</span>
            <span style={styles.selectorDot}>{isOpen ? '▲' : '▼'}</span>
          </button>

          {isOpen && (
            <div style={styles.matrixSelectDropdown}>
              {ratings.map(rating => {
                const isActive = value === rating;
                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleSelect(rating)}
                    style={{ ...styles.matrixSelectOption, ...(isActive ? styles.matrixSelectOptionActive : {}) }}
                  >
                    <span>{rating}</span>
                    <span style={styles.selectorDot}>{isActive ? '●' : '○'}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const TextInput = ({ name, label, placeholder, value, onChange, type = 'text' }) => (
    <div style={styles.inputGroup} data-aos="fade-up" data-aos-delay="80" className="survey-input-group">
      {label && <label style={styles.inputLabel}>{label}</label>}
      <input className="survey-text-input" type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} style={styles.textInput} onFocus={(e) => Object.assign(e.target.style, styles.textInputFocus)} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
    </div>
  );

  const TextArea = ({ name, label, placeholder, value, onChange, rows = 3 }) => (
    <div style={styles.inputGroup} data-aos="fade-up" data-aos-delay="80" className="survey-input-group">
      {label && <label style={styles.inputLabel}>{label}</label>}
      <textarea className="survey-textarea" name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={styles.textarea} onFocus={(e) => Object.assign(e.target.style, styles.textInputFocus)} onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
    </div>
  );

  const SectionTitle = ({ number, title }) => (
    <div style={styles.sectionTitle} data-aos="fade-up" data-aos-delay="70" className="survey-section-title">
      <h3 style={styles.sectionTitleText}><span style={styles.sectionNumber}>Section {number}:</span>{title}</h3>
    </div>
  );

  const QuestionGroup = ({ title, children, delay = 0 }) => (
    <div style={styles.questionGroup} data-aos="fade-up" data-aos-delay={delay} className="survey-question-group">
      <p style={styles.questionTitle}>{title}</p>
      {children}
    </div>
  );

  return (
    <section style={styles.section} className="survey-section">
      <div style={styles.container} className="survey-container">
        <div style={styles.header} data-aos="fade-up" data-aos-delay="60" className="survey-header">
          <p style={styles.eyebrow}>Parent Feedback Survey</p>
          <h1 style={styles.title}>Flourish Tender Care</h1>
          <p style={styles.subtitle}>We value your feedback! This survey helps us understand your experience and continuously improve our services. Your honest opinions matter.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} data-aos="fade-up" data-aos-delay="120" className="survey-form">
          <SectionTitle number="A" title="Parent Information" />
          <div style={styles.gridContainer} className="survey-gridContainer">
            <TextInput name="parentName" label="Parent/Guardian Name *" placeholder="Full Name" value={formData.parentName} onChange={handleInputChange} />
            <TextInput name="childrenNames" label="Child(ren) Name(s) *" placeholder="Names" value={formData.childrenNames} onChange={handleInputChange} />
          </div>
          <div style={styles.gridContainer} className="survey-gridContainer">
            <div style={styles.inputGroup} data-aos="fade-up" data-aos-delay="80">
              <label style={styles.inputLabel}>Class/Grade</label>
              <SelectorGroup
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                options={['Creche', 'Playgroup 1', 'Playgroup 2', 'Nursery 1', 'Nursery 2', 'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6']}
              />
            </div>
            <TextInput name="email" label="Email Address *" placeholder="your@email.com" value={formData.email} onChange={handleInputChange} type="email" />
          </div>
          <div style={styles.gridContainer}>
            <TextInput name="phone" label="Phone Number" placeholder="+234..." value={formData.phone} onChange={handleInputChange} type="tel" />
          </div>
          <QuestionGroup title="Parent Type *" delay={70}>
            <SelectorGroup name="parentType" value={formData.parentType} onChange={handleInputChange} options={['Current Parent', 'Prospective Parent']} />
          </QuestionGroup>

          <SectionTitle number="B" title="Overall School Experience" />
          <QuestionGroup title="1. How satisfied are you with Flourish Tender Care overall?" delay={80}>
            <SelectorGroup name="overallSatisfaction" value={formData.overallSatisfaction} onChange={handleInputChange} options={['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']} />
          </QuestionGroup>
          <QuestionGroup title="2. How would you rate the overall school environment and facilities?" delay={90}>
            <SelectorGroup name="schoolEnvironment" value={formData.schoolEnvironment} onChange={handleInputChange} options={['Excellent', 'Good', 'Fair', 'Poor']} />
          </QuestionGroup>
          <QuestionGroup title="3. How would you rate communication from the school?" delay={100}>
            <SelectorGroup name="communicationSchool" value={formData.communicationSchool} onChange={handleInputChange} options={['Excellent', 'Good', 'Fair', 'Poor']} />
          </QuestionGroup>
          <QuestionGroup title="4. Would you recommend Flourish Tender Care to other parents?" delay={110}>
            <SelectorGroup name="couldRecommend" value={formData.couldRecommend} onChange={handleInputChange} options={['Definitely Yes', 'Probably Yes', 'Neutral', 'Probably Not', 'Definitely Not']} />
          </QuestionGroup>
          <QuestionGroup title="5. How satisfied are you with the school facilities and resources?" delay={120}>
            <SelectorGroup name="schoolFacilities" value={formData.schoolFacilities} onChange={handleInputChange} options={['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']} />
          </QuestionGroup>
          <QuestionGroup title="6. Does the school reflect and uphold the values important to your family?" delay={130}>
            <SelectorGroup name="schoolValues" value={formData.schoolValues} onChange={handleInputChange} options={['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']} />
          </QuestionGroup>

          <SectionTitle number="C" title="Teachers & Learning Experience" />
          <QuestionGroup title="1. How satisfied are you with your child's class teacher?" delay={80}>
            <SelectorGroup name="teacherSatisfaction" value={formData.teacherSatisfaction} onChange={handleInputChange} options={['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']} />
          </QuestionGroup>
          <QuestionGroup title="2. How would you rate your child's teacher in the following areas?" delay={90}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {['Teaching Quality', 'Classroom Management', 'Communication with Parents', 'Care and Concern for Pupils', 'Professionalism', 'Encouragement of Learning'].map(area => (
                <MatrixSelector key={area} area={area} value={formData.teacherMatrix[area]} onChange={handleMatrixChange} />
              ))}
            </div>
          </QuestionGroup>
          <QuestionGroup title="3. Does your child's teacher communicate effectively about your child's progress?" delay={100}>
            <SelectorGroup name="teacherCommunication" value={formData.teacherCommunication} onChange={handleInputChange} options={['Always', 'Often', 'Sometimes', 'Rarely', 'Never']} />
          </QuestionGroup>
          <QuestionGroup title="4. Do you feel your child is treated with love, patience, and respect by the teachers?" delay={110}>
            <SelectorGroup name="childTreatedWithLove" value={formData.childTreatedWithLove} onChange={handleInputChange} options={['Always', 'Most of the Time', 'Sometimes', 'Rarely', 'Never']} />
          </QuestionGroup>
          <QuestionGroup title="5. How approachable are your child's teachers when you have concerns or questions?" delay={120}>
            <SelectorGroup name="teacherApproachability" value={formData.teacherApproachability} onChange={handleInputChange} options={['Very Approachable', 'Approachable', 'Neutral', 'Difficult to Reach', 'Not Approachable']} />
          </QuestionGroup>
          <QuestionGroup title="6. Do you believe your child's teacher motivates and encourages learning?" delay={130}>
            <SelectorGroup name="teacherMotivation" value={formData.teacherMotivation} onChange={handleInputChange} options={['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']} />
          </QuestionGroup>
          <QuestionGroup title="7. Have you ever had a concern regarding a teacher?" delay={140}>
            <SelectorGroup name="hadTeacherConcern" value={formData.hadTeacherConcern} onChange={handleInputChange} options={['Yes', 'No']} />
            {formData.hadTeacherConcern === 'Yes' && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p style={styles.questionTitle}>If Yes, was it resolved satisfactorily?</p>
                <SelectorGroup name="concernResolution" value={formData.concernResolution} onChange={handleInputChange} options={['Yes', 'Partially', 'No']} />
              </div>
            )}
          </QuestionGroup>
          <TextArea name="appreciateTeacher" label="8. What do you appreciate most about your child's teacher?" placeholder="Share your thoughts..." value={formData.appreciateTeacher} onChange={handleInputChange} rows={3} />
          <TextArea name="improvementSuggestions" label="9. What improvements would you like to see from our teaching staff?" placeholder="Share your suggestions..." value={formData.improvementSuggestions} onChange={handleInputChange} rows={3} />

          <SectionTitle number="D" title="School Portal Feedback" />
          <QuestionGroup title="1. How frequently do you use the school portal?" delay={80}>
            <SelectorGroup name="portalUsage" value={formData.portalUsage} onChange={handleInputChange} options={['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never']} />
          </QuestionGroup>
          <QuestionGroup title="2. How would you rate the functionality and ease of use of the school portal?" delay={90}>
            <SelectorGroup name="portalFunctionality" value={formData.portalFunctionality} onChange={handleInputChange} options={['Excellent', 'Good', 'Fair', 'Poor']} />
          </QuestionGroup>
          <QuestionGroup title="3. Which portal features are most valuable to you?" delay={100}>
            <SelectorGroup name="portalFeatures" value={formData.portalFeatures} onChange={handleInputChange} options={['Academic Progress Tracking', 'Communication with Teachers', 'Payment/Fees', 'Class Schedules', 'All of the Above']} />
          </QuestionGroup>

          <SectionTitle number="E" title="Areas for Improvement" />
          <QuestionGroup title="1. What area would you prioritize for improvement?" delay={80}>
            <SelectorGroup name="improvementPriority" value={formData.improvementPriority} onChange={handleInputChange} options={['Academic Excellence', 'Facilities & Infrastructure', 'Teacher Quality', 'School Communication', 'Student Welfare', 'Other']} />
          </QuestionGroup>
          <TextArea name="improvementComments" label="2. Please provide any additional comments or suggestions for improvement:" placeholder="Your suggestions..." value={formData.improvementComments} onChange={handleInputChange} rows={3} />

          <SectionTitle number="F" title="Final Comments" />
          <TextArea name="generalComments" label="Is there anything else you'd like us to know?" placeholder="Additional comments..." value={formData.generalComments} onChange={handleInputChange} rows={4} />

          <div style={styles.submitContainer} data-aos="fade-up" data-aos-delay="80" className="survey-submitContainer">
            {!submitted && (
              <>
                <button type="submit" style={styles.submitButton} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 14px 28px rgba(124, 58, 237, 0.32)'; }} onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 24px rgba(124, 58, 237, 0.25)'; }}>Submit Survey</button>
                <p style={styles.footerText}>* Required fields. Thank you for taking the time to complete this survey.</p>
              </>
            )}
          </div>
        </form>

        {submitted && (
          <div style={styles.successOverlay} role="dialog" aria-modal="true" aria-label="Survey submitted successfully" className="survey-successOverlay">
            <div style={styles.successCard} className="survey-successCard">
              <button type="button" style={styles.successCloseButton} onClick={handleSuccessClose} aria-label="Close success dialog">×</button>
              <div style={styles.successIcon}>✓</div>
              <h3 style={styles.successTitle}>Survey Submitted Successfully</h3>
              <p style={styles.successText}>Thank you for sharing your feedback with us. Your response has been received and will help us improve our services.</p>
              <div style={styles.successButtonRow} className="survey-successButtonRow">
                <button type="button" style={styles.successButton} className="survey-successButton" onClick={handleSuccessClose}>Close & Go Home</button>
                <button type="button" style={styles.successSecondaryButton} className="survey-successSecondaryButton" onClick={() => setSubmitted(false)}>Stay Here</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
