"use server";

import {
  AuthenticationLoginRequestPOST,
  AuthenticationBaseResponsePOST,
} from "@/lib/api/data-contracts";
import { Api } from "@/lib/api/Api";

export const login = async (formData: FormData) => {
  const payload: AuthenticationLoginRequestPOST = { email: "", password: "" };

  for (const [key, value] of formData.entries()) {
    if (key in payload) {
      payload[key as keyof AuthenticationLoginRequestPOST] = value as string;
    }
  }

  const { authLoginCreate } = new Api();
  try {
    const response = await authLoginCreate(payload);
    const result: AuthenticationBaseResponsePOST = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};
