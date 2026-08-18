'use client';

import { useState } from 'react';
import type { Task, TaskStatus, CurrentUser } from '@/types/dashboard';
import { ALL_STATUSES } from '../../lib/constants';
import { KanbanColumn } from '../task/KanbanColumn';

interface KanbanBoardProps {
  columns: Record<TaskStatus, Task[]>;
  isLoading: boolean;
  currentUser: CurrentUser;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export function KanbanBoard({ columns, isLoading, currentUser, onStatusChange, onDelete }: KanbanBoardProps) {
  const [activeFilter, setActiveFilter] = useState<TaskStatus | 'All'>('All');

  const visibleStatuses = activeFilter === 'All' ? ALL_STATUSES : [activeFilter];

  return (
    <div className="flex-1 lg:w-3/4 w-full h-full overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <button
          onClick={() => setActiveFilter('All')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeFilter === 'All'
              ? 'bg-[#06B6D4] text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All
        </button>
        {ALL_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
              activeFilter === status
                ? 'bg-[#06B6D4] text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {status === 'In Progress' ? 'In Progress' : status.toLowerCase()}
          </button>
        ))}
      </div>
      <div className=" w-full">
        <div className="grid grid-cols-1 gap-5 h-auto">
          {visibleStatuses.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={columns[status] || []}
              isLoading={isLoading}
              currentUser={currentUser}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}