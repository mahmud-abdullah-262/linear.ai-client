"use client";

import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8 hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all duration-300 shadow-xl">
      {/* Glow Effect on Hover */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Icon Wrapper */}
      <div className="inline-flex items-center justify-center p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-cyan-400 mb-6 group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition-all duration-300 shadow-inner">
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-200">
        {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function Feature() {
  const features = [
    {
      title: "AI Sprint Optimizer",
      description: "Allocates points, forecasts velocity, and scopes sprint capacities using ML trained on your team's historical execution patterns.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Autonomous Backlog Grooming",
      description: "Automatically de-duplicates tickets, writes detailed acceptance criteria, and tags dependencies directly from code commits & user chat logs.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ),
    },
    {
      title: "PR & Issue Auto-Linking",
      description: "Fully tracks issues from creation to code merge. AI parses commit messages and PR descriptions to map issues dynamically, keeping status in sync.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      title: "Predictive Bottleneck Alerts",
      description: "Detects scope creep, inactive tasks, and blocker risks before they impact your release schedule. Delivers smart notifications directly to Slack.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      title: "Semantic Epic Graph",
      description: "Generates beautiful visual dependency charts. Helps PMs instantly identify critical paths and technical debt across multiple code repositories.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "Voice-to-Ticket Capture",
      description: "Dictate tasks during standups or video chats. Linear.ai transcribes your updates and constructs fully formed Jira-compatible issues in seconds.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#0B0F19] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-cyan-400 tracking-wider uppercase mb-3">Core Engine Features</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight sm:text-4xl">
            Agile tasks solved instantly.
          </p>
          <div className="mt-4 text-lg text-slate-400">
            Stop filling checkboxes manually. Let Linear.ai handle your agile operations autonomously while keeping you in absolute control.
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
    </section>
  );
}
