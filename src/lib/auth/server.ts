import { database } from "@/lib/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { bearer } from "better-auth/plugins";
import { headers } from "next/headers";
import { cache } from "react";
export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: "pg",
  }),
  advanced: {
    generateId: false,
    cookiePrefix: "",
    cookies: {
      session_token: {
        name: "pagalo_session",
      },
    },
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies(), bearer()],
});

export type BetterSession = typeof auth.$Infer.Session;
export type BetterUser = typeof auth.$Infer.Session.user;

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

