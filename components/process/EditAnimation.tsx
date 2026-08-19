"use client";

import React from "react";

export default function EditAnimation() {
  return (
    <div className="ugc-illustration-wrapper" aria-hidden="true">
      <svg
        viewBox="0 0 320 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ugc-svg-canvas edit-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle Ambient Radial Red Glow */}
          <radialGradient
            id="edit-ambient-glow"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#E50914" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
          </radialGradient>

          {/* Scissor Steel Blade Gradient */}
          <linearGradient id="blade-steel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e4e4e7" />
            <stop offset="40%" stopColor="#a1a1aa" />
            <stop offset="100%" stopColor="#3f3f46" />
          </linearGradient>

          {/* Scissor Handle Gradient */}
          <linearGradient id="handle-dark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#121215" />
          </linearGradient>

          {/* Drop Shadows */}
          <filter id="edit-shadow" x="-10%" y="-10%" width="125%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* Ambient Glow */}
        <circle cx="160" cy="110" r="95" fill="url(#edit-ambient-glow)" />

        {/* Background Film Timeline Ticks */}
        <g opacity="0.15" stroke="#ffffff" strokeWidth="0.75" strokeDasharray="3 3">
          <line x1="20" y1="50" x2="300" y2="50" />
          <line x1="20" y1="170" x2="300" y2="170" />
          <line x1="160" y1="20" x2="160" y2="200" />
        </g>

        {/* ── Film Strip Timeline (Left Segment & Right Segment) ── */}
        <g className="edit-film-container" filter="url(#edit-shadow)">
          {/* Left Film Strip Segment */}
          <g className="edit-film-left">
            {/* Base Film Plate */}
            <rect
              x="24"
              y="82"
              width="132"
              height="56"
              rx="6"
              fill="#121216"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1.2"
            />
            {/* Top Sprocket Track */}
            <g fill="#08080a">
              <rect x="34" y="86" width="6" height="5" rx="1" />
              <rect x="52" y="86" width="6" height="5" rx="1" />
              <rect x="70" y="86" width="6" height="5" rx="1" />
              <rect x="88" y="86" width="6" height="5" rx="1" />
              <rect x="106" y="86" width="6" height="5" rx="1" />
              <rect x="124" y="86" width="6" height="5" rx="1" />
              <rect x="142" y="86" width="6" height="5" rx="1" />
            </g>
            {/* Bottom Sprocket Track */}
            <g fill="#08080a">
              <rect x="34" y="129" width="6" height="5" rx="1" />
              <rect x="52" y="129" width="6" height="5" rx="1" />
              <rect x="70" y="129" width="6" height="5" rx="1" />
              <rect x="88" y="129" width="6" height="5" rx="1" />
              <rect x="106" y="129" width="6" height="5" rx="1" />
              <rect x="124" y="129" width="6" height="5" rx="1" />
              <rect x="142" y="129" width="6" height="5" rx="1" />
            </g>
            {/* Video Frame 1 */}
            <rect
              x="36"
              y="95"
              width="48"
              height="30"
              rx="3"
              fill="rgba(229, 9, 20, 0.12)"
              stroke="rgba(229, 9, 20, 0.35)"
              strokeWidth="0.8"
            />
            {/* Video Frame 2 */}
            <rect
              x="92"
              y="95"
              width="48"
              height="30"
              rx="3"
              fill="rgba(255, 255, 255, 0.03)"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.8"
            />
          </g>

          {/* Right Film Strip Segment */}
          <g className="edit-film-right">
            {/* Base Film Plate */}
            <rect
              x="164"
              y="82"
              width="132"
              height="56"
              rx="6"
              fill="#121216"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1.2"
            />
            {/* Top Sprocket Track */}
            <g fill="#08080a">
              <rect x="172" y="86" width="6" height="5" rx="1" />
              <rect x="190" y="86" width="6" height="5" rx="1" />
              <rect x="208" y="86" width="6" height="5" rx="1" />
              <rect x="226" y="86" width="6" height="5" rx="1" />
              <rect x="244" y="86" width="6" height="5" rx="1" />
              <rect x="262" y="86" width="6" height="5" rx="1" />
              <rect x="280" y="86" width="6" height="5" rx="1" />
            </g>
            {/* Bottom Sprocket Track */}
            <g fill="#08080a">
              <rect x="172" y="129" width="6" height="5" rx="1" />
              <rect x="190" y="129" width="6" height="5" rx="1" />
              <rect x="208" y="129" width="6" height="5" rx="1" />
              <rect x="226" y="129" width="6" height="5" rx="1" />
              <rect x="244" y="129" width="6" height="5" rx="1" />
              <rect x="262" y="129" width="6" height="5" rx="1" />
              <rect x="280" y="129" width="6" height="5" rx="1" />
            </g>
            {/* Video Frame 3 */}
            <rect
              x="180"
              y="95"
              width="48"
              height="30"
              rx="3"
              fill="rgba(229, 9, 20, 0.12)"
              stroke="rgba(229, 9, 20, 0.35)"
              strokeWidth="0.8"
            />
            {/* Video Frame 4 */}
            <rect
              x="236"
              y="95"
              width="48"
              height="30"
              rx="3"
              fill="rgba(255, 255, 255, 0.03)"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.8"
            />
          </g>

          {/* Active Red Cut Guide Line */}
          <line
            className="edit-cut-indicator"
            x1="160"
            y1="72"
            x2="160"
            y2="148"
            stroke="#E50914"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        </g>

        {/* Dynamic Cut Flash / Spark */}
        <g className="edit-spark-burst">
          <circle cx="160" cy="110" r="14" fill="#E50914" opacity="0.35" />
          <circle cx="160" cy="110" r="6" fill="#FFFFFF" />
          <line x1="160" y1="94" x2="160" y2="126" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="144" y1="110" x2="176" y2="110" stroke="#FFFFFF" strokeWidth="1.5" />
        </g>

        {/* ── Precision Editorial Scissors ── */}
        <g className="edit-scissors-assembly" filter="url(#edit-shadow)">
          {/* Top Blade & Handle Assembly (Pivots around 140, 110) */}
          <g className="scissors-top-blade">
            {/* Steel Top Blade */}
            <path
              d="M140 110 L 202 88 C 204 87.5, 204 90, 196 98 L 140 110 Z"
              fill="url(#blade-steel-grad)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="0.6"
            />
            {/* Top Handle Stem */}
            <path
              d="M140 110 L 98 68 C 94 64, 86 64, 82 70 C 76 78, 80 90, 92 90 L 140 110 Z"
              fill="url(#handle-dark-grad)"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1"
            />
            {/* Top Loop Cutout */}
            <circle cx="86" cy="78" r="9" fill="#0c0c0f" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
          </g>

          {/* Bottom Blade & Handle Assembly (Pivots around 140, 110) */}
          <g className="scissors-bottom-blade">
            {/* Steel Bottom Blade */}
            <path
              d="M140 110 L 202 132 C 204 132.5, 204 130, 196 122 L 140 110 Z"
              fill="url(#blade-steel-grad)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="0.6"
            />
            {/* Bottom Handle Stem */}
            <path
              d="M140 110 L 98 152 C 94 156, 86 156, 82 150 C 76 142, 80 130, 92 130 L 140 110 Z"
              fill="url(#handle-dark-grad)"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1"
            />
            {/* Bottom Loop Cutout */}
            <circle cx="86" cy="142" r="9" fill="#0c0c0f" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
          </g>

          {/* Center Red Pivot Rivet Bolt */}
          <circle cx="140" cy="110" r="5.5" fill="#1a1a20" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
          <circle cx="140" cy="110" r="3.2" fill="#E50914" />
          <circle cx="140" cy="110" r="1.2" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}
