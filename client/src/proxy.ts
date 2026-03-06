import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode, JwtPayload } from "jwt-decode";

import PATH from "./lib/paths";
import { UserStatus } from "./lib/api/data-contracts";

const BYPASS_PATHS = new Set([PATH.LOGIN, PATH.SIGNUP] as string[]);

interface IJwtPayload extends JwtPayload {
  status: string;
}

export function proxy(req: NextRequest) {
  const jwt = req.cookies.get("jwt")?.value;
  const decodedJwt = jwt ? jwtDecode<IJwtPayload>(jwt) : undefined;

  const { pathname } = req.nextUrl;
  const isBypassPath = BYPASS_PATHS.has(pathname);

  if (!decodedJwt) {
    if (isBypassPath) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(PATH.LOGIN, req.url));
  }

  if (
    decodedJwt.status === UserStatus.NoFullName &&
    pathname !== PATH.ONBOARDING
  ) {
    return NextResponse.redirect(new URL(PATH.ONBOARDING, req.url));
  }

  if (isBypassPath) {
    return NextResponse.redirect(new URL(PATH.HOME, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
