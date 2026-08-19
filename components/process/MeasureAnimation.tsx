"use client";

import React from "react";

export default function MeasureAnimation() {
  return (
    <div className="ugc-illustration-wrapper" aria-hidden="true">
      <svg
        viewBox="0 0 320 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ugc-svg-canvas measure-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Ambient Red Glow */}
          <radialGradient
            id="measure-ambient-glow"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#E50914" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
          </radialGradient>

          {/* Sweeping Wedge Gradient */}
          <radialGradient id="measure-sweep-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E50914" stopOpacity="0" />
            <stop offset="70%" stopColor="#E50914" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF2733" stopOpacity="0.85" />
          </radialGradient>

          {/* Drop Shadows */}
          <filter id="measure-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000000" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Ambient Red Glow */}
        <circle cx="160" cy="110" r="95" fill="url(#measure-ambient-glow)" />

        {/* ── Outer HUD Framing ── */}
        <g opacity="0.2" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 3">
          <line x1="40" y1="110" x2="280" y2="110" />
          <line x1="160" y1="20" x2="160" y2="200" />
          <rect x="70" y="25" width="180" height="170" rx="8" />
        </g>

        {/* Corner HUD framing brackets */}
        <g stroke="#E50914" strokeWidth="1.5" strokeLinecap="round" opacity="0.65">
          <path d="M 64 35 L 64 25 L 74 25" />
          <path d="M 256 35 L 256 25 L 246 25" />
          <path d="M 64 185 L 64 195 L 74 195" />
          <path d="M 256 185 L 256 195 L 246 195" />
        </g>

        {/* ── Film Countdown Target Core ── */}
        <g filter="url(#measure-shadow)">
          {/* Main Dark Target Circle */}
          <circle
            cx="160"
            cy="110"
            r="66"
            fill="#101014"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.5"
          />

          {/* Concentric Calibration Circles */}
          <circle
            cx="160"
            cy="110"
            r="54"
            fill="none"
            stroke="#1f1f26"
            strokeWidth="1.5"
          />
          <circle
            cx="160"
            cy="110"
            r="40"
            fill="none"
            stroke="#282832"
            strokeWidth="1"
          />

          {/* Thin Outer Red Ring */}
          <circle
            cx="160"
            cy="110"
            r="66"
            fill="none"
            stroke="#E50914"
            strokeWidth="1.5"
            strokeDasharray="24 8"
            opacity="0.8"
          />

          {/* ── Rotating Red Countdown Wedge / Radar Sweep ── */}
          <g className="measure-rotating-sector">
            {/* The sweeping radar sector path */}
            <path
              d="M 160 110 L 160 44 A 66 66 0 0 1 226 110 Z"
              fill="url(#measure-sweep-grad)"
            />
            {/* Active Leading Laser Line */}
            <line
              x1="160"
              y1="110"
              x2="160"
              y2="44"
              stroke="#FF333E"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* Crosshair lines inside circle */}
          <g stroke="#32323e" strokeWidth="1">
            <line x1="160" y1="44" x2="160" y2="176" />
            <line x1="94" y1="110" x2="226" y2="110" />
          </g>

          {/* Central Target Ring */}
          <circle
            cx="160"
            cy="110"
            r="24"
            fill="#0b0b0e"
            stroke="rgba(229, 9, 20, 0.3)"
            strokeWidth="1.2"
          />

          {/* ── Synchronized Cycling Countdown Numbers ── */}
          <g className="measure-countdown-numbers">
            {/* Number 3 */}
            <text
              className="countdown-num num-3"
              x="160"
              y="124"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="38"
              fontFamily="var(--font-head), sans-serif"
              fontWeight="900"
              letterSpacing="-0.04em"
            >
              3
            </text>

            {/* Number 2 */}
            <text
              className="countdown-num num-2"
              x="160"
              y="124"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="38"
              fontFamily="var(--font-head), sans-serif"
              fontWeight="900"
              letterSpacing="-0.04em"
            >
              2
            </text>

            {/* Number 1 */}
            <text
              className="countdown-num num-1"
              x="160"
              y="124"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="38"
              fontFamily="var(--font-head), sans-serif"
              fontWeight="900"
              letterSpacing="-0.04em"
            >
              1
            </text>
          </g>

          {/* Film Leader Sync Indicator */}
          <circle cx="160" cy="110" r="2.5" fill="#E50914" />
        </g>
      </svg>
    </div>
  );
}
