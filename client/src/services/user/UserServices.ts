import { UserResponse } from "@/lib/api/data-contracts";
import { ServiceError, PATCHApiWithFormFile, GETApi } from "../ServiceBase";

const API_URL = "/api/user";

export const getUser = async () => {
  try {
    return await GETApi<UserResponse>(`${API_URL}/get`);
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }

    throw new ServiceError("User Service is temporarily unavailable");
  }
};

export const updateUser = async (formData: FormData) => {
  try {
    await PATCHApiWithFormFile<void>(`${API_URL}/update`, formData);
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }

    throw new ServiceError("User Service is temporarily unavailable");
  }
};
