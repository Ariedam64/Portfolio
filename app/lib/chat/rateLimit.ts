/**
 * Limiteur en mémoire, par IP et global.
 *
 * Sur Vercel, chaque instance a son propre compteur : c'est une seconde ligne
 * de défense. La vraie limite par IP se règle dans le pare-feu Vercel
 * (Firewall > Rate Limiting sur /api/chat), et le vrai plafond de dépense dans
 * la console Anthropic (limite de dépense du workspace).
 */

const PER_IP_LIMIT = 20;
const PER_IP_WINDOW_MS = 10 * 60 * 1000;
const GLOBAL_DAILY_LIMIT = 2000;
const DAY_MS = 24 * 60 * 60 * 1000;

const hits = new Map<string, number[]>();
let globalCount = 0;
let globalWindowStart = Date.now();

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Enregistre une requête. Renvoie false si elle dépasse une limite. */
export function allowRequest(ip: string, now = Date.now()): boolean {
  if (now - globalWindowStart > DAY_MS) {
    globalWindowStart = now;
    globalCount = 0;
  }
  if (globalCount >= GLOBAL_DAILY_LIMIT) return false;

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < PER_IP_WINDOW_MS);
  if (recent.length >= PER_IP_LIMIT) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  globalCount++;

  // Ménage de temps en temps pour que la Map ne grossisse pas indéfiniment.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= PER_IP_WINDOW_MS)) hits.delete(key);
    }
  }
  return true;
}
