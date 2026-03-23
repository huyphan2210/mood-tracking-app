import {
  AuthenticationBaseResponsePOST,
  LoginRequestPOST,
  SignUpRequestPOST,
} from "@/lib/api/data-contracts";
import { BadServiceRequest, POSTApi, ServiceError } from "../ServiceBase";

const API_URL = "/api/auth";
const EMAIL_VALIDATOR = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_VALIDATOR = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

export const AUTHENTICATION_VALIDATOR_RECORDS: Record<
  string,
  (value: string) => boolean
> = {
  email: (value: string) => {
    return EMAIL_VALIDATOR.test(value);
  },
  password: (value: string) => {
    return PASSWORD_VALIDATOR.test(value);
  },
};

export const signUp = async (formData: FormData) => {
  try {
    const payload = getPayloadFromFormData(formData);

    return await POSTApi<SignUpRequestPOST, AuthenticationBaseResponsePOST>(
      `${API_URL}/sign-up`,
      payload,
    );
  } catch (error) {
    if (error instanceof ServiceError || error instanceof BadServiceRequest) {
      throw error;
    }

    throw new ServiceError("SignUp Service is temporarily unavailable");
  }
};

export const login = async (formData: FormData) => {
  try {
    const payload = getPayloadFromFormData(formData);

    return await POSTApi<LoginRequestPOST, AuthenticationBaseResponsePOST>(
      `${API_URL}/login`,
      payload,
    );
  } catch (error) {
    if (error instanceof ServiceError || error instanceof BadServiceRequest) {
      throw error;
    }

    throw new ServiceError("Login Service is temporarily unavailable");
  }
};

const getPayloadFromFormData = (formData: FormData) => {
  const payload: SignUpRequestPOST | LoginRequestPOST = {
    email: "",
    password: "",
  };

  for (const [key, value] of formData.entries()) {
    if (key in payload) {
      const formValue = value as string;
      if (!AUTHENTICATION_VALIDATOR_RECORDS[key](formValue)) {
        throw new BadServiceRequest(`Invalid ${key} format.`);
      }

      payload[key as keyof SignUpRequestPOST] = formValue;
    }
  }
  return payload;
};
