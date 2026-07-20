import { auth } from "@/lib/auth";

import { headers } from "next/headers";

import ProfilePage from "@/components/ProfileClient";
import { User } from "../../../../type/AuthUser";
import { redirect } from "next/navigation";


const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user as User | undefined;

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="bg-gray-800 w-full py-24 ">
      <ProfilePage user={user} />
    </div>
  );
};

export default Page;