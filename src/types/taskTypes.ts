export type TaskStatus = "Backlog" | "Todo" | "In Progress" | "Done";

export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export interface TaskAssignee {
    _id: string;
    name: string;
    avatar: string;
    role: "Admin" | "Member";
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
    imageUrl?: string;
    status: TaskStatus;
    priority: TaskPriority;
    tags: string[];
    assignedTo: TaskAssignee;
    createdBy: TaskCreator;
    createdAt: string;
}