"use client";
import React, { useEffect, useRef, useState } from "react";

export const STATS_DATA = [
  { value: 250, display: "250", suffix: "+", label: "BRANDS SERVED" },
  { value: 15000, display: "15,000", suffix: "+", label: "VIDEOS CREATED" },
  { value: 150, display: "150", suffix: "+", label: "IN-HOUSE CREATORS" },
  { value: 60, display: "60", suffix: "+", label: "PROFESSIONAL TEAM" },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

function StatCounter({ targetValue, displayString }: { targetValue: number; displayString: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRunRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.textContent = displayString;
      hasRunRef.current = true;
      return;
    }

    let rafId: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRunRef.current) {
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
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [targetValue, displayString, prefersReducedMotion]);

  return <span ref={ref} suppressHydrationWarning>0</span>;
}

interface StatsCardProps {
  variant?: "transition" | "original";
  cardRef?: React.Ref<HTMLDivElement>;
  itemRefs?: (el: HTMLDivElement | null, idx: number) => void;
}

export function StatsCard({ variant = "original", cardRef, itemRefs }: StatsCardProps) {
  const isTransition = variant === "transition";

  return (
    <div
      ref={cardRef}
      className={`hero-lens-stats-card ${isTransition ? "transition-stats-card" : "original-stats-card"}`}
      aria-hidden={isTransition ? true : undefined}
    >
      <div className="stats-strip-custom">
        {STATS_DATA.map((stat, idx) => (
          <React.Fragment key={stat.label}>
            {idx > 0 && <div className="stat-divider-custom" aria-hidden="true" />}
            <div
              ref={itemRefs ? (el) => itemRefs(el, idx) : undefined}
              className="hero-lens-stat-item"
            >
              <div className="stat-value-custom">
                <StatCounter targetValue={stat.value} displayString={stat.display} />
                <span className="stat-plus-accent">{stat.suffix}</span>
              </div>
              <div className="stat-label-custom">{stat.label}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
