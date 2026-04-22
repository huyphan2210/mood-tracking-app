import { MoodTrends } from "@/lib/api/data-contracts";
import { NextRequest, NextResponse } from "next/server";
import { internalError, api, getJwt, badRequest } from "../../api.base";

export const getMoodTrendsByTime = () =>
  async function GET(req: NextRequest) {
    if (!(await getJwt())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const queries = req.nextUrl.searchParams;
    const startDate = queries.get("startDate");
    const endDate = queries.get("endDate");

    if (!startDate || !endDate) {
      return badRequest("startDate and endDate query parameters are required");
    }

    try {
      const response = await api.moodTrendsList(
        { startDate, endDate },
        {
          secure: true,
        },
      );

      const moodTrends: MoodTrends = response.data
        ? await response.json()
        : null;

      const returnedResponse = NextResponse.json(moodTrends, {
        status: 200,
      });

      return returnedResponse;
    } catch (error) {
      console.error(error);
      return internalError();
    }
  };

export const GET = getMoodTrendsByTime();
