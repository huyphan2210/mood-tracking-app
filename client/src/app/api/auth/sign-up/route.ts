import { NextRequest, NextResponse } from "next/server";

import { Api } from "@/lib/api/Api";
import {
  AuthenticationBaseResponsePOST,
  SignUpRequestPOST,
  SignUpErrorResponse,
} from "@/lib/api/data-contracts";

import { AUTHENTICATION_VALIDATOR_RECORDS } from "@/services/auth/AuthenticationService";
import { api, badRequest, internalError } from "../../api.base";

export const signUp = ({ authSignUpCreate }: Api) =>
  async function POST(req: NextRequest) {
    try {
      const payload: SignUpRequestPOST = await req.json();
      for (const key in payload) {
        if (
          !AUTHENTICATION_VALIDATOR_RECORDS[key](
            payload[key as keyof SignUpRequestPOST],
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

export const POST = signUp(api);
