import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { aiRouter } from "./routers/ai";
import { authRouter } from "./routers/auth";
const app = new Hono().basePath("/api");

app.use(logger());
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("OK");
});

app.route("/", authRouter);
app.route("/", aiRouter);

export default app;

