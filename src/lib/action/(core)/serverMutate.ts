
import { auth } from "@/lib/auth"; // যেখানে betterAuth() init করা
import { headers } from "next/headers";




const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'




export const authHeader = async (): Promise<Record<string, string>> => {
    const session = await auth.api.getSession({
        headers: await headers(), // incoming request এর cookie forward করে
    });
    const token = session?.session?.token;
    console.log(token, 'token')
    return token ? { authorization: `Bearer ${token}` } : {};       
}

export const serverMutate = async (
    path: string,
    payload?: any,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
) => {
    const authHeaders = await authHeader();

    const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
        },
        // DELETE-এ সাধারণত body লাগে না, কিন্তু কেউ পাঠাতে চাইলে সাপোর্ট রাখলাম
        body: payload !== undefined ? JSON.stringify(payload) : undefined,
    });

    if (!res.ok) {
        // error response টাও JSON হতে পারে, তাই parse করে throw করছি
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Request failed with status ${res.status}`);
    }

    const result = await res.json();
    return result;
};

