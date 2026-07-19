import { clientMutate } from "./(core)/clientMutate"

export const postTask = async (path: string, data: any, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST') => {
    return clientMutate(path, data, method)
}