// tools/portfolioSearch.ts
import { tool } from "ai";
import { z } from "zod";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const pc = new Pinecone();
const index = pc.index(process.env.PINECONE_INDEX!);

// client global, pas recréé à chaque appel
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const portfolioSearch = tool({
  description:
    "Renvoie des extraits pertinents de mon portfolio pour répondre à une question sur moi ou mes projets.",
  parameters: z.object({
    query: z
      .string()
      .describe("La question de l’utilisateur à chercher dans le contenu du portfolio"),
  }),
  execute: async ({ query }) => {
    try {
      // 1) Embedding de la requête
      const { data } = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: [query],
      });
      const vector = data[0].embedding;

      // 2) Recherche dans Pinecone
      const res = await index.query({
        topK: 8,
        vector,
        includeMetadata: true,
      });

      if (!res.matches?.length) {
        return "Aucun extrait pertinent trouvé dans le portfolio pour cette question.";
      }

      // 3) On concatène les extraits texte trouvés
      const snippets = res.matches
        .map((m) => m.metadata?.text as string | undefined)
        .filter((t): t is string => Boolean(t));

      if (!snippets.length) {
        return "Les données du portfolio ne contiennent pas de texte exploitable pour cette question.";
      }

      return snippets.join("\n\n");
    } catch (err) {
      console.error("[portfolioSearch] erreur:", err);
      return "Recherche temporairement indisponible. Réponds au visiteur de mémoire si tu peux, et précise-lui que l'outil de recherche est momentanément hors service — qu'il peut réessayer plus tard ou me contacter directement.";
    }
  },
});
