import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(
    new URL("/", "https://new8scoreai.com")
  );

  res.cookies.set("n8s_session", "", {
    path: "/",
    domain: ".new8scoreai.com",
    expires: new Date(0),
  });

  return res;
}