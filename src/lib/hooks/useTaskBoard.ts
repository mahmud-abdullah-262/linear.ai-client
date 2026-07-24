import { useMemo, useState } from 'react';
import type { Task, TaskStatus, CurrentUser } from '@/types/dashboard';
import { ALL_STATUSES, PRIORITY_SORT_WEIGHT } from '../constants';

interface UseTaskBoardParams {
  tasks: Task[];
  currentUser: CurrentUser;
}

export function useTaskBoard({ tasks, currentUser }: UseTaskBoardParams) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'priority'>('latest');

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

  return {
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
    allStatuses: ALL_STATUSES,
  };
}