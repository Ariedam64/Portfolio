import type Anthropic from "@anthropic-ai/sdk";
import { METRIC_IDS, PROJECT_IDS, type MetricId, type ProjectId } from "./catalog";
import type { StreamEvent } from "./protocol";

/**
 * Outils d'affichage. Ils ne font rien côté serveur : ils servent au modèle à
 * dire "affiche ceci". Le serveur traduit chaque appel en événement pour le
 * widget et renvoie au modèle un simple accusé de réception.
 *
 * L'ordre et le contenu de cette liste doivent rester stables : ils font partie
 * du préfixe mis en cache.
 */
export const TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: "show_projects",
    description:
      "Affiche 1 à 3 cartes projet (image, titre, stack, liens vers la page détaillée et GitHub) sous la réponse.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        ids: {
          type: "array",
          items: { type: "string", enum: PROJECT_IDS },
          description: "Identifiants des projets à afficher, du plus pertinent au moins pertinent.",
        },
      },
      required: ["ids"],
      additionalProperties: false,
    },
  },
  {
    name: "show_metrics",
    description: "Affiche 2 à 4 tuiles de chiffres clés vérifiés sous la réponse.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        ids: {
          type: "array",
          items: { type: "string", enum: METRIC_IDS },
          description:
            "Identifiants des chiffres à afficher. daily-users, mod-installs, players-tracked, daily-requests : audience de l'écosystème. release-downloads, android-downloads, android-releases, ecosystem-commits : distribution et activité. load-optimization, server-cost : montée en charge du back-end. bug-reports-fixed : maintenance IA. weather-accuracy : API. frida-commits, frida-tests : IL2CPP Toolkit. chess-perft : moteur d'échecs.",
        },
      },
      required: ["ids"],
      additionalProperties: false,
    },
  },
  {
    name: "show_contact",
    description: "Affiche les moyens de contacter Romann : email, LinkedIn, GitHub et CV en PDF.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "suggest_followups",
    description:
      "Affiche 2 ou 3 questions de relance cliquables. À appeler en dernier, à la fin de chaque réponse.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: { type: "string" },
          description: "Questions courtes (moins de 60 caractères), dans la langue du visiteur.",
        },
      },
      required: ["questions"],
      additionalProperties: false,
    },
  },
];

const projectSet = new Set<string>(PROJECT_IDS);
const metricSet = new Set<string>(METRIC_IDS);

function stringArray(input: unknown, key: string): string[] {
  if (!input || typeof input !== "object") return [];
  const value = (input as Record<string, unknown>)[key];
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

/**
 * Traduit un appel d'outil en événement pour le widget.
 * Le nom est comparé sans tenir compte de la casse : le modèle se trompe
 * parfois de casse, et l'intention reste claire.
 * Renvoie null si l'appel est inexploitable.
 */
export function toolCallToEvent(name: string, input: unknown): StreamEvent | null {
  switch (name.toLowerCase()) {
    case "show_projects": {
      const ids = [...new Set(stringArray(input, "ids").filter((id) => projectSet.has(id)))].slice(0, 3);
      return ids.length ? { type: "projects", ids: ids as ProjectId[] } : null;
    }
    case "show_metrics": {
      const ids = [...new Set(stringArray(input, "ids").filter((id) => metricSet.has(id)))].slice(0, 4);
      return ids.length ? { type: "metrics", ids: ids as MetricId[] } : null;
    }
    case "show_contact":
      return { type: "contact" };
    case "suggest_followups": {
      const questions = stringArray(input, "questions")
        .map((q) => q.trim())
        .filter((q) => q.length > 0 && q.length <= 120)
        .slice(0, 3);
      return questions.length ? { type: "suggestions", questions } : null;
    }
    default:
      return null;
  }
}
