import { ServiceError, PATCHApiWithFormFile } from "../ServiceBase";

const API_URL = "/api/user";

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
