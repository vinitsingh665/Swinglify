"use client";

import { useState } from 'react';
import Link from 'next/link';

const FAQS = [
  {
    q: "What is the best free stock screener for Indian swing traders?",
    a: "Swinglify is engineered specifically for Indian swing traders, covering 3,000+ NSE and BSE equities. Unlike generic screeners that require complex syntax or charge monthly fees, Swinglify delivers 40+ pre-calculated technical indicators (RSI, EMA crossovers, MACD, Bollinger Bands, Volume surges) and algorithmic setup scores 100% free."
  },
  {
    q: "How does Swinglify identify high-probability breakout setups?",
    a: "Our quantitative engine scans candlestick intervals to detect volume spikes (2x+ 10-day average), stage-2 base breakouts, and moving average confluence (like the Golden Cross where the 50-day EMA crosses above the 200-day SMA). Each setup includes defined Target 1, Target 2, and hard Stop-Loss levels to guarantee asymmetric 3:1+ risk-to-reward."
  },
  {
    q: "Can I screen stocks by RSI oversold and overbought levels?",
    a: "Yes. You can filter stocks using our programmatic RSI oversold preset (<30 for mean-reversion bounces) or overbought expansion (>70 for momentum runners) across Large-Cap, Mid-Cap, and Small-Cap Indian equities with a single click."
  },
  {
    q: "Is Swinglify really 100% free with no credit card required?",
    a: "Yes. Swinglify's core stock screener, technical charts, algorithmic momentum scoring, sector rivalries comparison tool, and portfolio tracker are completely free for all Indian traders during our early access release."
  },
  {
    q: "How does the Stock Comparison tool work?",
    a: "The comparison tool lets you pit sector peers against each other (for example, TCS vs Infosys or HDFC Bank vs ICICI Bank) to instantly see who has superior relative strength, higher composite momentum score, cleaner moving average support, and better risk-adjusted return."
  }
];

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <section className="landing-faq-section">
      {/* Schema.org FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="landing-faq-container">
        <div className="bento-badge">FREQUENTLY ASKED QUESTIONS</div>
        <h2 className="bento-title">
          Everything You Need to Know<br />
          <span className="bento-title-accent">About Trading with Swinglify.</span>
        </h2>
        <p className="bento-subtitle">
          Got questions about our screener indicators, algorithmic scoring, or data coverage? We've got answers.
        </p>

        <div className="faq-accordion-list">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`faq-accordion-item ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  className="faq-question-btn"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{faq.q}</span>
                  <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="faq-answer-content">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="faq-bottom-cta">
          <span>Still have questions?</span>
          <Link href="/info/contact" className="faq-cta-link">
            Contact Support & Community →
          </Link>
        </div>
      </div>
    </section>
  );
}
