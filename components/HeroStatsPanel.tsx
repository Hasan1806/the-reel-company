import React from "react";

export interface StatItem {
  display: string;
  suffix: string;
  label: string;
}

export const HERO_STATS: StatItem[] = [
  { display: "250", suffix: "+", label: "BRANDS SERVED" },
  { display: "15,000", suffix: "+", label: "VIDEOS CREATED" },
  { display: "150", suffix: "+", label: "IN-HOUSE CREATORS" },
  { display: "60", suffix: "+", label: "PROFESSIONAL TEAM" },
];

export default function HeroStatsPanel() {
  return (
    <div className="hero-stats-panel-container" aria-label="Company Statistics">
      <div className="hero-stats-panel">
        {HERO_STATS.map((stat, idx) => (
          <React.Fragment key={stat.label}>
            {idx > 0 && <div className="hero-stat-divider" aria-hidden="true" />}
            <div className="hero-stat-cell">
              <div className="hero-stat-num">
                <span>{stat.display}</span>
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
