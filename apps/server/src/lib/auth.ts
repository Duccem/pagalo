import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectURI:
        "https://2jphk0dv-3000.use2.devtunnels.ms//api/auth/callback/google",
    },
  },
  trustedOrigins: [
    process.env.CORS_ORIGIN || "",
    "pagalo://",
    "exp://s9pku04-ducen29-8081.exp.direct",
    "exp://192.168.1.102:8081",
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [expo()],
});

