import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";

const translationMiddleware = createI18nMiddleware({
  locales: ["en", "es"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  return translationMiddleware(req);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(!api)(.*)"],
};

