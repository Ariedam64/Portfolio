/** Utilitaires JSON partagés par plusieurs outils. */
import { parse, type ParseError } from "jsonc-parser";

export type JsonError = { message: string; line?: number; column?: number };

/**
 * Message et position d'une erreur de JSON.parse. Le message du navigateur ne
 * donne pas toujours la position (Chrome l'a retirée), donc on la retrouve en
 * relisant le texte avec jsonc-parser en mode JSON strict.
 */
export function describeJsonError(error: unknown, source: string): JsonError {
  const message = error instanceof Error ? error.message : String(error);
  const errors: ParseError[] = [];
  parse(source, errors, { disallowComments: true, allowTrailingComma: false, allowEmptyContent: false });
  if (errors.length === 0) return { message };
  const lines = source.slice(0, errors[0].offset).split("\n");
  return { message, line: lines.length, column: lines[lines.length - 1].length + 1 };
}

export function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort((a, b) => a.localeCompare(b))
        .map((key) => [key, sortKeysDeep((value as Record<string, unknown>)[key])]),
    );
  }
  return value;
}
