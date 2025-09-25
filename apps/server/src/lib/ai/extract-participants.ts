import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import z from "zod";

const schema = z.object({
  participants: z
    .array(
      z.object({
        name: z.string().describe("The full name of the participant"),
      })
    )
    .describe("A list of participants involved in the bill splitting"),
});

const prompt = `You are an expert at extracting information from messages.

Your task:
1. Analyze the messages provided
2. Extract the name  of each participant mentioned
3. Format the data in a structured way

Guidelines for extraction:
- Identify each unique participant mentioned in the messages
- Capture their full names accurately
- Ensure no duplicate names are included in the final list
- If no participants are mentioned, return an empty list

IMPORTANT: Extract ONLY the information visible in the messages. Do not make assumptions about missing data.`;
type ParticipantsData = z.infer<typeof schema>;

export const extractParticipants = async (
  message: string
): Promise<ParticipantsData> => {
  const response = await generateObject({
    model: google("gemini-2.0-flash"),
    system: prompt,
    schema,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Extract the participants from this message:" },
          { type: "text", text: message },
        ],
      },
    ] as any,
  });

  return response.object;
};

