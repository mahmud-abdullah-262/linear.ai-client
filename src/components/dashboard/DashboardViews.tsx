'use client';

import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import type { Task, CurrentUser, StatusChartEntry, TeamLoadEntry } from '@/types/dashboard';
import {
  MetricCard, SectionCard, TaskRow, EmptyState,
  STATUS_FILL, Avatar,
} from './DashboardUI';

// ── Icons ────────────────────────────────────────────────────────────────────

const IconTasks = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const IconAlert = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
  </svg>
);
const IconProgress = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ── Custom Tooltip ─────────────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill?: string }>;
  label?: string;
}

function CustomBarTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-bold text-[#F8FAFC] mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill ?? '#06B6D4' }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

function CustomPieTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p style={{ color: p.fill ?? '#06B6D4' }} className="font-bold">{p.name}</p>
      <p className="text-[#F8FAFC]">Count: <span className="font-bold">{p.value}</span></p>
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────

interface AdminDashboardProps {
  tasks: Task[];
  currentUser: CurrentUser;
}

export function AdminDashboard({ tasks, currentUser }: AdminDashboardProps) {
  // ── Metrics ──
  const total = tasks.length;
  const criticalCount = useMemo(() => tasks.filter((t) => t.priority === 'Critical').length, [tasks]);
  const inProgressCount = useMemo(() => tasks.filter((t) => t.status === 'In Progress').length, [tasks]);
  const doneCount = useMemo(() => tasks.filter((t) => t.status === 'Done').length, [tasks]);
  const completedRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  // ── Status chart data ──
  const statusData = useMemo<StatusChartEntry[]>(() => {
    const counts: Record<string, number> = {};
    tasks.forEach((t) => {
      if (t && t.status) {
        counts[t.status] = (counts[t.status] ?? 0) + 1;
      }
    });
    return Object.entries(counts).map(([status, count]) => ({
      status: status as StatusChartEntry['status'],
      count,
      fill: STATUS_FILL[status as StatusChartEntry['status']] ?? '#475569',
    }));
  }, [tasks]);

  // ── Team load chart data ──
  const teamData = useMemo<TeamLoadEntry[]>(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      if (t && t.assignedTo && t.assignedTo.name) {
        const name = t.assignedTo.name.split(' ')[0]; // first name for brevity
        map[name] = (map[name] ?? 0) + 1;
      }
    });
    return Object.entries(map)
      .map(([name, tasks]) => ({ name, tasks }))
      .sort((a, b) => b.tasks - a.tasks)
      .slice(0, 8);
  }, [tasks]);

  // ── Recent tasks ──
  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
        .slice(0, 8),
    [tasks]
  );



  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Project-wide view · {total} tasks tracked
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-[#1E293B] border border-slate-700/60 rounded-xl px-4 py-2">
          <Avatar name={currentUser.name} size={7} />
          <div>
            <p className="text-xs font-bold text-[#F8FAFC]">{currentUser.name}</p>
            <p className="text-[10px] text-cyan-400 uppercase font-semibold tracking-wider">Admin</p>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Tasks"
          value={total}
          sub="across all members"
          icon={<IconTasks />}
          accent="text-cyan-400"
        />
        <MetricCard
          label="Critical Blockers"
          value={criticalCount}
          sub={`${total > 0 ? Math.round((criticalCount / total) * 100) : 0}% of backlog`}
          icon={<IconAlert />}
          accent="text-red-400"
        />
        <MetricCard
          label="In Progress"
          value={inProgressCount}
          sub="currently active"
          icon={<IconProgress />}
          accent="text-yellow-400"
        />
        <MetricCard
          label="Completed Rate"
          value={`${completedRate}%`}
          sub={`${doneCount} tasks done`}
          icon={<IconCheck />}
          accent="text-emerald-400"
        />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status Breakdown Bar Chart */}
        <SectionCard title="Project Velocity" subtitle="Tasks by current status">
          {statusData.length === 0 ? (
            <EmptyState message="No status data available" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statusData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="status"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" name="Tasks" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        {/* Team Load Bar Chart */}
        <SectionCard title="Team Loading" subtitle="Tasks assigned per member">
          {teamData.length === 0 ? (
            <EmptyState message="No assignment data" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={teamData} layout="vertical" margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <XAxis
                  type="number"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={64}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="tasks" name="Tasks" fill="#06B6D4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      {/* ── Global Activity Grid ── */}
      <SectionCard
        title="Global Activity"
        subtitle="Most recently created tasks across all members"
        action={
          <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider border border-cyan-500/30 px-2 py-0.5 rounded-md bg-cyan-950/30">
            Admin View
          </span>
        }
      >
        {recentTasks.length === 0 ? (
          <EmptyState message="No tasks found" />
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Task', 'Status', 'Priority', 'Assigned To', 'Created By', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-500 pb-2 pr-4 first:pl-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task) => (
                  <tr
                    key={task._id}
                    className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/25 transition-colors"
                  >
                    <td className="py-3 pr-4 max-w-[180px]">
                      <p className="font-semibold text-[#F8FAFC] truncate text-xs">{task.title}</p>
                      <p className="text-slate-500 text-[10px] truncate mt-0.5">{task.shortDescription}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold
                          ${{
                            Backlog: 'bg-slate-700/60 text-slate-300',
                            Todo: 'bg-blue-900/60 text-blue-300',
                            'In Progress': 'bg-cyan-900/60 text-cyan-300',
                            Done: 'bg-emerald-900/60 text-emerald-300',
                          }[task.status]}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-[10px] font-bold
                          ${{
                            Critical: 'text-red-400',
                            High: 'text-orange-400',
                            Medium: 'text-yellow-400',
                            Low: 'text-slate-400',
                          }[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assignedTo.name} src={task.assignedTo.avatar} size={6} />
                        <span className="text-[11px] text-slate-300 truncate max-w-[80px]">{task.assignedTo.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-[11px] text-slate-400">{task.createdBy.name}</span>
                    </td>
                    <td className="py-3">
                      <button className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 px-2 py-1 rounded-md transition-colors bg-cyan-950/20 hover:bg-cyan-950/40">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ── Member Dashboard ──────────────────────────────────────────────────────────

interface MemberDashboardProps {
  tasks: Task[];
  currentUser: CurrentUser;
}

export function MemberDashboard({ tasks, currentUser }: MemberDashboardProps) {
  // Filter to only this user's tasks
  const myTasks = useMemo(
    () => tasks.filter((t) => t.assignedTo._id === currentUser._id),
    [tasks, currentUser._id]
  );

  const myActive = useMemo(() => myTasks.filter((t) => t.status === 'In Progress').length, [myTasks]);
  const myTodo = useMemo(() => myTasks.filter((t) => t.status === 'Todo' || t.status === 'Backlog').length, [myTasks]);
  const myDone = useMemo(() => myTasks.filter((t) => t.status === 'Done').length, [myTasks]);

  const criticalItems = useMemo(
    () => myTasks.filter((t) => t.priority === 'Critical' && t.status !== 'Done'),
    [myTasks]
  );

  const assignedItems = useMemo(
    () => myTasks.filter((t) => t.status !== 'Done').sort((a, b) => {
      const order: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
    }),
    [myTasks]
  );

  // Donut chart data
  const donutData = useMemo(() => {
    const counts: Record<string, number> = {};
    myTasks.forEach((t) => {
      counts[t.status] = (counts[t.status] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([status, value]) => ({
        name: status,
        value,
        fill: STATUS_FILL[status as keyof typeof STATUS_FILL] ?? '#475569',
      }))
      .filter((d) => d.value > 0);
  }, [myTasks]);

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = (props: {
    cx?: number; cy?: number; midAngle?: number;
    innerRadius?: number; outerRadius?: number; percent?: number;
  }) => {
    const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#F8FAFC" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
            My Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Personal workload · {myTasks.length} tasks assigned to you
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-[#1E293B] border border-slate-700/60 rounded-xl px-4 py-2">
          <Avatar name={currentUser.name} size={7} />
          <div>
            <p className="text-xs font-bold text-[#F8FAFC]">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Member</p>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Active Tasks"
          value={myActive}
          sub="currently in progress"
          icon={<IconProgress />}
          accent="text-cyan-400"
        />
        <MetricCard
          label="Pending"
          value={myTodo}
          sub="todo + backlog"
          icon={<IconTasks />}
          accent="text-yellow-400"
        />
        <MetricCard
          label="Completed"
          value={myDone}
          sub={`of ${myTasks.length} total`}
          icon={<IconCheck />}
          accent="text-emerald-400"
        />
      </div>

      {/* ── Main Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Critical Priority Items */}
        <SectionCard
          title="🚨 Critical Items"
          subtitle="Unresolved critical priority tasks"
        >
          {criticalItems.length === 0 ? (
            <EmptyState message="No critical blockers — great work!" />
          ) : (
            <div>
              {criticalItems.map((task) => (
                <TaskRow key={task._id} task={task} showAssignee={false} />
              ))}
            </div>
          )}
        </SectionCard>

        {/* Assigned To Me list */}
        <SectionCard
          title="Assigned to Me"
          subtitle="All open tasks sorted by priority"
        >
          {assignedItems.length === 0 ? (
            <EmptyState message="All tasks completed!" />
          ) : (
            <div className="max-h-[420px] overflow-y-auto pr-1 scrollbar-none">
              {assignedItems.map((task) => (
                <TaskRow key={task._id} task={task} showAssignee={false} />
              ))}
            </div>
          )}
        </SectionCard>

        {/* Status Donut Chart */}
        <SectionCard title="My Task Breakdown" subtitle="Distribution by status">
          {donutData.length === 0 ? (
            <EmptyState message="No tasks to display" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => (
                    <span style={{ color: '#94a3b8', fontSize: 11 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
