"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import {
    ArrowRight,
    Sparkles,
    UserRound,
    ShieldCheck,
    CalendarClock,
    Tag,
    Layers,
    Info,
} from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "../../types/taskTypes";

interface TaskDetailsViewProps {
    task: Task;
}

const WORKSPACE_PATH = "/task/manage";

const PRIORITY_STYLES: Record<
    TaskPriority,
    { label: string; className: string }
> = {
    Low: {
        label: "Low priority",
        className: "border-slate-600/60 bg-slate-700/40 text-slate-300",
    },
    Medium: {
        label: "Medium priority",
        className: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    },
    High: {
        label: "High priority",
        className: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    },
    Critical: {
        label: "Critical priority",
        className:
            "border-rose-500/50 bg-rose-500/15 text-rose-300 shadow-[0_0_16px_-4px_rgba(244,63,94,0.6)]",
    },
};

const STATUS_STYLES: Record<TaskStatus, { className: string }> = {
    Backlog: { className: "border-slate-600/60 bg-slate-700/40 text-slate-300" },
    Todo: { className: "border-slate-500/50 bg-slate-600/40 text-slate-200" },
    "In Progress": {
        className: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
    },
    Done: {
        className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    },
};

const formatDate = (isoString: string): string => {
    const parsed = new Date(isoString);
    if (Number.isNaN(parsed.getTime())) {
        return isoString;
    }
    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const WorkspaceCtaButton = ({
    onClick,
    className = "",
}: {
    onClick: () => void;
    className?: string;
}) => (
    <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.04, x: 2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`group inline-flex items-center gap-2 rounded-xl bg-[#06B6D4] px-5 py-2.5 text-sm font-semibold text-[#0B1120] shadow-[0_0_20px_-4px_rgba(6,182,212,0.7)] transition-shadow duration-300 hover:shadow-[0_0_28px_-2px_rgba(6,182,212,0.9)] ${className}`}
    >
        Go to Workspace
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </motion.button>
);

export const TaskDetailsView = ({ task }: TaskDetailsViewProps) => {
    const router = useRouter();

    const goToWorkspace = () => {
        router.push(`${WORKSPACE_PATH}?focus=${task._id}`);
    };

    const priorityStyle = PRIORITY_STYLES[task.priority];
    const statusStyle = STATUS_STYLES[task.status];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-[#0B0F19] pb-28 text-[#F8FAFC] lg:pb-10"
        >
            {/* Top navigation & workspace CTA header */}
            <header className="sticky top-0 z-20 border-b border-slate-700/60 bg-[#0B0F19]/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="rounded-md border border-slate-600/60 bg-slate-800/60 px-2 py-1 font-mono text-xs text-slate-400">
                            #{task._id.slice(-6).toUpperCase()}
                        </span>
                        <h1 className="truncate text-sm font-medium text-slate-300 sm:text-base">
                            {task.title}
                        </h1>
                    </div>

                    <WorkspaceCtaButton onClick={goToWorkspace} className="hidden sm:inline-flex" />
                    <motion.button
                        type="button"
                        onClick={goToWorkspace}
                        whileTap={{ scale: 0.94 }}
                        aria-label="Go to Workspace"
                        className="inline-flex items-center justify-center rounded-lg bg-[#06B6D4] p-2.5 text-[#0B1120] shadow-[0_0_16px_-4px_rgba(6,182,212,0.7)] sm:hidden"
                    >
                        <ArrowRight className="h-4 w-4" />
                    </motion.button>
                </div>
            </header>

            {/* Main task readout container */}
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
                    {/* Primary column — 70% */}
                    <section className="space-y-6 lg:col-span-7">

                        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6">
                            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-cyan-400">
                                <Layers className="h-3.5 w-3.5" />
                                Task
                            </div>
                            <h2 className="mt-2 text-2xl font-semibold text-[#F8FAFC] sm:text-3xl">
                                {task.title}
                            </h2>
                            <p className="mt-3 text-base leading-relaxed text-slate-300">
                                {task.shortDescription}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                                Full description
                            </h3>
                            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-200">
                                {task.fullDescription}
                            </p>
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/[0.06] p-5">
                            <Info className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                            <p className="text-sm leading-relaxed text-cyan-100">
                                This is a read-only readout. To change status, run automations,
                                or consult the AI Co-Pilot for this task, open it inside the
                                main Workspace.
                            </p>
                        </div>
                    </section>

                    {/* Sidebar metadata column — 30% */}
                    <aside className="space-y-4 lg:col-span-3">
                        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Priority
                            </h3>
                            <span
                                className={`mt-2 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${priorityStyle.className}`}
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                {priorityStyle.label}
                            </span>

                            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Status
                            </h3>
                            <span
                                className={`mt-2 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${statusStyle.className}`}
                            >
                                {task.status}
                            </span>
                        </div>

                        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5">
                            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                <UserRound className="h-3.5 w-3.5" />
                                Assigned to
                            </h3>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-600/60 bg-slate-700">
                                    <Image
                                        src={task.assignedTo.avatar}
                                        alt={task.assignedTo.name}
                                        fill
                                        sizes="40px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-[#F8FAFC]">
                                        {task.assignedTo.name}
                                    </p>
                                    <p className="flex items-center gap-1 text-xs text-slate-400">
                                        <ShieldCheck className="h-3 w-3" />
                                        {task.assignedTo.role}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5">
                            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                <CalendarClock className="h-3.5 w-3.5" />
                                Created by
                            </h3>
                            <p className="mt-2 text-sm font-medium text-[#F8FAFC]">
                                {task.createdBy.name}
                            </p>
                            <p className="text-xs text-slate-400">
                                {formatDate(task.createdAt)}
                            </p>
                        </div>

                        {task.tags.length > 0 ? (
                            <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5">
                                <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    <Tag className="h-3.5 w-3.5" />
                                    Tags
                                </h3>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {task.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full border border-slate-600/60 bg-slate-700/40 px-2.5 py-1 text-xs text-slate-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </aside>
                </div>
            </main>

            {/* Sticky bottom action bar — reinforces the CTA on smaller viewports */}
            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-700/60 bg-[#1E293B]/95 px-4 py-3 backdrop-blur lg:hidden">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
                    <p className="truncate text-xs text-slate-400">
                        Manage this task in the Workspace
                    </p>
                    <WorkspaceCtaButton onClick={goToWorkspace} />
                </div>
            </div>
        </motion.div>
    );
};