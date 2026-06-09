import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({ success: true });

  res.cookies.set("n8s_session", "", {
    path: "/",
    domain: ".new8scoreai.com",
    expires: new Date(0),
  });

  return res;
}