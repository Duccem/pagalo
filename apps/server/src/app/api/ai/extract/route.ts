import { extractData } from "@/lib/ai/extract-data";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { image } = await request.json();
  const data = await extractData(image);

  return NextResponse.json(data);
};

