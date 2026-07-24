import { StaggerList, StaggerItem } from '@/components/shared/MotionWrapper';
import type { Task, TaskStatus, CurrentUser } from '@/types/dashboard';
import { columnScrollRef } from '../../lib/utils';
import { TaskCard } from '../task/TaskCard';
import { TaskCardSkeletonList } from '../task/TaskCardSkeleton';

const STATUS_DOT_COLOR: Record<TaskStatus, string> = {
  Backlog: 'bg-slate-400',
  Todo: 'bg-blue-400',
  'In Progress': 'bg-cyan-400',
  Done: 'bg-emerald-400',
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  isLoading: boolean;
  currentUser: CurrentUser;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export function KanbanColumn({ status, tasks, isLoading, currentUser, onStatusChange, onDelete }: KanbanColumnProps) {
  return (
    <div className="bg-[#1E293B]/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col h-full min-h-0 overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${STATUS_DOT_COLOR[status]}`} />
          <span className="text-sm font-semibold text-[#F8FAFC]">{status}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 font-bold">
          {isLoading ? '0' : tasks.length}
        </span>
      </div>

      {isLoading ? (
        <TaskCardSkeletonList />
      ) : (
        <StaggerList className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div
            ref={columnScrollRef}
            className="space-y-3 flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 scrollbar-thin scrollbar-thumb-slate-800"
          >
            {tasks.length === 0 ? (
              <div className="h-32 border border-dashed border-slate-800/60 rounded-xl flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center">
                No tasks found
              </div>
            ) : (
              tasks.map((task) => (
                <StaggerItem key={task._id}>
                  <TaskCard task={task} currentUser={currentUser} onStatusChange={onStatusChange} onDelete={onDelete} />
                </StaggerItem>
              ))
            )}
          </div>
        </StaggerList>
      )}
    </div>
  );
}