import { google } from "@ai-sdk/google";
import { convertToModelMessages, generateObject } from "ai";
import z from "zod";

const schema = z.object({
  vendor: z.string().describe("The name of the vendor or store"),
  date: z.string().describe("The date of the transaction in YYYY-MM-DD format"),
  total: z.number().describe("The total amount paid, including tax"),
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

const prompt = `You are an expert at extracting structured data from images of invoices and receipts. Given an image, extract the following information:
- Vendor Name
- Transaction Date (in YYYY-MM-DD format)
- Total Amount Paid (including tax)
- List of Items Purchased (with description, quantity, and price)

If any information is missing or unclear, make a reasonable assumption based on common practices. Return the data in the specified JSON format.`;

type InvoiceData = z.infer<typeof schema>;

export const extractData = async (img: string): Promise<InvoiceData> => {
  const response = await generateObject({
    model: google("gemini-2.0-flash"),
    prompt,
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

