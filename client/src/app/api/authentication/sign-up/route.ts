import { Api } from "@/lib/api/Api";
import {
  AuthenticationBaseResponsePOST,
  AuthenticationSignUpRequestPOST,
  SignUpErrorResponse,
} from "@/lib/api/data-contracts";
import { AUTHENTICATION_VALIDATOR_RECORDS } from "@/services/authentication/AuthenticationService";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

const api = new Api();
api.baseUrl = process.env.API_URL || "http://localhost:5281";

export const signUp = ({ authSignUpCreate }: Api) =>
  async function POST(req: NextRequest) {
    try {
      const payload: AuthenticationSignUpRequestPOST = await req.json();
      for (const key in payload) {
        if (
          !AUTHENTICATION_VALIDATOR_RECORDS[key](
            payload[key as keyof AuthenticationSignUpRequestPOST],
          )
        ) {
          return badRequest(`Invalid ${key} format`);
        }
      }

      const response = await authSignUpCreate(payload);
      const userInfo: AuthenticationBaseResponsePOST = await response.json();

      const returnedResponse = NextResponse.json(userInfo, { status: 200 });
      returnedResponse.cookies.set("jwt", userInfo.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      return returnedResponse;
    } catch (error) {
      if (error instanceof Response && error.status === 400) {
        const errorResponse: SignUpErrorResponse = await error.json();
        return badRequest(errorResponse.message);
      }

      console.error(error);
      return internalError();
    }
  };

const badRequest = (message: string) =>
  NextResponse.json<ApiError>(
    {
      message,
      statusCode: 400,
      name: "BadRequest",
    },
    { status: 400 },
  );

const internalError = (message = "Authentication Service is unavailable") =>
  NextResponse.json<ApiError>(
    {
      message,
      statusCode: 500,
      name: "InternalServerError",
    },
    { status: 500 },
  );

export const POST = signUp(new Api());
