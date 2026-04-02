import { NextRequest, NextResponse } from "next/server";

import { Api } from "@/lib/api/Api";
import {
  ErrorResponse,
  AnalyzeMoodRequestPOST,
} from "@/lib/api/data-contracts";

import {
  api,
  badRequest,
  getJwt,
  internalError,
  unauthorizedRequest,
} from "../../api.base";

export const createMood = () =>
  async function POST(req: NextRequest) {
    const jwt = await getJwt();
    if (!jwt) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // api.setSecurityData(jwt);
    try {
      const payload: AnalyzeMoodRequestPOST = await req.json();
      if (
        !payload.mood ||
        !payload.moodDescription ||
        !payload.sleepHours ||
        !payload.feelings ||
        payload.feelings.length === 0
      ) {
        return badRequest("Invalid request payload");
      }

      await api.moodCreate(payload, { secure: true });

      const returnedResponse = NextResponse.json("", { status: 200 });

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

export const POST = createMood();
