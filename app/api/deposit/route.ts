import { cookies } from "next/headers";
import { parseSessionCookie } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  console.log("URL:", req.url);
  console.log("HEADERS:", Object.fromEntries(req.headers.entries()));

  const cookieStore = await cookies();
  console.log("COOKIES:", cookieStore.getAll());

  const cookie = cookieStore.get("n8s_session")?.value;

  if (!cookie) {
    console.log("❌ NO COOKIE RECEIVED");
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
    `https://new8myr.com?action=deposit&userToken=${session.providerToken}`
  );
}