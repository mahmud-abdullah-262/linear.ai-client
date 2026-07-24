import Link from 'next/link';
import { motion } from 'motion/react';
import { MotionButton, CriticalPulseDot } from '@/components/shared/MotionWrapper';
import type { Task, TaskStatus, CurrentUser } from '@/types/dashboard';
import { ALL_STATUSES } from '../../lib/constants';
import { getPriorityStyles } from '../../lib/utils';

interface TaskCardProps {
  task: Task;
  currentUser: CurrentUser;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, currentUser, onStatusChange, onDelete }: TaskCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-[#1E293B] border border-slate-800/80 rounded-xl p-4 hover:border-[#06B6D4]/50 hover:shadow-[0_0_12px_rgba(6,182,212,0.08)] transition-colors duration-200 shadow-sm flex flex-col justify-between min-h-55 group"
      style={{ willChange: 'transform' }}
    >
      <div>
        <div className="flex flex-col items-start gap-2">
          <span
            className={`text-[10px] px-2 py-0.5 rounded border ${getPriorityStyles(
              task.priority
            )} font-semibold shrink-0 inline-flex items-center gap-1`}
          >
            {task.priority === 'Critical' && (
              <CriticalPulseDot className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            )}
            {task.priority}
          </span>

          <h3 className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#06B6D4] transition-colors break-words">
            {task.title}
          </h3>
        </div>

        <p className="text-[11px] text-slate-400 mt-2 line-clamp-3">{task.shortDescription}</p>
      </div>

      {/* Status movement controls */}
      <div className="mt-3 pt-3 border-t border-slate-800/50 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Move Status</span>
          {currentUser.role === 'Admin' && (
            <MotionButton
              onClick={() => onDelete(task._id)}
              className="text-[9px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Delete Task"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </MotionButton>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {ALL_STATUSES.filter((s) => s !== task.status).map((targetStatus) => (
            <motion.button
              key={targetStatus}
              onClick={() => onStatusChange(task._id, targetStatus)}
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

      {/* Assignee & Details footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center">
            {task.assignedTo?.avatar ? (
              <img src={task.assignedTo.avatar} alt={task.assignedTo.name} className="object-cover w-full h-full" />
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
            <span className="text-[8px] text-slate-500">{task.assignedTo?.role || 'Member'}</span>
          </div>
        </div>

        <MotionButton className="text-[10px] font-bold text-[#06B6D4] hover:text-white px-2 py-1.5 rounded bg-[#06B6D4]/5 hover:bg-[#06B6D4] transition-colors cursor-pointer">
          <Link href={`/task/manage/${task._id}`}>Details</Link>
        </MotionButton>
      </div>
    </motion.div>
  );
}