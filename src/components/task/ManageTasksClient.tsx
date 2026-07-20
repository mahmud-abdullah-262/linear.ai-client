'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Task, TaskPriority, TaskStatus, CurrentUser } from '@/types/dashboard';
import { statusChange } from '@/lib/action/statusChange';
import { toast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { deleteTask } from '@/lib/action/deleteTask';
import { motion } from 'motion/react';
import {
  StaggerList,
  StaggerItem,
  MotionButton,
  CriticalPulseDot,
} from '@/components/shared/MotionWrapper';
import Link from 'next/link';

interface ManageTasksClientProps {
  tasks: Task[];
  currentUser: CurrentUser;
  initialLoading?: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const PRIORITY_SORT_WEIGHT: Record<TaskPriority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

const ALL_STATUSES: TaskStatus[] = ['Backlog', 'Todo', 'In Progress', 'Done'];

const columnScrollRef = (node: HTMLDivElement | null) => {
  if (!node) return;

  const handleWheel = (e: WheelEvent) => {
    const { scrollTop, scrollHeight, clientHeight } = node;
    const isScrollable = scrollHeight > clientHeight;

    if (!isScrollable) return;

    const isScrollingDown = e.deltaY > 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    const isAtTop = scrollTop <= 0;

    // যদি কলামের ভেতর স্ক্রল করার সুযোগ থাকে
    if ((isScrollingDown && !isAtBottom) || (!isScrollingDown && !isAtTop)) {
      // কলাম নিজে স্ক্রল হবে, কিন্তু বাইরের মেইন পেজ স্ক্রল হবে না
      e.stopPropagation();
    } else {
      // কলামের একদম শীর্ষে বা নিচে পৌঁছে গেলে পেজ স্ক্রল বন্ধ রাখবে
      e.preventDefault();
    }
  };

  // passive: false আবশ্যক যাতে preventDefault কাজ করে
  node.addEventListener('wheel', handleWheel, { passive: false });
};

export default function ManageTasksClient({ tasks, currentUser, initialLoading = false }: ManageTasksClientProps) {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'priority'>('latest');

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: 'Hello! I am your AI Co-Pilot. I can help summarize progress, highlight blockers, or plan your next sprints. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiStreamingText, setAiStreamingText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialLoading) {
      const timer = setTimeout(() => setIsLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [initialLoading]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, aiStreamingText, isAiTyping]);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    tasks.forEach((task) => {
      if (Array.isArray(task.tags)) {
        task.tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet);
  }, [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];
    if (currentUser.role !== 'Admin') {
      result = result.filter((t) => t.assignedTo?._id === currentUser._id);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.shortDescription.toLowerCase().includes(query) ||
          t.fullDescription.toLowerCase().includes(query)
      );
    }

    if (selectedPriority !== 'All') {
      result = result.filter((t) => t.priority === selectedPriority);
    }

    if (selectedTag !== 'All') {
      result = result.filter((t) => t.tags && t.tags.includes(selectedTag));
    }

    if (sortBy === 'latest') {
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortBy === 'priority') {
      result.sort((a, b) => PRIORITY_SORT_WEIGHT[b.priority] - PRIORITY_SORT_WEIGHT[a.priority]);
    }

    return result;
  }, [tasks, currentUser, searchQuery, selectedPriority, selectedTag, sortBy]);

  const columns: Record<TaskStatus, Task[]> = useMemo(() => {
    const cols: Record<TaskStatus, Task[]> = {
      Backlog: [],
      Todo: [],
      'In Progress': [],
      Done: [],
    };
    filteredAndSortedTasks.forEach((task) => {
      if (cols[task.status]) {
        cols[task.status].push(task);
      }
    });
    return cols;
  }, [filteredAndSortedTasks]);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const data = { action: 'UPDATE_STATUS', taskId, newStatus };
    try {
      const result = await statusChange('/api/tasks', data, 'PATCH');
      toast.success(result?.message || 'Task updated successfully!');
      router.refresh();
    } catch (error) {
      toast.danger('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      const result = await deleteTask('/api/deleteTask', taskId);
      if (!result?.success) throw new Error(result?.message || 'Failed to delete');
      toast.success('Task deleted successfully');
      router.refresh();
    } catch (error) {
      toast.danger(error instanceof Error ? error.message : 'Failed to delete');
    }
  };

  const handleSendAiMessage = (text: string) => {
    if (!text.trim() || isAiTyping) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsAiTyping(true);

    let responseText = "I've analyzed the current board state. Let me know if you want to drill down into any specific task attributes or assignee workloads.";
    const lowerText = text.toLowerCase();

    if (lowerText.includes('block') || lowerText.includes('critical') || lowerText.includes('blockade')) {
      const criticalTasks = tasks.filter((t) => t.priority === 'Critical' && t.status !== 'Done');
      if (criticalTasks.length > 0) {
        responseText = `You currently have ${criticalTasks.length} critical active tasks. Highly recommend unblocking: ${criticalTasks.map((t) => `"${t.title}"`).join(', ')}.`;
      } else {
        responseText = 'Great news! There are no unresolved tasks designated with Critical priority on the board.';
      }
    } else if (lowerText.includes('progress') || lowerText.includes('summarize')) {
      const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
      const done = tasks.filter((t) => t.status === 'Done').length;
      const backlog = tasks.filter((t) => t.status === 'Backlog').length;
      const todo = tasks.filter((t) => t.status === 'Todo').length;
      responseText = `Here is today's progress summary: ${done} completed, ${inProgress} in progress, ${todo} ready to start, and ${backlog} in backlog. Keep pushing!`;
    }

    setTimeout(() => {
      setIsAiTyping(false);
      let currentLength = 0;
      const interval = setInterval(() => {
        currentLength += Math.min(5, responseText.length - currentLength);
        setAiStreamingText(responseText.slice(0, currentLength));
        if (currentLength >= responseText.length) {
          clearInterval(interval);
          setChatMessages((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              sender: 'assistant',
              content: responseText,
              timestamp: new Date(),
            },
          ]);
          setAiStreamingText('');
        }
      }, 30);
    }, 1500);
  };

  const getPriorityStyles = (p: TaskPriority) => {
    switch (p) {
      case 'Critical': return 'bg-red-950/80 text-red-400 border-red-800/80';
      case 'High': return 'bg-orange-950/80 text-orange-400 border-orange-850/80';
      case 'Medium': return 'bg-yellow-950/80 text-yellow-400 border-yellow-800/80';
      case 'Low': return 'bg-slate-800/80 text-slate-400 border-slate-700/80';
      default: return 'bg-slate-800/80 text-slate-400 border-slate-700/80';
    }
  };

  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-44 w-full bg-[#1E293B] border border-slate-800 rounded-xl p-5 animate-pulse flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-5 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800 rounded w-full" />
            <div className="h-3 bg-slate-800 rounded w-5/6" />
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="h-6 bg-slate-800 rounded w-16" />
            <div className="h-7 w-7 bg-slate-800 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    /* ১. মূল পরিবর্তনের জায়গা: min-h-screen এর বদলে h-screen overflow-hidden দেয়া হয়েছে */
    <div className="relative h-screen w-full bg-[#0B0F19] text-[#F8FAFC] flex flex-col overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 w-full flex-1 flex flex-col h-full overflow-hidden">

        {/* Top Control and Filter Bar (Fixed Height) */}
        <div className="border-b border-slate-800/80 backdrop-blur-md shrink-0 px-6 py-4 bg-[#0B0F19]/80">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] animate-pulse" />
                Member Workspace
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage your tasks and collaborate with the AI assistant. (Signed in as: <strong className="text-[#06B6D4]">{currentUser.name}</strong> - {currentUser.role})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                <input
                  type="text"
                  placeholder="Search title, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-lg py-1.5 pl-8 pr-3 text-xs text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-all"
                />
                <span className="absolute left-2.5 top-2.5 text-slate-500">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#0B0F19] border border-slate-700/80 rounded-lg px-2 py-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Priority:</span>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="bg-transparent text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#0B0F19]">All</option>
                  <option value="Critical" className="bg-[#0B0F19]">Critical</option>
                  <option value="High" className="bg-[#0B0F19]">High</option>
                  <option value="Medium" className="bg-[#0B0F19]">Medium</option>
                  <option value="Low" className="bg-[#0B0F19]">Low</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-[#0B0F19] border border-slate-700/80 rounded-lg px-2 py-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Tag:</span>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="bg-transparent text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#0B0F19]">All</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag} className="bg-[#0B0F19]">{tag}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-[#0B0F19] border border-slate-700/80 rounded-lg px-2 py-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'latest' | 'priority')}
                  className="bg-transparent text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
                >
                  <option value="latest" className="bg-[#0B0F19]">Latest Created</option>
                  <option value="priority" className="bg-[#0B0F19]">Priority Level</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ২. মূল পরিবর্তনের জায়গা: কন্টেন্ট এরিয়াকে flex-1 overflow-hidden এবং h-full দেওয়া হয়েছে */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex flex-col lg:flex-row gap-6 overflow-hidden h-full">

          {/* Core Kanban Container */}
          <div className="flex-1 lg:w-3/4 w-full h-full overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 h-full">
              {ALL_STATUSES.map((status) => {
                const columnTasks = columns[status] || [];
                return (
                  /* ৩. কলামের পেরেন্ট কন্টেইনারকে ফিক্সড h-full ও overflow-hidden করা হয়েছে */
                  <div
                    key={status}
                    className="bg-[#1E293B]/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col h-full min-h-0 overflow-hidden"
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${status === 'Backlog'
                            ? 'bg-slate-400'
                            : status === 'Todo'
                              ? 'bg-blue-400'
                              : status === 'In Progress'
                                ? 'bg-cyan-400'
                                : 'bg-emerald-400'
                            }`}
                        />
                        <span className="text-sm font-semibold text-[#F8FAFC]">{status}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 font-bold">
                        {isLoading ? '0' : columnTasks.length}
                      </span>
                    </div>

                    {/* ৪. কলাম স্ক্রল লিস্ট: flex-1, overflow-y-auto, overscroll-contain */}
                    {isLoading ? (
                      renderSkeletons()
                    ) : (
                      <StaggerList className="flex-1 min-h-0 flex flex-col overflow-hidden">
                        <div
                          ref={columnScrollRef}
                          className="space-y-3 flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 scrollbar-thin scrollbar-thumb-slate-800"
                        >
                          {columnTasks.length === 0 ? (
                            <div className="h-32 border border-dashed border-slate-800/60 rounded-xl flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center">
                              No tasks found
                            </div>
                          ) : (
                            columnTasks.map((task) => (
                              <StaggerItem key={task._id}>
                                <motion.div
                                  whileTap={{ scale: 0.98 }}
                                  transition={{ duration: 0.2, ease: 'easeOut' }}
                                  className="bg-[#1E293B] border border-slate-800/80 rounded-xl p-4 hover:border-[#06B6D4]/50 hover:shadow-[0_0_12px_rgba(6,182,212,0.08)] transition-colors duration-200 shadow-sm flex flex-col justify-between min-h-[220px] group"
                                  style={{ willChange: 'transform' }}
                                >
                                  <div>
                                    <div className="flex items-start justify-between gap-2">
                                      <h3 className="text-xs font-bold text-[#F8FAFC] line-clamp-1 group-hover:text-[#06B6D4] transition-colors">
                                        {task.title}
                                      </h3>
                                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getPriorityStyles(task.priority)} font-semibold shrink-0 inline-flex items-center gap-1`}>
                                        {task.priority === 'Critical' && (
                                          <CriticalPulseDot className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                        )}
                                        {task.priority}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-3">
                                      {task.shortDescription}
                                    </p>
                                  </div>

                                  <div className="mt-3 pt-3 border-t border-slate-800/50 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Move Status</span>
                                      {currentUser.role === 'Admin' && (
                                        <MotionButton
                                          onClick={() => handleDeleteTask(task._id)}
                                          className="text-[9px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                          title="Delete Task"
                                        >
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                          Delete
                                        </MotionButton>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {ALL_STATUSES.filter((s) => s !== task.status).map((targetStatus) => (
                                        <motion.button
                                          key={targetStatus}
                                          onClick={() => handleStatusChange(task._id, targetStatus)}
                                          whileHover={{ scale: 1.03 }}
                                          whileTap={{ scale: 0.96 }}
                                          transition={{ duration: 0.12 }}
                                          className="text-[9px] bg-slate-800 hover:bg-[#06B6D4]/10 text-slate-300 hover:text-[#06B6D4] px-1.5 py-0.5 rounded border border-slate-700/80 hover:border-[#06B6D4]/30 transition-colors cursor-pointer"
                                        >
                                          {targetStatus}
                                        </motion.button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60">
                                    <div className="flex items-center gap-2">
                                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center">
                                        {task.assignedTo?.avatar ? (
                                          <img
                                            src={task.assignedTo.avatar}
                                            alt={task.assignedTo.name}
                                            className="object-cover w-full h-full"
                                          />
                                        ) : (
                                          <span className="text-[10px] font-bold text-slate-300">
                                            {task.assignedTo?.name ? task.assignedTo.name.charAt(0) : '?'}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[10px] text-[#F8FAFC] font-medium leading-none">
                                          {task.assignedTo?.name || 'Unassigned'}
                                        </span>
                                        <span className="text-[8px] text-slate-500">
                                          {task.assignedTo?.role || 'Member'}
                                        </span>
                                      </div>
                                    </div>

                                    <MotionButton
                                      className="text-[10px] font-bold text-[#06B6D4] hover:text-white px-2 py-1.5 rounded bg-[#06B6D4]/5 hover:bg-[#06B6D4] transition-colors cursor-pointer"
                                    >
                                      <Link href={`/task/manage/${task._id}`}>Details</Link>
                                    </MotionButton>
                                  </div>
                                </motion.div>
                              </StaggerItem>
                            ))
                          )}
                        </div>
                      </StaggerList>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Context-Aware AI Chat Sidebar */}
          <div
            className={`transition-all duration-300 ${isSidebarOpen ? 'w-full lg:w-1/4' : 'w-10'
              } shrink-0 relative flex flex-col border border-slate-800/80 bg-[#1E293B]/70 rounded-2xl overflow-hidden backdrop-blur-md h-full`}
          >
            {isSidebarOpen ? (
              <div className="flex flex-col h-full w-full overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#1E293B] shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
                    <span className="text-xs font-bold text-[#F8FAFC] tracking-wider uppercase">AI Co-Pilot</span>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                        }`}
                    >
                      <div
                        className={`p-3 rounded-xl text-xs leading-relaxed ${msg.sender === 'user'
                          ? 'bg-[#06B6D4] text-[#0B0F19] font-medium rounded-tr-none shadow-md shadow-[#06B6D4]/10'
                          : 'bg-[#0B0F19] text-[#F8FAFC] border border-slate-800 rounded-tl-none'
                          }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}

                  {aiStreamingText && (
                    <div className="flex flex-col max-w-[85%] mr-auto items-start">
                      <div className="p-3 bg-[#0B0F19] text-[#F8FAFC] border border-slate-800 rounded-xl rounded-tl-none text-xs leading-relaxed">
                        <p className="whitespace-pre-wrap">{aiStreamingText}</p>
                      </div>
                      <span className="text-[9px] text-[#06B6D4] mt-1 font-semibold">Streaming...</span>
                    </div>
                  )}

                  {isAiTyping && (
                    <div className="flex items-center gap-1 bg-[#0B0F19] border border-slate-800 p-3 rounded-xl rounded-tl-none w-20 justify-center">
                      <span className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Suggestions and Input */}
                <div className="border-t border-slate-800 p-3 space-y-3 bg-[#1E293B]/90 shrink-0">
                  <div className="flex flex-wrap gap-1.5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSendAiMessage('What are my critical blockades?')}
                      className="text-[9px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded bg-[#0B0F19] border border-slate-800 hover:border-[#06B6D4] transition-colors cursor-pointer"
                    >
                      Show critical blockades
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSendAiMessage("Summarize today's progress")}
                      className="text-[9px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded bg-[#0B0F19] border border-slate-800 hover:border-[#06B6D4] transition-colors cursor-pointer"
                    >
                      Summarize progress
                    </motion.button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendAiMessage(chatInput);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Ask co-pilot..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-[#0B0F19] border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-[#06B6D4]"
                    />
                    <MotionButton
                      id="copilot-send-btn"
                      type="submit"
                      disabled={!chatInput.trim() || isAiTyping}
                      className="bg-[#06B6D4] hover:bg-[#06B6D4]/80 disabled:bg-slate-800 disabled:text-slate-600 text-[#0B0F19] font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 cursor-pointer"
                    >
                      Send
                    </MotionButton>
                  </form>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="w-full h-full flex items-center justify-center text-slate-400 hover:text-white p-2 cursor-pointer"
                title="Open AI Co-Pilot"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}