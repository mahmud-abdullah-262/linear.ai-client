"use client";

import React, { useState } from "react";
import { AnimatedSection, AnimatedCard } from "@/components/shared/MotionWrapper";

interface DataPoint {
  day: string;
  tasksRemaining: number;
  aiVelocity: number;
}

const mockData: DataPoint[] = [
  { day: "Mon", tasksRemaining: 120, aiVelocity: 10 },
  { day: "Tue", tasksRemaining: 98, aiVelocity: 25 },
  { day: "Wed", tasksRemaining: 74, aiVelocity: 42 },
  { day: "Thu", tasksRemaining: 55, aiVelocity: 68 },
  { day: "Fri", tasksRemaining: 32, aiVelocity: 89 },
  { day: "Sat", tasksRemaining: 18, aiVelocity: 110 },
  { day: "Sun", tasksRemaining: 4, aiVelocity: 135 },
];

export default function Stats() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions & margins
  const width = 600;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions helper
  const getX = (index: number) => padding.left + (index / (mockData.length - 1)) * chartWidth;
  const getYTasks = (value: number) => {
    const maxVal = 140;
    return padding.top + chartHeight - (value / maxVal) * chartHeight;
  };
  const getYVelocity = (value: number) => {
    const maxVal = 140;
    return padding.top + chartHeight - (value / maxVal) * chartHeight;
  };

  // Generate SVG path for Tasks Remaining
  let tasksPath = `M ${getX(0)} ${getYTasks(mockData[0].tasksRemaining)}`;
  for (let i = 1; i < mockData.length; i++) {
    tasksPath += ` L ${getX(i)} ${getYTasks(mockData[i].tasksRemaining)}`;
  }

  // Generate SVG path for AI Velocity
  let velocityPath = `M ${getX(0)} ${getYVelocity(mockData[0].aiVelocity)}`;
  for (let i = 1; i < mockData.length; i++) {
    velocityPath += ` L ${getX(i)} ${getYVelocity(mockData[i].aiVelocity)}`;
  }

  // Generate area path for Tasks Remaining gradient fill
  let tasksAreaPath = `${tasksPath} L ${getX(mockData.length - 1)} ${padding.top + chartHeight} L ${getX(0)} ${padding.top + chartHeight} Z`;

  // Generate area path for AI Velocity gradient fill
  let velocityAreaPath = `${velocityPath} L ${getX(mockData.length - 1)} ${padding.top + chartHeight} L ${getX(0)} ${padding.top + chartHeight} Z`;

  return (
    <section id="analytics" className="py-24 bg-[#0B0F19] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-base font-semibold text-cyan-400 tracking-wider uppercase mb-3">Live Sprint Analytics</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Watch your productivity double.
            </p>
            <p className="mt-4 text-slate-400 text-base leading-relaxed">
              Track backlog progress, automated completions, and real-time developer metrics in a consolidated telemetry cockpit.
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
              <span className="text-slate-300">Remaining Backlog</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></span>
              <span className="text-slate-300">AI Task Resolution</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Grid: Chart on Left, Metric Cards on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Interactive Chart Card */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 md:p-8 flex flex-col justify-between shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Active Sprint Burndown</h3>
                <p className="text-xs text-slate-500">Live updating graph of the current milestone execution</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-900/50 text-[10px] font-bold text-cyan-400 tracking-wider uppercase animate-pulse">
                Live Telemetry
              </span>
            </div>

            {/* SVG Interactive Chart */}
            <div className="relative w-full aspect-[5/2] min-h-[220px]">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="tasksGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Y-axis gridlines */}
                {[0, 35, 70, 105, 140].map((val, idx) => {
                  const y = getYTasks(val);
                  return (
                    <g key={idx} className="opacity-10">
                      <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                      <text x={padding.left - 10} y={y + 4} fill="#e2e8f0" fontSize="10" textAnchor="end">{val}</text>
                    </g>
                  );
                })}

                {/* X-axis labels */}
                {mockData.map((d, idx) => {
                  const x = getX(idx);
                  return (
                    <text key={idx} x={x} y={height - padding.bottom + 24} fill="#64748b" fontSize="10" textAnchor="middle" className="font-semibold select-none">
                      {d.day}
                    </text>
                  );
                })}

                {/* Area paths */}
                <path d={tasksAreaPath} fill="url(#tasksGradient)" />
                <path d={velocityAreaPath} fill="url(#velocityGradient)" />

                {/* Line paths */}
                <path d={tasksPath} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_2px_8px_rgba(6,182,212,0.3)]" />
                <path d={velocityPath} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_2px_8px_rgba(99,102,241,0.3)]" />

                {/* Vertical hover line indicator */}
                {hoveredIndex !== null && (
                  <line
                    x1={getX(hoveredIndex)}
                    y1={padding.top}
                    x2={getX(hoveredIndex)}
                    y2={height - padding.bottom}
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="opacity-60"
                  />
                )}

                {/* Interactive Points / Hover Triggers */}
                {mockData.map((d, idx) => {
                  const x = getX(idx);
                  const yTasks = getYTasks(d.tasksRemaining);
                  const yVelocity = getYVelocity(d.aiVelocity);

                  return (
                    <g key={idx}>
                      {/* Transparent wider vertical hit target for easier hover */}
                      <rect
                        x={x - 20}
                        y={padding.top}
                        width="40"
                        height={chartHeight}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      />

                      {/* Visible points on hover */}
                      {hoveredIndex === idx && (
                        <>
                          <circle cx={x} cy={yTasks} r="6" fill="#0b0f19" stroke="#06b6d4" strokeWidth="3" />
                          <circle cx={x} cy={yVelocity} r="6" fill="#0b0f19" stroke="#6366f1" strokeWidth="3" />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic Floating Tooltip */}
              {hoveredIndex !== null && (
                <div
                  className="absolute pointer-events-none bg-slate-950/95 border border-cyan-500/40 rounded-xl px-4 py-2.5 shadow-[0_4px_20px_rgba(6,182,212,0.15)] flex flex-col gap-1 transition-all duration-75 text-xs z-20"
                  style={{
                    left: `${((getX(hoveredIndex) - padding.left) / chartWidth) * 80 + 10}%`,
                    top: "10%",
                  }}
                >
                  <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1">
                    Day: {mockData[hoveredIndex].day}
                  </p>
                  <p className="text-cyan-400 font-medium flex justify-between gap-4">
                    <span>Backlog:</span>
                    <span className="font-bold">{mockData[hoveredIndex].tasksRemaining} issues</span>
                  </p>
                  <p className="text-indigo-400 font-medium flex justify-between gap-4">
                    <span>AI Resolved:</span>
                    <span className="font-bold">{mockData[hoveredIndex].aiVelocity} pts</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Metric Stats Cards Stacked */}
          <div className="flex flex-col gap-6 justify-between">
            {/* Stats Card 1 */}
            <AnimatedCard delay={0.05} className="relative group overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-colors duration-300 shadow-xl flex-1">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sprint Velocity Boost</p>
                <h4 className="text-4xl font-extrabold text-white mt-2 group-hover:text-cyan-300 transition-colors duration-200">+18%</h4>
              </div>
              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                Aggressive forecast models yield a significant boost in deliverable commits during each biweekly sprint.
              </p>
            </AnimatedCard>

            {/* Stats Card 2 */}
            <AnimatedCard delay={0.12} className="relative group overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-colors duration-300 shadow-xl flex-1">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Automation Rate</p>
                <h4 className="text-4xl font-extrabold text-white mt-2 group-hover:text-cyan-300 transition-colors duration-200">74%</h4>
              </div>
              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                Three out of four issues are automatically generated, structured, and closed via semantic PR linking.
              </p>
            </AnimatedCard>

            {/* Stats Card 3 */}
            <AnimatedCard delay={0.19} className="relative group overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-colors duration-300 shadow-xl flex-1">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cycle Time Reduction</p>
                <h4 className="text-4xl font-extrabold text-white mt-2 group-hover:text-cyan-300 transition-colors duration-200">-4.2 Days</h4>
              </div>
              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                Tickets flow from backlog triage to staging environments significantly faster by stripping administration.
              </p>
            </AnimatedCard>
          </div>
        </div>
      </div>
      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
    </section>
  );
}
