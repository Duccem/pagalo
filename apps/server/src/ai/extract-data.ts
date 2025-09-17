import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import z from "zod";

const schema = z.object({
  vendor: z.string().describe("The name of the vendor or store"),
  date: z.string().describe("The date of the transaction in YYYY-MM-DD format"),
  total: z.number().describe("The total amount paid, including tax"),
  tax: z
    .number()
    .nullable()
    .describe("The tax amount, if available, otherwise null")
    .default(0),
  tip: z
    .number()
    .nullable()
    .describe("The tip amount, if available, otherwise null")
    .default(0),
  items: z
    .array(
      z.object({
        description: z.string().describe("A brief description of the item"),
        quantity: z.number().describe("The quantity purchased"),
        price: z.number().describe("The price per item"),
      })
    )
    .describe("A list of items purchased"),
});

const prompt = `You are an expert at extracting information from receipts.

  Your task:
  1. Analyze the receipt image provided
  2. Extract all relevant billing information
  3. Format the data in a structured way

  Guidelines for extraction:
  - Identify the restaurant/business name and location if available otherwise just return null
  - Find the receipt date or return null, date format should be YYYY-MM-DD but if day it's less than 10 don't add a 0 in front
  - Extract each item with its name and total price
  - Capture tax amount, if applicable and not percentage but the money amount otherwise return null
  - Identify any tips or gratuities, if multiple tips are shown just output the medium one otherwise return null
  - Ensure all numerical values are accurate
  - Convert all prices to decimal numbers
  
  IMPORTANT: Extract ONLY the information visible in the receipt. Do not make assumptions about missing data.`;

type InvoiceData = z.infer<typeof schema>;

export const extractData = async (img: string): Promise<InvoiceData> => {
  const response = await generateObject({
    model: google("gemini-2.0-flash"),
    system: prompt,
    schema,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Extract the invoice data from this image:" },
          { type: "file", data: img, mediaType: "image/png" },
        ],
      },
    ] as any,
  });

  return response.object;
};

