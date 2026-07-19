import { clientMutate } from "./(core)/clientMutate"

export const deleteTask = async (path: string, taskId: string) => {
    const data = {
        taskId,
    }
    return clientMutate(path, data, 'DELETE')
}      