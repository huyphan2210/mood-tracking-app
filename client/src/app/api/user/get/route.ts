import { Api } from "@/lib/api/Api";
import {
  AuthenticationBaseResponsePOST,
  UserResponse,
} from "@/lib/api/data-contracts";
import { NextRequest, NextResponse } from "next/server";
import { internalError, api, getJwt } from "../../api.base";
import { cookies } from "next/headers";

export const getUser = () =>
  async function GET(req: NextRequest) {
    try {
      const appCookies = await cookies();
      const jwt = await getJwt();
      const hasVisited = appCookies.get("visited");
      const isFirstTimeVisit = !hasVisited && !jwt;

      let guestJwt = "";
      if (isFirstTimeVisit) {
        guestJwt = await loginWithGuestCredentials();
        api.setSecurityData(guestJwt);
      } else if (jwt) {
        api.setSecurityData(jwt);
      } else if (!jwt) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const response = await api.userList({
        secure: true,
      });

      const userInfo: UserResponse = await response.json();
      const returnedResponse = NextResponse.json(userInfo, {
        status: 200,
      });

      if (isFirstTimeVisit) {
        returnedResponse.cookies.set("visited", "true");
        returnedResponse.cookies.set("jwt", guestJwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24,
        });
      }

      return returnedResponse;
    } catch (error) {
      console.error(error);
      return internalError();
    }
  };

export const GET = getUser();

const loginWithGuestCredentials = async () => {
  const { authLoginCreate } = api;
  const guestLoginResponse = await authLoginCreate({
    email: process.env.GUEST_EMAIL || "",
    password: process.env.GUEST_PASSWORD || "",
  });

  const guestInfo: AuthenticationBaseResponsePOST =
    await guestLoginResponse.json();

  api.setSecurityData(guestInfo.jwt);
  return guestInfo.jwt;
};
