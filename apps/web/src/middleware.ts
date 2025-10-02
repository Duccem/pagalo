import { createI18nMiddleware } from "next-international/middleware";
import type { NextRequest } from "next/server";

const translationMiddleware = createI18nMiddleware({
  locales: ["en", "es"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

export default async function middleware(request: NextRequest) {
  return translationMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|yml|json)$).*)",
  ],
};

