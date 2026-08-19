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
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

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

        {/* ── 4-Card Process Grid ── */}
        <div className="ugc-process-grid">
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
      </div>
    </section>
  );
}
