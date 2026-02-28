/**
 * AI Strain Recommendations Router
 * Uses the built-in LLM helper to recommend cannabis strains based on user preferences.
 */
import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { getAllActiveProducts } from "./db";

export const recommendationsRouter = router({
  /**
   * Get AI-powered strain recommendations based on user's desired effects and preferences.
   * This is a public procedure so unauthenticated users can also get recommendations.
   */
  getStrainRecommendations: publicProcedure
    .input(
      z.object({
        desiredEffects: z.array(z.string()).min(1).max(5),
        preferredCategory: z
          .enum(["flower", "edibles", "concentrates", "pre-rolls", "vapes", "hemp", "any"])
          .default("any"),
        thcPreference: z
          .enum(["low", "medium", "high", "any"])
          .default("any"),
        experienceLevel: z
          .enum(["beginner", "intermediate", "experienced"])
          .default("intermediate"),
      })
    )
    .query(async ({ input }) => {
      // Fetch available products from the database
      const allProducts = await getAllActiveProducts();

      if (allProducts.length === 0) {
        return { recommendations: [], reasoning: "No products currently available." };
      }

      // Build a concise product catalog for the LLM (avoid sending full product objects)
      const catalog = allProducts
        .slice(0, 40) // cap at 40 to keep prompt manageable
        .map((p) => ({
          id: p.id,
          name: p.name,
          strain: p.strain,
          category: p.category,
          thc: p.thcPercentage ?? "unknown",
          cbd: p.cbdPercentage ?? "unknown",
          description: p.description ? p.description.slice(0, 120) : "",
        }));

      const systemPrompt = `You are a knowledgeable cannabis sommelier for ZAPPAY, a legal cannabis marketplace.
Your job is to recommend the best matching products from the provided catalog based on the user's preferences.
Always respond with valid JSON matching the schema exactly. Be concise and helpful.`;

      const userPrompt = `User preferences:
- Desired effects: ${input.desiredEffects.join(", ")}
- Preferred category: ${input.preferredCategory}
- THC preference: ${input.thcPreference}
- Experience level: ${input.experienceLevel}

Available products catalog:
${JSON.stringify(catalog, null, 2)}

Return a JSON object with:
{
  "recommendations": [
    {
      "productId": <number>,
      "productName": "<string>",
      "matchReason": "<1-2 sentence explanation of why this matches the user's preferences>"
    }
  ],
  "reasoning": "<1-2 sentence overall explanation of your selection approach>"
}

Select 3-5 products that best match the preferences. If fewer than 3 match well, return only those that genuinely match.`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "strain_recommendations",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        productId: { type: "number" },
                        productName: { type: "string" },
                        matchReason: { type: "string" },
                      },
                      required: ["productId", "productName", "matchReason"],
                      additionalProperties: false,
                    },
                  },
                  reasoning: { type: "string" },
                },
                required: ["recommendations", "reasoning"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response?.choices?.[0]?.message?.content;
        if (!content || typeof content !== 'string') {
          return { recommendations: [], reasoning: "Unable to generate recommendations at this time." };
        }

        const parsed = JSON.parse(content as string);

        // Enrich recommendations with full product data
        const enriched = parsed.recommendations
          .map((rec: { productId: number; productName: string; matchReason: string }) => {
            const product = allProducts.find((p) => p.id === rec.productId);
            if (!product) return null;
            return {
              productId: rec.productId,
              productName: rec.productName,
              matchReason: rec.matchReason,
              product,
            };
          })
          .filter(Boolean);

        return {
          recommendations: enriched,
          reasoning: parsed.reasoning,
        };
      } catch (err) {
        console.error("[Recommendations] LLM error:", err);
        return { recommendations: [], reasoning: "Recommendations temporarily unavailable." };
      }
    }),
});
