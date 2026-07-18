import { authClient } from "../auth-client";





const baseUrl = 'http://localhost:5000'


export const authHeader = async (): Promise<Record<string, string>> => {
    const { data } = await authClient.getSession(); // hook না, direct call
    const token = data?.session?.token;
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


