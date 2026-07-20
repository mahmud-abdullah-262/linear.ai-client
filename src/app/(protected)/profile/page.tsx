import { auth } from "@/lib/auth";
import { Spinner } from "@heroui/react";
import { headers } from "next/headers";

import ProfilePage from "@/components/ProfileClient";
import { User } from "../../../../type/AuthUser";


const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user as User | undefined;

  if (!user) {
    return (
      <div className="flex items-center justify-center bg-gray-800 h-screen w-full py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 w-full py-24 ">
      <ProfilePage user={user} />
    </div>
  );
};

export default Page;