"use client";

import React from "react";

export default function FilmAnimation() {
  return (
    <div className="ugc-illustration-wrapper" aria-hidden="true">
      <svg
        viewBox="0 0 320 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ugc-svg-canvas film-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle Ambient Radial Red Glow */}
          <radialGradient
            id="film-ambient-glow"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#E50914" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
          </radialGradient>

          {/* Reel Rim Metallic Texture Gradient */}
          <linearGradient id="reel-metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2e2e38" />
            <stop offset="50%" stopColor="#1a1a20" />
            <stop offset="100%" stopColor="#101014" />
          </linearGradient>

          {/* Film Reel Shadow */}
          <filter id="film-reel-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000000" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Ambient Red Atmospheric Glow */}
        <circle cx="140" cy="110" r="95" fill="url(#film-ambient-glow)" />

        {/* Technical Frame Marks & Crosshairs */}
        <g opacity="0.15" stroke="#ffffff" strokeWidth="0.75" strokeDasharray="3 3">
          <circle cx="140" cy="110" r="76" />
          <line x1="140" y1="20" x2="140" y2="200" />
          <line x1="50" y1="110" x2="230" y2="110" />
        </g>

        {/* ── Unspooling Film Strip (Stationary & Animated Tail) ── */}
        <g className="film-strip-flow" filter="url(#film-reel-shadow)">
          {/* Film Track Path */}
          <path
            d="M140 48 C 185 48, 220 70, 240 100 C 260 130, 275 160, 305 165"
            stroke="#121216"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M140 48 C 185 48, 220 70, 240 100 C 260 130, 275 160, 305 165"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="29"
            fill="none"
            strokeLinecap="round"
          />
          {/* Film Glowing Edge Track (Red Accent) */}
          <path
            d="M140 35 C 188 35, 225 60, 245 92 C 265 124, 280 152, 308 152"
            stroke="#E50914"
            strokeWidth="1.5"
            fill="none"
            strokeOpacity="0.75"
          />

          {/* Film Perforations / Sprocket Holes along Path */}
          <g fill="#08080a">
            <rect x="160" y="38" width="4.5" height="4.5" rx="1" />
            <rect x="180" y="44" width="4.5" height="4.5" rx="1" />
            <rect x="202" y="56" width="4.5" height="4.5" rx="1" />
            <rect x="222" y="74" width="4.5" height="4.5" rx="1" />
            <rect x="238" y="96" width="4.5" height="4.5" rx="1" />
            <rect x="252" y="118" width="4.5" height="4.5" rx="1" />
            <rect x="268" y="138" width="4.5" height="4.5" rx="1" />
            <rect x="288" y="152" width="4.5" height="4.5" rx="1" />

            <rect x="156" y="56" width="4.5" height="4.5" rx="1" />
            <rect x="176" y="62" width="4.5" height="4.5" rx="1" />
            <rect x="198" y="74" width="4.5" height="4.5" rx="1" />
            <rect x="218" y="92" width="4.5" height="4.5" rx="1" />
            <rect x="234" y="114" width="4.5" height="4.5" rx="1" />
            <rect x="248" y="136" width="4.5" height="4.5" rx="1" />
            <rect x="264" y="156" width="4.5" height="4.5" rx="1" />
          </g>

          {/* Individual Translucent 35mm Frame Blocks */}
          <rect
            x="200"
            y="68"
            width="18"
            height="22"
            rx="2"
            transform="rotate(32 209 79)"
            fill="rgba(229, 9, 20, 0.15)"
            stroke="rgba(229, 9, 20, 0.45)"
            strokeWidth="1"
          />
          <rect
            x="232"
            y="112"
            width="18"
            height="22"
            rx="2"
            transform="rotate(45 241 123)"
            fill="rgba(229, 9, 20, 0.15)"
            stroke="rgba(229, 9, 20, 0.45)"
            strokeWidth="1"
          />
        </g>

        {/* ── Main Metallic Rotating Film Reel ── */}
        <g filter="url(#film-reel-shadow)">
          {/* Reel Shadow Base / Housing */}
          <circle cx="140" cy="110" r="64" fill="#0c0c0f" />

          {/* Rotating Reel Body */}
          <g className="film-rotating-wheel">
            {/* Outer Flange */}
            <circle
              cx="140"
              cy="110"
              r="62"
              fill="url(#reel-metal-grad)"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.5"
            />

            {/* Outer Red Bevel Ring */}
            <circle
              cx="140"
              cy="110"
              r="58"
              fill="none"
              stroke="#E50914"
              strokeWidth="2.5"
              strokeDasharray="18 4"
            />

            {/* Inner Groove Ring */}
            <circle
              cx="140"
              cy="110"
              r="44"
              fill="none"
              stroke="#262630"
              strokeWidth="2"
            />

            {/* 6 Large Circular Aperture Holes */}
            {/* Top */}
            <circle cx="140" cy="78" r="11" fill="#08080a" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            {/* Top Right */}
            <circle cx="168" cy="94" r="11" fill="#08080a" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            {/* Bottom Right */}
            <circle cx="168" cy="126" r="11" fill="#08080a" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            {/* Bottom */}
            <circle cx="140" cy="142" r="11" fill="#08080a" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            {/* Bottom Left */}
            <circle cx="112" cy="126" r="11" fill="#08080a" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            {/* Top Left */}
            <circle cx="112" cy="94" r="11" fill="#08080a" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            {/* Spindle Hub Core */}
            <circle cx="140" cy="110" r="18" fill="#1e1e24" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.2" />
            <circle cx="140" cy="110" r="10" fill="#E50914" />
            <circle cx="140" cy="110" r="4" fill="#FFFFFF" />
          </g>

          {/* Static Center Spindle Pin */}
          <circle cx="140" cy="110" r="3" fill="#0d0d10" />
        </g>
      </svg>
    </div>
  );
}
