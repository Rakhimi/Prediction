function getClientIP(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs
    return forwarded.split(",")[0].trim();
  }

  return (
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}