import type { Task, TaskStatus, CurrentUser } from '@/types/dashboard';
import { ALL_STATUSES } from '../../lib/constants';
import { KanbanColumn } from '../task/KanbanColumn';

interface KanbanBoardProps {
  columns: Record<TaskStatus, Task[]>;
  isLoading: boolean;
  currentUser: CurrentUser;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export function KanbanBoard({ columns, isLoading, currentUser, onStatusChange, onDelete }: KanbanBoardProps) {
  return (
    <div className="flex-1 lg:w-3/4 w-full h-full overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 h-full">
        {ALL_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={columns[status] || []}
            isLoading={isLoading}
            currentUser={currentUser}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}