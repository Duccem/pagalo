import { extractData } from "@/ai/extract-data";
import { extractParticipants } from "@/ai/extract-participants";
import { Hono } from "hono";

export const aiRouter = new Hono().basePath("/ai");

aiRouter.post("/extract", async (c) => {
  const { image } = await c.req.json();
  const data = await extractData(image);

  return c.json(data);
});

aiRouter.post("/participants", async (c) => {
  const { message } = await c.req.json();
  const data = await extractParticipants(message);
  return c.json(data);
});

