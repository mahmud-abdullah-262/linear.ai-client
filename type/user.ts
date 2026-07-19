import { ObjectId } from "mongodb";

export interface user {
  _id: ObjectId,
  name: string,
  email: string,
  avatar: string,
  role: 'Admin' | 'Member'
}