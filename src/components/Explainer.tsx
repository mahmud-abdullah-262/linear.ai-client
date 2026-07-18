"use client";

import React, { useState, useEffect } from "react";

interface Step {
  id: number;
  label: string;
  title: string;
  description: string;
  terminalLogs: string[];
  mockCard: React.ReactNode;
}

export default function Explainer() {
  const [activeStep, setActiveStep] = useState(1);
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);

  const steps: Step[] = [
    {
      id: 1,
      label: "Phase 01",
      title: "Context Ingestion",
      description: "Linear.ai ingests workspace contexts from Slack conversations, GitHub pull request discussions, Figma design updates, and email streams.",
      terminalLogs: [
        "Initializing pipeline client...",
        "Connecting to Slack channel #engineering-ops...",
        "Pulling latest PR comments from repository main-api...",
        "Parsing 14 messages about OAuth callbacks...",
        "Success: Context metadata compiled (28.4kb payload)",
      ],
      mockCard: (
        <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 shadow-inner text-xs flex flex-col gap-3">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Slack Ingestion In Progress
          </div>
          <div className="bg-slate-900 p-3 rounded border border-slate-800 text-slate-300">
            <p className="font-semibold text-slate-200">#engineering-devs:</p>
            <p className="italic">"We should probably write a fallback callback URL to handle token expiry errors on the signup page. It currently blocks users."</p>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-900">
            <span>Author: @sarah_dev</span>
            <span className="text-cyan-400">Context Score: 92%</span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      label: "Phase 02",
      title: "Semantic Synthesis",
      description: "Our core LLM identifies issue duplicates, maps cross-project technical dependencies, and synthesizes structured tickets with full acceptance criteria.",
      terminalLogs: [
        "Analyzing ingested context vectors...",
        "Running semantic de-duplication engines...",
        "Found duplicate with high correlation: Issue LIN-184",
        "Resolving dependencies: Blocks deployment epic #4",
        "Writing BDD acceptance criteria templates...",
      ],
      mockCard: (
        <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 shadow-inner text-xs flex flex-col gap-3">
          <div className="flex justify-between items-center text-indigo-400 font-semibold mb-1">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Auto-Synthesizing Issue
            </span>
            <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">LIN-948</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-bold text-slate-200">Title: OAuth callback fallback handler</div>
            <div className="text-[10px] text-slate-400 font-semibold">Acceptance Criteria:</div>
            <ul className="list-disc pl-4 text-slate-400 flex flex-col gap-1 text-[10px]">
              <li>GIVEN token expires during callback sequence</li>
              <li>WHEN user is redirected to registration routes</li>
              <li>THEN render callback fallback alert message</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      label: "Phase 03",
      title: "Predictive Orchestration",
      description: "Linear.ai scopes tasks dynamically, calculates developer load thresholds, and populates sprints to align automatically with releases.",
      terminalLogs: [
        "Compiling current sprint parameters...",
        "Evaluating team average velocity: 48 pts/sprint",
        "Simulating resource capacity thresholds...",
        "Drafting sprint roadmap recommendations...",
        "Agile backlog successfully synchronized.",
      ],
      mockCard: (
        <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 shadow-inner text-xs flex flex-col gap-4">
          <div className="flex items-center justify-between text-teal-400 font-semibold mb-1">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              Sprint Recommendation
            </span>
            <span className="text-slate-500 font-normal">Sprint 42</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">Suggested Capacity</div>
              <div className="text-lg font-bold text-slate-200">38 pts</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">Risk Allocation</div>
              <div className="text-lg font-bold text-teal-400">Low (8%)</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // Reset typing logs when active step changes
    setTypedLogs([]);
    setLogIndex(0);
  }, [activeStep]);

  useEffect(() => {
    const activeStepLogs = steps.find((s) => s.id === activeStep)?.terminalLogs || [];
    if (logIndex < activeStepLogs.length) {
      const timer = setTimeout(() => {
        setTypedLogs((prev) => [...prev, activeStepLogs[logIndex]]);
        setLogIndex((prev) => prev + 1);
      }, 500); // Typetime delay
      return () => clearTimeout(timer);
    }
  }, [logIndex, activeStep]);

  return (
    <section id="explainer" className="py-24 bg-[#0B0F19] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-base font-semibold text-cyan-400 tracking-wider uppercase mb-3">AI Engine Architecture</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            How Linear.ai orchestrates projects.
          </p>
          <p className="mt-4 text-lg text-slate-400">
            A three-tier pipeline working in the background to keep issues, roadmaps, and dev logs in sync.
          </p>
        </div>

        {/* Dynamic Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Interactive Stepper */}
          <div className="flex flex-col gap-6">
            {steps.map((step) => {
              const isSelected = activeStep === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 ${
                    isSelected
                      ? "bg-slate-900/60 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                      : "bg-slate-900/10 border-slate-800/40 hover:border-slate-800 hover:bg-slate-900/20"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        isSelected
                          ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400"
                          : "bg-slate-950 border-slate-800 text-slate-500"
                      }`}
                    >
                      {step.label}
                    </span>
                    <h3 className={`font-bold text-lg ${isSelected ? "text-white" : "text-slate-400"}`}>
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed pl-1">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Terminal Mockup */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 md:p-6 shadow-2xl flex flex-col gap-6 relative overflow-hidden min-h-[420px] justify-between">
            {/* Header bar */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-800"></span>
                <span className="w-3 h-3 rounded-full bg-slate-800"></span>
                <span className="w-3 h-3 rounded-full bg-slate-800"></span>
              </div>
              <span className="text-xs font-mono text-slate-500 select-none">linear-ai-agent.sh</span>
            </div>

            {/* In-Terminal Active Mockup Card Display */}
            <div className="flex-1 flex flex-col justify-center py-4">
              {steps.find((s) => s.id === activeStep)?.mockCard}
            </div>

            {/* Terminal Logging Window */}
            <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-900 font-mono text-xs text-slate-400 min-h-[160px] flex flex-col gap-2 overflow-y-auto">
              {typedLogs.map((log, index) => {
                const isSuccess = log.startsWith("Success") || log.startsWith("Agile");
                const isError = log.includes("Error") || log.includes("correlated");
                return (
                  <div key={index} className="flex gap-2 leading-relaxed">
                    <span className="text-cyan-500 select-none">&gt;</span>
                    <span className={isSuccess ? "text-cyan-400 font-semibold" : isError ? "text-indigo-400 font-medium" : "text-slate-400"}>
                      {log}
                    </span>
                  </div>
                );
              })}
              {logIndex < (steps.find((s) => s.id === activeStep)?.terminalLogs.length || 0) && (
                <div className="flex gap-2">
                  <span className="text-cyan-500 select-none">&gt;</span>
                  <span className="w-2 h-4 bg-cyan-400 animate-pulse"></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
    </section>
  );
}
