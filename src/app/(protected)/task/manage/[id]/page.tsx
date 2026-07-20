import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/action/(core)/serverfetch";
import { task } from "../../../../../../type/task";
import { TaskDetailsView } from "@/components/task/TaskDetailsView";
import { Task } from "@/types/taskTypes";


interface TaskDetailsPageProps {
    params: Promise<{ id: string }>;
}

const TaskDetailsPage = async ({ params }: TaskDetailsPageProps) => {
    const { id } = await params;

    // Assumption: serverFetch is generic and resolves to `null`/`undefined`
    // on a 404 rather than throwing. Adjust the null-check below if your
    // implementation throws instead.
    const task = await serverFetch<Task | null>(`/api/tasks/${id}`);

    if (!task) {
        notFound();
    }

    return <div className="py-24 bg-[#0B0F19]">
        <TaskDetailsView task={task} />
    </div>;
};

export default TaskDetailsPage;