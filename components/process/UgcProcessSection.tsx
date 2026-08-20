"use client";

import React, { useEffect, useRef, useState } from "react";
import ProcessCard from "./ProcessCard";
import ScriptAnimation from "./ScriptAnimation";
import FilmAnimation from "./FilmAnimation";
import EditAnimation from "./EditAnimation";
import MeasureAnimation from "./MeasureAnimation";

const PROCESS_STEPS = [
  {
    stepNumber: "01",
    title: "SCRIPT",
    description:
      "Transform campaign goals, product benefits and audience insights into scroll-stopping concepts and high-performing UGC scripts.",
    Component: ScriptAnimation,
  },
  {
    stepNumber: "02",
    title: "FILM",
    description:
      "Bring each concept to life through authentic creators, natural performances and platform-native production.",
    Component: FilmAnimation,
  },
  {
    stepNumber: "03",
    title: "EDIT",
    description:
      "Turn raw footage into polished, fast-paced content engineered to capture attention and retain viewers.",
    Component: EditAnimation,
  },
  {
    stepNumber: "04",
    title: "MEASURE",
    description:
      "Analyse creative performance, identify winning patterns and use those insights to continuously improve future campaigns.",
    Component: MeasureAnimation,
  },
];

export default function UgcProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasEntered(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        rootMargin: "150px 0px",
        threshold: 0.05,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Track active slide on mobile horizontal scroll
  const handleGridScroll = () => {
    if (!gridRef.current) return;
    const { scrollLeft, clientWidth } = gridRef.current;
    const cards = gridRef.current.children;
    if (!cards.length) return;

    const firstCard = cards[0] as HTMLElement;
    const cardWidth = firstCard.offsetWidth + 16; // width + gap
    const newIndex = Math.round(scrollLeft / cardWidth);
    setActiveCardIndex(Math.max(0, Math.min(PROCESS_STEPS.length - 1, newIndex)));
  };

  const scrollToCard = (index: number) => {
    if (!gridRef.current) return;
    const cards = gridRef.current.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
    setActiveCardIndex(index);
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeCardIndex - 1);
    scrollToCard(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(PROCESS_STEPS.length - 1, activeCardIndex + 1);
    scrollToCard(nextIdx);
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className={`ugc-process-section ${isVisible ? "is-active" : "is-idle"} ${hasEntered ? "has-entered" : ""}`}
      aria-label="Our UGC Production Process"
    >
      {/* Subtle Atmospheric Red Glow behind heading */}
      <div className="ugc-process-ambient-glow" aria-hidden="true" />
      <div className="ugc-process-ambient-mesh" aria-hidden="true" />

      <div className="ugc-process-container">
        {/* ── Section Header ── */}
        <div className="ugc-process-header">
          <div className="section-label ugc-process-badge">
            ✦ PROVEN 4-STEP PRODUCTION BLUEPRINT ✦
          </div>

          <h2 className="ugc-process-headline">
            <span className="ugc-headline-white">TOP-NOTCH UGC ADS</span>
            <span className="ugc-headline-red">IN JUST A FEW CLICKS</span>
          </h2>

          <p className="ugc-process-sub">
            As a leading UGC agency and content creation agency, we streamline UGC content production through our proven creative agency process.
          </p>
        </div>

        {/* ── 4-Card Process Grid (Slideable on Mobile, Grid on Desktop) ── */}
        <div className="ugc-process-grid-wrapper">
          <div 
            className="ugc-process-grid" 
            ref={gridRef}
            onScroll={handleGridScroll}
          >
            {PROCESS_STEPS.map((step, idx) => {
              const AnimationComp = step.Component;
              return (
                <ProcessCard
                  key={step.title}
                  stepNumber={step.stepNumber}
                  title={step.title}
                  description={step.description}
                  delayIndex={idx}
                >
                  <AnimationComp />
                </ProcessCard>
              );
            })}
          </div>

          {/* ── Mobile Swipe & Pagination Controls ── */}
          <div className="ugc-process-mobile-controls" aria-label="Process steps navigation">
            <button
              className="ugc-slider-btn prev"
              onClick={handlePrev}
              disabled={activeCardIndex === 0}
              aria-label="Previous step"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="ugc-slider-dots">
              {PROCESS_STEPS.map((step, idx) => (
                <button
                  key={step.stepNumber}
                  className={`ugc-slider-dot ${activeCardIndex === idx ? "is-active" : ""}`}
                  onClick={() => scrollToCard(idx)}
                  aria-label={`Go to step ${step.stepNumber}: ${step.title}`}
                >
                  <span className="dot-bar" />
                </button>
              ))}
            </div>

            <button
              className="ugc-slider-btn next"
              onClick={handleNext}
              disabled={activeCardIndex === PROCESS_STEPS.length - 1}
              aria-label="Next step"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
