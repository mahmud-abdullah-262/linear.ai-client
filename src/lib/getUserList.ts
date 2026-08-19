import { CurrentUser, Users } from "@/types/dashboard";
import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getUserList = async () => {

  let users: Users | undefined = undefined;

   const session = await auth.api.getSession({
      headers: await headers(),
    });
  
  if (!session) {
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

  return users
}