import { Api } from "@/lib/api/Api";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export const api = new Api({
  baseUrl: process.env.API_BASE_URL ?? "http://localhost:5281",
});

export const badRequest = (message: string) =>
  NextResponse.json<ApiError>(
    {
      message,
      statusCode: 400,
      name: "BadRequest",
    },
    { status: 400 },
  );

export const unauthorizedRequest = (message: string) =>
  NextResponse.json<ApiError>(
    {
      message,
      statusCode: 401,
      name: "Unauthorized",
    },
    { status: 401 },
  );

export const internalError = (
  message = "Authentication Service is unavailable",
) =>
  NextResponse.json<ApiError>(
    {
      message,
      statusCode: 500,
      name: "InternalServerError",
    },
    { status: 500 },
  );
