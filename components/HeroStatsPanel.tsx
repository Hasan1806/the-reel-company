"use client";

import React, { useEffect, useRef, useState } from "react";

export interface StatItem {
  value: number;
  display: string;
  suffix: string;
  label: string;
}

export const HERO_STATS: StatItem[] = [
  { value: 250, display: "250", suffix: "+", label: "BRANDS SERVED" },
  { value: 15000, display: "15,000", suffix: "+", label: "VIDEOS CREATED" },
  { value: 150, display: "150", suffix: "+", label: "IN-HOUSE CREATORS" },
  { value: 60, display: "60", suffix: "+", label: "PROFESSIONAL TEAM" },
];

function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

function StatNumberCounter({ targetValue, displayString }: { targetValue: number; displayString: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      el.textContent = displayString;
      return;
    }

    let rafId: number | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRunRef.current) {
          hasRunRef.current = true;
          const duration = 1200;
          let startTime: number | null = null;

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const ratio = Math.min(progress / duration, 1);
            const eased = easeOutQuart(ratio);
            const currentVal = Math.floor(eased * targetValue);

            if (el) {
              el.textContent =
                currentVal >= targetValue
                  ? displayString
                  : currentVal.toLocaleString("en-US");
            }

            if (progress < duration) {
              rafId = window.requestAnimationFrame(step);
            } else if (el) {
              el.textContent = displayString;
            }
          };

          rafId = window.requestAnimationFrame(step);
          observer.unobserve(el);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [targetValue, displayString]);

  return <span ref={ref} suppressHydrationWarning>0</span>;
}

export default function HeroStatsPanel() {
  return (
    <div className="hero-stats-panel-container" aria-label="Company Statistics">
      <div className="hero-stats-panel">
        {HERO_STATS.map((stat, idx) => (
          <React.Fragment key={stat.label}>
            {idx > 0 && <div className="hero-stat-divider" aria-hidden="true" />}
            <div className="hero-stat-cell">
              <div className="hero-stat-num">
                <StatNumberCounter targetValue={stat.value} displayString={stat.display} />
                <span className="hero-stat-plus">{stat.suffix}</span>
              </div>
              <div className="hero-stat-label">{stat.label}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
