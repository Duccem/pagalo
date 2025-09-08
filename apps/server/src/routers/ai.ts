import { extractData } from "@/ai/extract-data";
import { Hono } from "hono";

export const aiRouter = new Hono().basePath("/ai");

aiRouter.post("/extract", async (c) => {
  const { image } = await c.req.json();
  const data = await extractData(image);

  return c.json(data);
});

