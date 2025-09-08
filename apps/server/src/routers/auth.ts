import { auth } from "@/lib/auth";
import { Hono } from "hono";

export const authRouter = new Hono().basePath("/auth");

authRouter.on(["POST", "GET"], "/**", (c) => auth.handler(c.req.raw));
