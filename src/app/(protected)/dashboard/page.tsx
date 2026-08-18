import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { serverFetch } from '@/lib/action/(core)/serverfetch';
import type { Task, Users, CurrentUser } from '@/types/dashboard';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const metadata = {
  title: 'Dashboard · Linear.ai',
  description: 'Your AI-powered project management dashboard',
};

export default async function DashboardPage() {
  // ── Authenticate ──────────────────────────────────────────────────────────
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  const rawUser = session.user as {
    id: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
  };

  const currentUser: CurrentUser = {
    _id: rawUser.id,
    name: rawUser.name,
    email: rawUser.email,
    image: rawUser.image,
    role: (rawUser.role as CurrentUser['role']) ?? 'user',
  };

  // ── Fetch Users (Only if Admin) ───────────────────────────────────────────
  let users: Users | undefined = undefined;

  if (currentUser.role === 'admin') {
    try {
      const rawUsers = await auth.api.listUsers({
        query: {
          sortBy: "name",
          sortDirection: "desc",
          filterField: "email",
        },
        headers: await headers(),
      });

      users = {
        total: rawUsers.total,
        users: rawUsers.users.map((u): CurrentUser => ({
          _id: u.id,
          name: u.name,
          email: u.email,
          image: u.image ?? undefined,
          role: (u.role as CurrentUser['role']) ?? 'user',
        })),
      };
    } catch (err) {
      console.error('[Dashboard] Failed to fetch users:', err);
    }
  }

  // ── Fetch Tasks ───────────────────────────────────────────────────────────
  let tasks: Task[] = [];
  try {
    const data = await serverFetch('/api/tasks');
    tasks = Array.isArray(data) ? (data as Task[]) : [];
  } catch (err) {
    console.error('[Dashboard] Failed to fetch tasks:', err);
    tasks = [];
  }

  return (
    <DashboardClient 
      tasks={tasks} 
      currentUser={currentUser} 
      users={users} 
    />
  );
}