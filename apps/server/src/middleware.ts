import { NextResponse } from "next/server";

export function middleware() {
  const res = NextResponse.next();

  return res;
}

export const config = {
  matcher: "/:path*",
};

