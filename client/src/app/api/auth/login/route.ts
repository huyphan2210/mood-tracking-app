import { NextRequest, NextResponse } from "next/server";

import { Api } from "@/lib/api/Api";
import {
  AuthenticationBaseResponsePOST,
  LoginRequestPOST,
  ErrorResponse,
} from "@/lib/api/data-contracts";

import { AUTHENTICATION_VALIDATOR_RECORDS } from "@/services/auth/AuthenticationService";
import {
  api,
  badRequest,
  internalError,
  unauthorizedRequest,
} from "../../api.base";

export const login = ({ authLoginCreate }: Api) =>
  async function POST(req: NextRequest) {
    try {
      const payload: LoginRequestPOST = await req.json();
      for (const key in payload) {
        if (
          !AUTHENTICATION_VALIDATOR_RECORDS[key](
            payload[key as keyof LoginRequestPOST],
          )
        ) {
          return badRequest(`Invalid ${key} format`);
        }
      }

      const response = await authLoginCreate(payload);
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
      if (error instanceof Response && error.status === 401) {
        const errorResponse: ErrorResponse = await error.json();
        return unauthorizedRequest(errorResponse.message);
      }

      console.error(error);
      return internalError();
    }
  };

export const POST = login(api);
