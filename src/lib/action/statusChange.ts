import { clientMutate } from "./(core)/clientMutate"


export const statusChange = async (path: string, data: any, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE') => {
    return clientMutate(path, data, method)
}       