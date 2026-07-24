import { useRouter } from 'next/navigation';
import { toast } from '@heroui/react';
import type { TaskStatus } from '@/types/dashboard';
import { statusChange } from '@/lib/action/statusChange';
import { deleteTask } from '@/lib/action/deleteTask';

export function useTaskActions() {
  const router = useRouter();

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const data = { action: 'UPDATE_STATUS', taskId, newStatus };
    try {
      const result = await statusChange('/api/tasks', data, 'PATCH');
      toast.success(result?.message || 'Task updated successfully!');
      router.refresh();
    } catch (error) {
      toast.danger('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      const result = await deleteTask('/api/deleteTask', taskId);
      if (!result?.success) throw new Error(result?.message || 'Failed to delete');
      toast.success('Task deleted successfully');
      router.refresh();
    } catch (error) {
      toast.danger(error instanceof Error ? error.message : 'Failed to delete');
    }
  };

  return { handleStatusChange, handleDeleteTask };
}