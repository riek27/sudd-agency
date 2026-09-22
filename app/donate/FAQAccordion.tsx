'use client';

import { useState } from 'react';

export default function FAQAccordion({ items }: { items: any[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {(items || []).map((item: any, i: number) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={i}
            className={`faq-item ${isOpen ? 'is-open' : ''}`}
            onClick={() => setOpenIdx(isOpen ? null : i)}
          >
            <div className="faq-header">
              <h4 className="faq-question">{item.question}</h4>
              <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} faq-chevron`} />
            </div>
            <div className={`faq-body ${isOpen ? 'open' : ''}`}>
              <div className="faq-body-inner">
                <p className="faq-answer">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
      <style>{`
        .faq-item {
          background: #fff;
          border-radius: 16px;
          padding: 24px 28px;
          border: 1px solid rgba(6,40,61,0.06);
          box-shadow: 0 8px 20px rgba(6,40,61,0.04);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .faq-item:hover {
          border-color: rgba(212,160,23,0.3);
          box-shadow: 0 14px 36px rgba(6,40,61,0.08);
        }
        .faq-item.is-open {
          border-color: rgba(212,160,23,0.4);
          box-shadow: 0 18px 44px rgba(6,40,61,0.10);
        }
        .faq-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .faq-question {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--navy);
          margin: 0;
          line-height: 1.4;
        }
        .faq-chevron {
          color: var(--gold);
          font-size: 0.85rem;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }
        .faq-item.is-open .faq-chevron {
          transform: rotate(180deg);
        }
        .faq-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                      margin-top 0.4s ease;
          opacity: 0.4;
        }
        .faq-body.open {
          grid-template-rows: 1fr;
          margin-top: 14px;
          opacity: 1;
        }
        .faq-body-inner {
          overflow: hidden;
          min-height: 0;
        }
        .faq-answer {
          color: var(--gray-600);
          font-size: 0.94rem;
          line-height: 1.75;
          margin: 0;
        }
        .faq-answer a {
          color: var(--gold);
          text-decoration: underline;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}