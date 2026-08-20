"use client";

import React, { useState } from "react";

interface FAQItem {
  num: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    num: "01",
    question: "Why should brands choose The Reel Company?",
    answer:
      "Brands choose The Reel Company for authentic, high-quality UGC that feels natural and performs across digital platforms. We combine creative strategy, the right creators and professional production to deliver content that connects with audiences and supports brand growth.",
  },
  {
    num: "02",
    question: "Do you handle the complete video production process?",
    answer:
      "Yes. We manage everything from concept development, scripting and creator selection to shooting, editing and final delivery. Brands get a smooth, end-to-end production experience without having to coordinate with multiple teams.",
  },
  {
    num: "03",
    question: "What makes The Reel Company’s UGC content different?",
    answer:
      "Our UGC is designed to feel real, relatable and native to social media rather than overly scripted. We combine strong hooks, natural storytelling and engaging visuals while keeping every video aligned with your brand identity.",
  },
  {
    num: "04",
    question: "How long does it take to receive the final videos?",
    answer:
      "Timelines depend on the number of videos, creators and production requirements. Once the brief is finalized, we provide a clear production and delivery timeline upfront so you always know what to expect.",
  },
  {
    num: "05",
    question: "What if I need changes after receiving the videos?",
    answer:
      "We follow a structured revision process to make sure the final videos match the approved brief and creative direction. Our team works closely with you to address necessary changes and deliver content that meets your brand expectations.",
  },
];

export default function FAQSection() {
  // Question 01 (index 0) open by default, single-open accordion behavior
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="faq-section" aria-label="Frequently Asked Questions">
      <div className="faq-ambient-glow" aria-hidden="true" />

      <div className="faq-container">
        {/* ── Left Column: Header Area ── */}
        <div className="faq-header-col">
          <div className="faq-eyebrow">
            <span className="faq-eyebrow-accent">✦</span> FAQ / EVERYTHING YOU NEED TO KNOW
          </div>

          <h2 className="faq-main-heading">
            <span className="faq-heading-line">Questions?</span>
            <span className="faq-heading-line">We’ve Got Answers.</span>
          </h2>

          <p className="faq-supporting-text">
            Everything you need to know about working with The Reel Company — from production and timelines to revisions and delivery.
          </p>
        </div>

        {/* ── Right Column: Single-Open Accordion ── */}
        <div className="faq-accordion-col" role="region" aria-label="Accordion Questions">
          <div className="faq-accordion-list">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = activeIndex === idx;
              const questionId = `faq-q-${idx}`;
              const answerId = `faq-a-${idx}`;

              return (
                <div
                  key={item.num}
                  className={`faq-item ${isOpen ? "is-open" : "is-closed"}`}
                >
                  <button
                    type="button"
                    className="faq-trigger-btn"
                    onClick={() => toggleItem(idx)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    id={questionId}
                  >
                    <span className="faq-item-num">{item.num}</span>
                    <span className="faq-item-question">{item.question}</span>
                    <span className="faq-icon-circle" aria-hidden="true">
                      <svg
                        className="faq-icon-svg"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 1V13M1 7H13"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    className="faq-answer-wrapper"
                  >
                    <div className="faq-answer-inner">
                      <p className="faq-answer-content">{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
