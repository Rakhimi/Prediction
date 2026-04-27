import crypto from "crypto";

type SessionPayload = {
  uid: string;
  exp: number;
};

export function createSessionCookie(
  uid: string,
  secret: string,
  ttlSeconds = 60 * 60 * 24
) {
  const payload: SessionPayload = {
    uid,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest("hex");

  return `${payloadB64}.${sig}`;
}

export function parseSessionCookie(cookieValue: string, secret: string) {
  try {
    const [payloadB64, sig] = cookieValue.split(".");
    if (!payloadB64 || !sig || !/^[a-f0-9]{64}$/i.test(sig)) return null;

    const expected = crypto.createHmac("sha256", secret).update(payloadB64).digest("hex");
    if (
      expected.length !== sig.length ||
      !crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"))
    ) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as SessionPayload;
    if (!payload?.uid || !payload?.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}