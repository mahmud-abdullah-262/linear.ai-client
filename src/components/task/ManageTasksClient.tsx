'use client';

import { useEffect, useState } from 'react';
import type { Task, CurrentUser } from '@/types/dashboard';
import { useTaskBoard } from '../../lib/hooks/useTaskBoard';
import { useTaskActions } from '../../lib/hooks/useTaskActions';
import { FilterBar } from '../../components/shared/FilterBar';
import { KanbanBoard } from './KanbanBoard';
import { AiCopilotSidebar } from '../ai/AiCopilotSidebar';

interface ManageTasksClientProps {
  tasks: Task[];
  currentUser: CurrentUser;
  initialLoading?: boolean;
}

export default function ManageTasksClient({ tasks, currentUser, initialLoading = false }: ManageTasksClientProps) {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const {
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    allTags,
    columns,
  } = useTaskBoard({ tasks, currentUser });

  const { handleStatusChange, handleDeleteTask } = useTaskActions();

  useEffect(() => {
    if (initialLoading) {
      const timer = setTimeout(() => setIsLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [initialLoading]);

  return (
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
        <FilterBar
          currentUser={currentUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          allTags={allTags}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex flex-col lg:flex-row gap-6 overflow-hidden h-full">
          <KanbanBoard
            columns={columns}
            isLoading={isLoading}
            currentUser={currentUser}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
          />

          <AiCopilotSidebar tasks={tasks} isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
        </div>
      </div>
    </div>
  );
}