import { ObjectId } from "mongodb";

export interface user {
  _id: ObjectId,
  name: string,
  email: string,
  image?: string,
  createdAt?: string,
  updatedAt?: string
  role: 'Admin' | 'Member'
}