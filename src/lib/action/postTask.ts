import { ApiResponse } from "../../../type/apiResponse";
import { clientMutate } from "./(core)/clientMutate"

export const postTask = async <T = any>(
  path: string, 
  data: any, 
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
) => {
  return clientMutate<ApiResponse<T>>(path, data, method);
};