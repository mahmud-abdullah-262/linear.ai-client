import { authClient } from "@/lib/auth-client";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const getClientToken = async (): Promise<string | undefined> => {
    const { data } = await authClient.getSession();
    console.log(data?.session?.token, 'client token')
    return data?.session?.token;
};

export const clientMutate = async (
    path: string,
    payload?: any,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
) => {
    const token = await getClientToken();

    const res = await fetch(`${baseUrl}${path}`, {
        method,
        credentials: 'include', // Better Auth এর নিজস্ব session fetch এর জন্য এটা লাগবে (getSession এর জন্য), backend call এ optional
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: payload !== undefined ? JSON.stringify(payload) : undefined,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Request failed with status ${res.status}`);
    }

    return res.json();
};