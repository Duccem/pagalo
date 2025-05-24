import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function betterAuthMiddleware(
  req: NextRequest,
  response: NextResponse,
  publicRoutes: string[]
) {
  const session = getSessionCookie(req, {
    cookieName: "pagalo_session",
    cookiePrefix: "",
  });

  const nextUrl = req.nextUrl;

  const pathnameLocale = nextUrl.pathname.split("/", 2)?.[1];

  // Remove the locale from the pathname
  const pathnameWithoutLocale = pathnameLocale
    ? nextUrl.pathname.slice(pathnameLocale.length + 1)
    : nextUrl.pathname;

  // Create a new URL without the locale in the pathname
  const newUrl = new URL(pathnameWithoutLocale || "/", req.url);

  if (!session && !publicRoutes.includes(newUrl.pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (session && publicRoutes.includes(newUrl.pathname)) {
    return NextResponse.redirect(new URL("/bill", req.url));
  }

  return response;
}

