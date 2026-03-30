import { NextResponse } from "next/server";
import { api, internalError } from "../../api.base";

export const logout = () =>
  async function POST() {
    try {
      api.setSecurityData(null);
      const returnedResponse = NextResponse.json("", { status: 200 });
      returnedResponse.cookies.delete("jwt");

      return returnedResponse;
    } catch (error) {
      console.error(error);
      return internalError();
    }
  };

export const GET = logout();
