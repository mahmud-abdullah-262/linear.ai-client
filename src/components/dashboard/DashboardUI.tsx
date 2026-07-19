'use client';

import React from 'react';
import type { Task, TaskPriority, TaskStatus } from '@/types/dashboard';

// ── Priority & Status helpers ────────────────────────────────────────────────

export const PRIORITY_META: Record<TaskPriority, { label: string; color: string; dot: string }> = {
  Critical: { label: 'Critical', color: 'text-red-400',    dot: 'bg-red-500' },
  High:     { label: 'High',     color: 'text-orange-400', dot: 'bg-orange-400' },
  Medium:   { label: 'Medium',   color: 'text-yellow-400', dot: 'bg-yellow-400' },
  Low:      { label: 'Low',      color: 'text-slate-400',  dot: 'bg-slate-500' },
};

export const STATUS_META: Record<TaskStatus, { label: string; bg: string; text: string }> = {
  Backlog:     { label: 'Backlog',     bg: 'bg-slate-700/60',  text: 'text-slate-300' },
  Todo:        { label: 'Todo',        bg: 'bg-blue-900/60',   text: 'text-blue-300'  },
  'In Progress': { label: 'In Progress', bg: 'bg-cyan-900/60',  text: 'text-cyan-300'  },
  Done:        { label: 'Done',        bg: 'bg-emerald-900/60',text: 'text-emerald-300'},
};

export const STATUS_FILL: Record<TaskStatus, string> = {
  Backlog:       '#475569',
  Todo:          '#3b82f6',
  'In Progress': '#06b6d4',
  Done:          '#10b981',
};

// ── Metric Card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: string; // tailwind text colour class for icon
}

export function MetricCard({ label, value, sub, icon, accent = 'text-cyan-400' }: MetricCardProps) {
  return (
    <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-5 flex flex-col gap-3 min-h-[120px] hover:border-cyan-500/30 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</span>
        <span className={`${accent} opacity-80`}>{icon}</span>
      </div>
      <div>
        <p className="text-3xl font-extrabold text-[#F8FAFC] leading-none">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ── Priority Badge ────────────────────────────────────────────────────────────

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { label, color, dot } = PRIORITY_META[priority];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
      {label}
    </span>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: TaskStatus }) {
  const meta = STATUS_META[status] || { label: status || 'Unknown', bg: 'bg-slate-700/60', text: 'text-slate-300' };
  const { label, bg, text } = meta;
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${bg} ${text}`}>
      {label}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────

export function Avatar({ name, src, size = 7 }: { name: string; src?: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeClass = `w-${size} h-${size}`;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover ring-1 ring-slate-600`}
      />
    );
  }
  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white ring-1 ring-slate-600 shrink-0`}
    >
      {initials}
    </div>
  );
}

// ── Task Row ──────────────────────────────────────────────────────────────────

export function TaskRow({ task, showAssignee = true }: { task: Task; showAssignee?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-800/70 last:border-0 hover:bg-slate-800/30 px-2 -mx-2 rounded-lg transition-colors duration-150">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#F8FAFC] truncate">{task.title}</p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{task.shortDescription}</p>
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {task.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        {showAssignee && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <Avatar name={task.assignedTo.name} src={task.assignedTo.avatar} size={5} />
            <span className="text-[10px] text-slate-500 truncate max-w-[80px]">{task.assignedTo.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────

export function SectionCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
