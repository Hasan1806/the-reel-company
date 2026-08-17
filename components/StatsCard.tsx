import React from "react";

export const STATS_DATA = [
  { value: "300", suffix: "+", label: "VIDEOS / WEEK" },
  { value: "50", suffix: "+", label: "BRANDS SERVED EVERY MONTH" },
  { value: "1000", suffix: "+", label: "ARTISTS ENROLLED" },
  { value: "3", suffix: "x", label: "AVG. ROAS IMPROVEMENT" },
  { value: "500", suffix: "+", label: "TRUSTED BRANDS" },
];

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
                {stat.value}
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
