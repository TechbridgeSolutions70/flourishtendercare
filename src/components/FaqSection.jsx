import { useState } from 'react';

const faqs = [
  {
    question: 'What ages do you serve?',
    answer: 'We welcome children from early years through primary school, with programs tailored to each stage of development.',
  },
  {
    question: 'How do I schedule a visit?',
    answer: 'You can reach out by phone or email and we will be happy to arrange a guided tour of our campus.',
  },
  {
    question: 'Do you offer admission support?',
    answer: 'Yes. We guide families through the admission process and answer any questions about curriculum, routines, and school life.',
  },
  {
    question: 'How do you support children emotionally?',
    answer: 'Our team creates a warm, nurturing environment with strong routines, positive guidance, and a focus on confidence and belonging.',
  },
];

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="section faq-section">
      <div className="section-heading">
        <p className="eyebrow">Frequently asked questions</p>
        <h2>Everything you need to know</h2>
      </div>

      <div className="faq-list">
        {faqs.map((item, index) => {
          const isOpen = index === openIndex;
          return (
            <div key={item.question} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <button
                className="faq-trigger"
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <span className="faq-icon">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && <p className="faq-answer">{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FaqSection;
