import { authClient } from "@/lib/auth-client";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const getClientToken = async (): Promise<string | undefined> => {
    const { data } = await authClient.getSession();
    console.log(data?.session?.token, 'client token')
    return data?.session?.token;
};

export const clientMutate = async <TData = unknown, TPayload = unknown>(
    path: string,
    payload?: TPayload,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
): Promise<TData> => {
    const token = await getClientToken();

    const res = await fetch(`${baseUrl}${path}`, {
        method,
        credentials: 'include',
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

    return res.json() as Promise<TData>;
};