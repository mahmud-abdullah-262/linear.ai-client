import type { TaskPriority, TaskStatus } from '@/types/dashboard';

export const PRIORITY_SORT_WEIGHT: Record<TaskPriority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export const ALL_STATUSES: TaskStatus[] = ['Backlog', 'Todo', 'In Progress', 'Done'];