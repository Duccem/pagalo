"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ai_1 = require("@/routers/ai");
var auth_1 = require("@/routers/auth");
require("dotenv/config");
var hono_1 = require("hono");
var cors_1 = require("hono/cors");
var logger_1 = require("hono/logger");
var app = new hono_1.Hono().basePath("/api");
app.use((0, logger_1.logger)());
app.use("/*", (0, cors_1.cors)({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.get("/", function (c) {
    return c.text("OK");
});
app.route("/", auth_1.authRouter);
app.route("/", ai_1.aiRouter);
exports.default = app;
