"use client";

import {
  AuthenticationBaseResponsePOST,
  AuthenticationSignUpRequestPOST,
  Api as RequestHandler,
} from "../../../../Api";

export const signUp = async (formData: FormData) => {
  const payload: AuthenticationSignUpRequestPOST = { email: "", password: "" };

  for (const [key, value] of formData.entries()) {
    if (key in payload) {
      payload[key as keyof AuthenticationSignUpRequestPOST] = value as string;
    }
  }

  const requestHandler = new RequestHandler();
  try {
    const response = await requestHandler.api.authSignUpCreate(payload);
    const result: AuthenticationBaseResponsePOST = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};
