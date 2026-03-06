import { ApiError } from "next/dist/server/api-utils";

export class BadServiceRequest extends Error {}

export class ServiceError extends Error {
  constructor(errResponse: ApiError);
  constructor(errMsg: string);
  constructor(arg: ApiError | string) {
    const errMsg = typeof arg === "object" ? arg.message : arg;

    super(errMsg);
  }
}

export const POSTApi = async <TRequest, TResponse>(
  url: string,
  payload: TRequest,
) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new ServiceError(error);
  }

  const result: TResponse = await response.json();

  return result;
};
