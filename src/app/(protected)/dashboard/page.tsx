import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { serverFetch } from '@/lib/action/(core)/serverfetch';
import type { Task } from '@/types/dashboard';
import type { CurrentUser } from '@/types/dashboard';
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
    // better-auth admin plugin stores role on the user object
    role: (rawUser.role as CurrentUser['role']) ?? 'user',
  };

  // ── Fetch Tasks ───────────────────────────────────────────────────────────
  let tasks: Task[] = [];
  try {
    const data = await serverFetch('/api/tasks');
    // Guard: ensure it's an array even if the API returns something unexpected
    tasks = Array.isArray(data) ? (data as Task[]) : [];
  } catch (err) {
    console.error('[Dashboard] Failed to fetch tasks:', err);
    // Render the dashboard with empty state rather than crashing
    tasks = [];
  }

  return (
    <DashboardClient tasks={tasks} currentUser={currentUser} />
  );
}