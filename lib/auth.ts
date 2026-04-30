// lib/auth.ts
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { parseSessionCookie } from "@/lib/session";

export async function getCurrentMember() {
  const cookieStore = await cookies();
  const token = cookieStore.get("n8s_session")?.value;

  if (!token) return null;

  const session = parseSessionCookie(
    token,
    process.env.APP_SESSION_SECRET!
  );

  if (!session) return null;

  const member = await prisma.member.findUnique({
    where: { providerUid: session.uid },
  });

  return member;
}