import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

const NORRIS_SYSTEM_PROMPT = `You are Norris, ZAPPAY's expert cannabis strain advisor. ZAPPAY is the world's first cannabis B2B marketplace connecting licensed farmers, dispensaries, and transporters across all legal US states.

Your role:
- Help users (farmers, dispensary buyers, growers) identify the right cannabis strains, products, and suppliers for their needs
- Provide expert guidance on strain characteristics: THC/CBD content, terpene profiles, effects, growing conditions, yield, and best use cases
- Recommend product categories available on ZAPPAY: flower, concentrates, edibles, seeds, clones, equipment, nutrients, and more
- Advise on compliance considerations (state-specific regulations, testing requirements)
- Be knowledgeable about cultivation best practices, harvest timing, and post-harvest processing

Tone: Professional, knowledgeable, and empowering. You respect the grower's expertise and help them make informed decisions. Keep responses concise and actionable — 2-4 paragraphs max unless the user asks for detail.

Important: You are not a medical professional. Do not provide medical advice. Always remind users to comply with their state's cannabis regulations.`;

export const norrisRouter = router({
  // Protected: ask Norris a strain question
  ask: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(2000),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).max(20).default([]),
    }))
    .mutation(async ({ input }) => {
      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: NORRIS_SYSTEM_PROMPT },
        ...input.history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user", content: input.message },
      ];

      const response = await invokeLLM({ messages });
      const rawContent = response?.choices?.[0]?.message?.content;
      const content = typeof rawContent === "string"
        ? rawContent
        : Array.isArray(rawContent)
          ? rawContent.map((c: { type: string; text?: string }) => c.type === "text" ? c.text ?? "" : "").join("")
          : "I'm having trouble responding right now. Please try again.";
      return { reply: content };
    }),
});
