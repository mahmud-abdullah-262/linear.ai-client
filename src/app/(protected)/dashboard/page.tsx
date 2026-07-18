

import { serverFetch } from "@/lib/action/serverfetch";

const page = async () => {
  const tasks = await serverFetch('/api/tasks');
  console.log(tasks, 'tasks');

  return (
    <div>
      <h1>Dashboard {tasks.length}</h1>
    </div>
  );
};

export default page;