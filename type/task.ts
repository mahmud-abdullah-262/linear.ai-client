import { ObjectId } from "mongodb";

import { user } from "./user";

export interface task {
  _id: ObjectId,
  title: string,
  shortDescription: string,
  fullDescription: string,
  status: 'Backlog' | 'Todo' | 'In Progress' | 'Done',
  priority: 'Low' | 'Medium' | 'High' | 'Critical', // AI Automated
  tags: string[], // AI Automated
  assignedTo: user,
  createdBy: user,
  createdAt: Date,
  updatedAt: Date
}