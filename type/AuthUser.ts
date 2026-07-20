// src/types/user.ts
import type { auth } from "@/lib/auth";

export type AuthUser = typeof auth.$Infer.Session.user;

export interface User extends AuthUser {
    role: "Admin" | "Member";
}