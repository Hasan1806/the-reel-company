"use client";

import React from "react";
import Link from "next/link";
import HeroCurvedShowcase from "./HeroCurvedShowcase";
import HeroStatsPanel from "./HeroStatsPanel";

interface ReelCompanyHeroProps {
  openDiscoveryModal?: (e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  openPortfolioModal?: (e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  handleAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export default function ReelCompanyHero({
  openDiscoveryModal,
  openPortfolioModal,
  handleAnchorClick,
}: ReelCompanyHeroProps) {
  return (
    <section id="hero" className="hero-redesign-section" aria-label="The Reel Company Hero">
      {/* Background ambient lighting */}
      <div className="hero-ambient-glow" aria-hidden="true" />
      <div className="hero-radial-mesh" aria-hidden="true" />

      {/* Top Header Content Area */}
      <div className="hero-header-block">
        <h1 className="hero-brand-headline">
          The Reel Company
        </h1>

        <div className="hero-brand-subheading">
          <p className="hero-sub-p1">
            From scroll-stopping organic content to high-performing ads, AI videos, UGC, YouTube, and brand films—we do it all.
          </p>
          <p className="hero-sub-p2">
            One team. One seamless workflow. 2× faster execution, at up to 50% lower costs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="hero-action-buttons">
          <button
            type="button"
            id="hero-view-work-btn"
            className="btn btn-outline hero-cta-btn hero-view-work-btn"
            onClick={(e) => handleAnchorClick(e as any, "#portfolio")}
          >
            View our Work
          </button>
          <Link
            href="/contact"
            id="hero-book-call-btn"
            className="btn btn-red hero-cta-btn hero-book-call-btn"
          >
            Book a Call
          </Link>
        </div>
      </div>

      {/* Main Visual Feature: 12-Video Continuous Curved Showcase */}
      <div className="hero-curved-stream-wrapper">
        <HeroCurvedShowcase />
      </div>

      {/* Statistics Credibility Panel */}
      <div className="hero-stats-wrapper">
        <HeroStatsPanel />
      </div>
    </section>
  );
}
