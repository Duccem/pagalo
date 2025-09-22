import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
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
        "https://filiberto-uncasemated-penni.ngrok-free.dev/api/auth/callback/google",
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

