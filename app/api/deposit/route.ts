import { cookies } from "next/headers";
import { parseSessionCookie } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const cookie = cookieStore.get("n8s_session")?.value;

  if (!cookie) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const session = parseSessionCookie(
    cookie,
    process.env.APP_SESSION_SECRET!
  );

  if (!session) {
    return NextResponse.json(
      { message: "Invalid session" },
      { status: 401 }
    );
  }

  return NextResponse.redirect(
    `https://callback-api.butterusd001.xyz?action=deposit&userToken=${session.providerToken}`
  );
}