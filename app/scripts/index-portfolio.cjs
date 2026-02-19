// scripts/index-portfolio.cjs
const fs = require("fs/promises");
const path = require("path");
const { Pinecone } = require("@pinecone-database/pinecone");
const OpenAI = require("openai").default;
require("dotenv").config();

const CHUNK_SIZE = 500;   // caractères cibles par chunk
const CHUNK_OVERLAP = 80; // chevauchement entre chunks

/**
 * Découpe un texte en chunks de taille ~CHUNK_SIZE avec overlap.
 * Coupe aux sauts de ligne pour éviter de couper au milieu d'une phrase.
 */
function splitIntoChunks(text, source) {
  // Normalise les fins de ligne Windows
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Découpe d'abord par blocs (double saut de ligne = nouveau paragraphe)
  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 20);

  const chunks = [];
  let current = "";

  for (const para of paragraphs) {
    // Si ajouter ce paragraphe dépasse la taille cible, flush le chunk actuel
    if (current.length > 0 && current.length + para.length > CHUNK_SIZE) {
      chunks.push(current.trim());
      // Overlap : on reprend les derniers caractères du chunk précédent
      const overlap = current.slice(-CHUNK_OVERLAP);
      current = overlap + "\n\n" + para;
    } else {
      current = current.length > 0 ? current + "\n\n" + para : para;
    }
  }

  if (current.trim().length > 20) {
    chunks.push(current.trim());
  }

  return chunks.map((text, i) => ({
    text,
    source,
    chunk_index: i,
  }));
}

;(async () => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const pc = new Pinecone();
    const index = pc.index(process.env.PINECONE_INDEX);

    // 1) Purge complète de l'index
    console.log("🧨 Suppression de tous les vecteurs de l'index...");
    await index.deleteAll();
    console.log("✅ Index vidé.");

    // 2) Lecture des fichiers de contenu
    const dir = path.resolve(process.cwd(), "app/data/assistant");
    const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".txt"));

    let totalChunks = 0;

    for (const file of files) {
      const text = await fs.readFile(path.join(dir, file), "utf-8");
      const source = path.basename(file, ".txt");
      const chunks = splitIntoChunks(text, source);

      if (!chunks.length) {
        console.log(`⚠️  Aucun chunk dans ${file}, ignoré.`);
        continue;
      }

      // Embed par batch de 50 (limite OpenAI raisonnable)
      const BATCH = 50;
      const vectors = [];

      for (let i = 0; i < chunks.length; i += BATCH) {
        const batch = chunks.slice(i, i + BATCH);
        const embedRes = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: batch.map((c) => c.text),
        });
        embedRes.data.forEach((e, j) => {
          const chunk = batch[j];
          vectors.push({
            id: `${source}::${chunk.chunk_index}`,
            values: e.embedding,
            metadata: {
              text: chunk.text,
              source: chunk.source,
              chunk_index: chunk.chunk_index,
            },
          });
        });
      }

      // Upsert par batch de 100 (limite Pinecone)
      for (let i = 0; i < vectors.length; i += 100) {
        await index.upsert(vectors.slice(i, i + 100));
      }

      totalChunks += vectors.length;
      console.log(`✅ ${file} → ${vectors.length} chunks indexés`);
    }

    console.log(`\n🏁 Indexation terminée. Total : ${totalChunks} chunks.`);
  } catch (err) {
    console.error("❌ Erreur pendant l'indexation :", err);
    process.exit(1);
  }
})();
