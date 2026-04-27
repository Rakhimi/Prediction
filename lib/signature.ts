import crypto from "crypto";

type SignValue = string | number | boolean | null | undefined;

function normalizePhpValue(value: Exclude<SignValue, null | undefined>) {
  if (typeof value === "boolean") return value ? "1" : "";
  return String(value);
}

export function buildPhpQuery(data: Record<string, SignValue>) {
  const sortedKeys = Object.keys(data).sort();

  const sortedObject: Record<string, string> = {};
  for (const key of sortedKeys) {
    const value = data[key];
    if (value === undefined || value === null) continue;
    sortedObject[key] = normalizePhpValue(value as Exclude<SignValue, null | undefined>);
  }

  return new URLSearchParams(sortedObject).toString();
}

export function hmacSha256Hex(data: Record<string, SignValue>, secret: string) {
  return crypto.createHmac("sha256", secret).update(buildPhpQuery(data)).digest("hex");
}

export function verifyHmacSha256Hex(
  data: Record<string, SignValue>,
  receivedH: string,
  secret: string
) {
  if (!/^[a-f0-9]{64}$/i.test(receivedH)) return false;

  const expected = hmacSha256Hex(data, secret);
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(receivedH, "hex")
  );
}

export function isFreshTimestamp(ts: string | number, skewSeconds = 300) {
  const n = Number(ts);
  if (!Number.isInteger(n)) return false;

  const now = Math.floor(Date.now() / 1000);
  return Math.abs(now - n) <= skewSeconds;
}