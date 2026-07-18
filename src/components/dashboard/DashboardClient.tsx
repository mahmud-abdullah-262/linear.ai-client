'use client';

import React from 'react';
import type { Task, CurrentUser } from '@/types/dashboard';
import { AdminDashboard, MemberDashboard } from './DashboardViews';

interface DashboardClientProps {
  tasks: Task[];
  currentUser: CurrentUser;
}

export default function DashboardClient({ tasks, currentUser }: DashboardClientProps) {
  const isAdmin = currentUser.role === 'Admin';

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      {/* Subtle grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {isAdmin ? (
          <AdminDashboard tasks={tasks} currentUser={currentUser} />
        ) : (
          <MemberDashboard tasks={tasks} currentUser={currentUser} />
        )}
      </div>
    </div>
  );
}
