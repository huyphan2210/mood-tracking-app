import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import PATH from "./utilities/paths";

const BYPASS_PATHS: string[] = [PATH.LOGIN, PATH.SIGNUP];
const HOME_PATH = "/";

export function proxy(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const { pathname } = req.nextUrl;

  if (BYPASS_PATHS.includes(pathname)) {
    if (!authHeader) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(HOME_PATH, req.url));
  }

  if (!authHeader) {
    return NextResponse.redirect(new URL(PATH.LOGIN, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
