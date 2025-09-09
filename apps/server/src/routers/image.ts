import { uploadRouter } from "@/lib/uploadthing";
import { Hono } from "hono";
import { createRouteHandler } from "uploadthing/server";

const handlers = createRouteHandler({
  router: uploadRouter,
  config: {},
});

export const imageRouter = new Hono().basePath("/image");

imageRouter.all("/upload", (c) => handlers(c.req.raw));

