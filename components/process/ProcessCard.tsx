"use client";

import React from "react";

interface ProcessCardProps {
  stepNumber: string;
  title: string;
  description: string;
  children: React.ReactNode;
  delayIndex?: number;
}

export default function ProcessCard({
  stepNumber,
  title,
  description,
  children,
  delayIndex = 0,
}: ProcessCardProps) {
  return (
    <div
      className="ugc-process-card"
      style={{ "--stagger-delay": `${delayIndex * 70}ms` } as React.CSSProperties}
    >
      {/* Subtle Card Ambient Corner Flare */}
      <div className="ugc-card-ambient-flare" aria-hidden="true" />

      {/* Large Illustrated Motion Graphics Area (55–62% of card) */}
      <div className="ugc-card-illustration-box">
        {children}
      </div>

      {/* Card Text Content Area */}
      <div className="ugc-card-body">
        <div className="ugc-card-header">
          <span className="ugc-card-badge">{stepNumber}</span>
          <h3 className="ugc-card-title">{title}</h3>
        </div>
        <p className="ugc-card-description">{description}</p>
      </div>
    </div>
  );
}
