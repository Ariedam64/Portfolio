/** Conversions d'octets partagées par Base64, Hash et le convertisseur. */

export function bytesToBase64(bytes: Uint8Array, urlSafe = false) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const b64 = btoa(binary);
  return urlSafe ? b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : b64;
}

/** Accepte le Base64 classique comme la variante URL, avec ou sans « = » ni espaces. */
export function base64ToBytes(input: string) {
  let b64 = input.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  if (b64.startsWith("data:")) b64 = b64.slice(b64.indexOf(",") + 1);
  if (b64.length % 4 === 1) throw new Error("length");
  b64 += "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Texte UTF-8, ou null si les octets ne forment pas du texte valide. */
export function bytesToUtf8(bytes: Uint8Array) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

export function bytesToHex(bytes: Uint8Array, separator = " ") {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(separator);
}

/** Lit « 48 65 6c », « 48656c », « 0x48 0x65 » ou « \x48\x65 ». */
export function hexToBytes(input: string) {
  const clean = input.replace(/0x|\\x/gi, "").replace(/[\s,:-]+/g, "");
  if (!/^[0-9a-f]*$/i.test(clean)) throw new Error("hex");
  if (clean.length % 2 !== 0) throw new Error("odd");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}
