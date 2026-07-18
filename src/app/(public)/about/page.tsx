import React from "react";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 bg-[#0B0F19] text-slate-200 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 flex flex-col gap-12">
        {/* Hero Section */}
        <div className="text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/50">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-6 mb-4">
            About <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">Linear.ai</span>
          </h1>
          <p className="text-base md:text-lg text-cyan-400 font-semibold tracking-wide">
            Work Smarter. Achieve More.
          </p>
        </div>

        {/* Narrative Intro */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8 md:p-10 hover:border-cyan-500/20 transition-all duration-300 shadow-xl leading-relaxed text-slate-300 flex flex-col gap-6">
          <p>
            <strong className="text-white">Linear.ai</strong> is an AI-powered task management platform designed to help individuals and teams organize their work, prioritize what matters, and stay productive every day.
          </p>
          <p>
            Unlike traditional to-do apps, Linear.ai leverages artificial intelligence to simplify planning, automate repetitive tasks, and provide intelligent suggestions based on your workflow. Whether you're managing personal goals, collaborating with a team, or tracking complex projects, Linear.ai helps you stay focused on what truly matters.
          </p>
        </div>

        {/* Two Column Grid: Mission & Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="rounded-xl bg-slate-900/30 border border-slate-800 p-6 md:p-8 flex flex-col gap-4 shadow-lg hover:border-cyan-500/20 transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </span>
              <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">Our Mission</h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our mission is to make productivity effortless by combining intelligent automation with a clean, intuitive user experience. We believe technology should reduce complexity—not create it.
            </p>
          </div>

          {/* Value Card */}
          <div className="rounded-xl bg-slate-900/30 border border-slate-800 p-6 md:p-8 flex flex-col gap-4 shadow-lg hover:border-cyan-500/20 transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-indigo-400 group-hover:border-indigo-500/40 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </span>
              <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">Why Linear.ai?</h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              At Linear.ai, we're building more than a task manager—we're creating an intelligent productivity companion. By understanding your work patterns and helping you make better decisions, Linear.ai enables you to accomplish more with less effort.
            </p>
          </div>
        </div>

        {/* Feature list / What you can do */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8 md:p-10 hover:border-cyan-500/20 transition-all duration-300 shadow-xl flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white">What You Can Do with Linear.ai</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Organize tasks with AI-assisted planning",
              "Set priorities and deadlines intelligently",
              "Receive smart reminders and recommendations",
              "Track progress with real-time insights",
              "Collaborate seamlessly with your team",
              "Stay focused with a distraction-free workspace",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-5 h-5 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Adaptive section */}
        <div className="text-center bg-gradient-to-r from-slate-950/50 via-cyan-950/5 to-slate-950/50 rounded-xl p-8 border border-slate-800/80 flex flex-col items-center gap-4">
          <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
            Whether you're a student, freelancer, entrepreneur, or part of a growing team, Linear.ai adapts to your workflow and empowers you to work with clarity, confidence, and consistency.
          </p>
          <strong className="text-cyan-400 tracking-wider text-sm uppercase">
            Plan smarter. Work faster. Achieve more.
          </strong>
        </div>
      </div>
    </div>
  );
}