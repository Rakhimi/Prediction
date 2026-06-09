import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_BASE_URL)
  );

  res.cookies.set("n8s_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    domain: ".new8scoreai.com",
    expires: new Date(0),
  });

  return res;
}