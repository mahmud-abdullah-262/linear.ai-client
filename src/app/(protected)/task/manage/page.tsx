import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ManageTasksClient from "@/components/task/ManageTasksClient";
import { serverFetch } from "@/lib/action/(core)/serverfetch";
import type { CurrentUser } from "@/types/dashboard";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
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

  let tasks = await serverFetch('/api/tasks');
  console.log(tasks);

  if (Array.isArray(tasks)) {
    tasks = tasks;
  } else {
    tasks = [];
  }

  return (
    <div>
      <ManageTasksClient tasks={tasks} currentUser={currentUser} initialLoading={false} />
    </div>
  );
};

export default page;