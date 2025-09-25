import { extractParticipants } from "@/lib/ai/extract-participants";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { message } = await request.json();
  const data = await extractParticipants(message);

  return NextResponse.json(data);
};

