"use client";

import React from "react";

export default function ScriptAnimation() {
  return (
    <div className="ugc-illustration-wrapper" aria-hidden="true">
      <svg
        viewBox="0 0 320 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ugc-svg-canvas script-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle Ambient Radial Red Glow behind document */}
          <radialGradient
            id="script-bg-glow"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#E50914" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
          </radialGradient>

          {/* Document Drop Shadow */}
          <filter id="script-doc-shadow" x="-10%" y="-10%" width="125%" height="130%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.75" />
          </filter>

          {/* Stylus Metallic Gradient */}
          <linearGradient id="stylus-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c2c34" />
            <stop offset="40%" stopColor="#1a1a20" />
            <stop offset="100%" stopColor="#121216" />
          </linearGradient>

          <linearGradient id="stylus-tip-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF333E" />
            <stop offset="100%" stopColor="#B3050E" />
          </linearGradient>
        </defs>

        {/* Ambient Red Glow */}
        <circle cx="160" cy="115" r="95" fill="url(#script-bg-glow)" />

        {/* Decorative Grid / Guide lines in background */}
        <g opacity="0.18" stroke="#ffffff" strokeWidth="0.75" strokeDasharray="3 3">
          <line x1="30" y1="40" x2="290" y2="40" />
          <line x1="30" y1="180" x2="290" y2="180" />
          <line x1="40" y1="20" x2="40" y2="200" />
          <line x1="280" y1="20" x2="280" y2="200" />
        </g>

        {/* ── Document Sheet ── */}
        <g filter="url(#script-doc-shadow)">
          {/* Main Paper */}
          <rect
            x="48"
            y="26"
            width="224"
            height="168"
            rx="12"
            fill="#121216"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.2"
          />

          {/* Subtle Inner Highlight */}
          <rect
            x="49"
            y="27"
            width="222"
            height="166"
            rx="11"
            fill="none"
            stroke="rgba(229, 9, 20, 0.12)"
            strokeWidth="1"
          />

          {/* Top Document Header Bar */}
          <rect
            x="110"
            y="20"
            width="100"
            height="14"
            rx="5"
            fill="#1c1c22"
            stroke="rgba(229, 9, 20, 0.35)"
            strokeWidth="1"
          />
          <circle cx="160" cy="27" r="2.5" fill="#E50914" />

          {/* Tag: UGC HOOK 01 */}
          <rect
            x="64"
            y="44"
            width="64"
            height="16"
            rx="4"
            fill="rgba(229, 9, 20, 0.12)"
            stroke="rgba(229, 9, 20, 0.28)"
            strokeWidth="0.8"
          />
          <text
            x="96"
            y="55"
            textAnchor="middle"
            fill="#E50914"
            fontSize="8"
            fontFamily="var(--font-head), sans-serif"
            fontWeight="800"
            letterSpacing="0.08em"
          >
            HOOK 01
          </text>

          {/* Document status indicator dots */}
          <circle cx="236" cy="52" r="3" fill="#2d2d36" />
          <circle cx="248" cy="52" r="3" fill="#E50914" />
          <circle cx="260" cy="52" r="3" fill="#2d2d36" />

          {/* Line 1: Background Guide */}
          <line
            x1="64"
            y1="82"
            x2="256"
            y2="82"
            stroke="#202028"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Line 1: Active Animated Red Stroke */}
          <line
            className="script-drawn-line line-1"
            x1="64"
            y1="82"
            x2="256"
            y2="82"
            stroke="#E50914"
            strokeWidth="3.5"
            strokeLinecap="round"
            pathLength="100"
          />

          {/* Line 2: Background Guide */}
          <line
            x1="64"
            y1="116"
            x2="242"
            y2="116"
            stroke="#202028"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Line 2: Active Animated Red Stroke */}
          <line
            className="script-drawn-line line-2"
            x1="64"
            y1="116"
            x2="242"
            y2="116"
            stroke="#E50914"
            strokeWidth="3.5"
            strokeLinecap="round"
            pathLength="100"
          />

          {/* Line 3: Background Guide */}
          <line
            x1="64"
            y1="150"
            x2="198"
            y2="150"
            stroke="#202028"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Line 3: Active Animated Red Stroke */}
          <line
            className="script-drawn-line line-3"
            x1="64"
            y1="150"
            x2="198"
            y2="150"
            stroke="#E50914"
            strokeWidth="3.5"
            strokeLinecap="round"
            pathLength="100"
          />
        </g>

        {/* ── Synchronized Animated Stylus / Pencil ── */}
        <g className="script-stylus-group">
          <g transform="rotate(-38)">
            {/* Stylus Body */}
            <rect
              x="-4.5"
              y="-42"
              width="9"
              height="36"
              rx="2.5"
              fill="url(#stylus-body-grad)"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="0.8"
            />
            {/* Stylus Red Accent Band */}
            <rect
              x="-4.5"
              y="-18"
              width="9"
              height="4"
              fill="#E50914"
            />
            {/* Stylus Top Cap */}
            <rect
              x="-3.5"
              y="-45"
              width="7"
              height="4"
              rx="1.5"
              fill="#52525e"
            />
            {/* Stylus Cone Tip */}
            <polygon
              points="-4.5,-6 4.5,-6 0,0"
              fill="url(#stylus-tip-grad)"
            />
            {/* Glowing Active Nib */}
            <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
            <circle cx="0" cy="0" r="4" fill="#FF1F2D" opacity="0.65" />
          </g>
        </g>
      </svg>
    </div>
  );
}
