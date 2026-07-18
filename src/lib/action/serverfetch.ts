
import { auth } from "@/lib/auth"; // যেখানে betterAuth() init করা
import { headers } from "next/headers";




const baseUrl = 'http://localhost:5000'




export const authHeader = async (): Promise<Record<string, string>> => {
    const session = await auth.api.getSession({
        headers: await headers(), // incoming request এর cookie forward করে
    });
    const token = session?.session?.token;
    console.log(token, 'token')
    return token ? { authorization: `Bearer ${token}` } : {};
}

export const serverFetch = async (path: string) => {

    const res = await fetch(`${baseUrl}${path}`, {
        headers: await authHeader()
    }

    );
    const data = await res.json();
    return data;
}


