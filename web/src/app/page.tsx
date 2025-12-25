"use client";

import { useEffect } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { AgentArchitecture } from "@/components/sections/AgentArchitecture";
import { AgentNetworkSVG } from "@/components/sections/AgentNetworkSVG";
import { LiveSimulation } from "@/components/sections/LiveSimulation";
import { DayTimeline } from "@/components/sections/DayTimeline";
import { Swarm } from "@/components/sections/Swarm";
import { OutcomeScenarios } from "@/components/sections/OutcomeScenarios";
import { Features } from "@/components/sections/Features";
import { MemoryPreview } from "@/components/sections/MemoryPreview";
import { NotAChatbot } from "@/components/sections/NotAChatbot";
import { Footer } from "@/components/sections/Footer";
import GradualBlur from "@/components/ui/GradualBlur";

export default function LandingPage() {
  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-brand-500/30 overflow-x-hidden relative">
      <SmoothScroll />

      {/* Layout Components */}
      <Header />

      {/* Page Sections */}
      <main id="hero">
        <Hero />
        <Problem />
        <AgentArchitecture />
        <AgentNetworkSVG />
        <LiveSimulation />
        <DayTimeline />
        <Swarm />
        <OutcomeScenarios />
        <Features />
        <MemoryPreview />
        <NotAChatbot />
      </main>

      <Footer />

      {/* Gradual Blur - Bottom of viewport */}
      <GradualBlur
        position="bottom"
        target="page"
        height="6rem"
        strength={1.5}
        divCount={5}
        curve="bezier"
        opacity={1}
      />
    </div>
  );
}
