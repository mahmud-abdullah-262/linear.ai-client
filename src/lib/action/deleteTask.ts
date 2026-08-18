import { ApiResponse } from "../../../type/apiResponse"
import { clientMutate } from "./(core)/clientMutate"

export const deleteTask = async <T = any> (path: string, taskId: string) => {
    const data = {
        taskId,
    }
    return clientMutate<ApiResponse<T>>(path, data, 'DELETE')
}      