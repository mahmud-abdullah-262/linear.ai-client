// ── Task Schema ──────────────────────────────────────────────────────────────

export type TaskStatus = 'Backlog' | 'Todo' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type UserRole = 'Admin' | 'Member' | 'user';

export interface TaskUser {
  _id: string;
  name: string;
  avatar: string;
  role: 'Admin' | 'Member';
}

export interface TaskCreator {
  _id: string;
  name: string;
}

export interface Task {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  assignedTo: TaskUser;
  createdBy: TaskCreator;
  createdAt?: string;
  updatedAt?: string;
}

// ── Current User ─────────────────────────────────────────────────────────────

export interface CurrentUser {
  _id: string;
  name: string;
  role: UserRole;
  email?: string;
  image?: string;
}

// ── Chart Data ────────────────────────────────────────────────────────────────

export interface StatusChartEntry {
  status: TaskStatus;
  count: number;
  fill: string;
}

export interface TeamLoadEntry {
  name: string;
  tasks: number;
}
