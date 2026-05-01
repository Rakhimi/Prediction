import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
  hmacSha256Hex,
  isFreshTimestamp,
  verifyHmacSha256Hex,
} from "@/lib/signature";
import { createSessionCookie } from "@/lib/session";

function errorResponse(msg: string, code = 400) {
  return NextResponse.json(
    {
      status: false,
      code,
      msg,
      output: [],
    },
    { status: 200 }
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const uid = url.searchParams.get("uid");
  const username = url.searchParams.get("username");
  const ts = url.searchParams.get("ts");
  const nonce = url.searchParams.get("nonce");
  const h = url.searchParams.get("h");

  console.log("INCOMING QUERY:", {
    uid,
    username,
    ts,
    nonce,
    h,
  });

  if (!uid || !ts || !nonce || !h) {
    return errorResponse("Invalid Params");
  }

  if (!isFreshTimestamp(ts, 300)) {
    return errorResponse("Timestamp Expired");
  }

  const providerSecret = process.env.PROVIDER_SECRET;
  if (!providerSecret) {
    return errorResponse("Provider Secret Key Not Found");
  }

  const incomingValid = verifyHmacSha256Hex(
    { uid, username, ts, nonce },
    h,
    providerSecret
  );

  if (!incomingValid) {
    return errorResponse("Invalid Sign");
  }

  const providerApiUrl = process.env.PROVIDER_MEMBER_API_URL;
  if (!providerApiUrl) {
    return errorResponse("Provider Not Found");
  }

  // Call provider API for member/deposit info
  const requestTs = Math.floor(Date.now() / 1000);
  const requestNonce = crypto.randomBytes(16).toString("hex");
  const requestData = { uid, ts: requestTs, nonce: requestNonce };
  const requestH = hmacSha256Hex(requestData, providerSecret);

  console.log("PROVIDER API URL:", providerApiUrl);

  console.log("REQUEST DATA:", {
    uid,
    requestTs,
    requestNonce,
    requestH,
  });

  let upstream;

  console.log("BODY SENT:", JSON.stringify({
    data: {
      ...requestData,
      h: requestH
    }
  }));
  try {
    upstream = await fetch(providerApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          ...requestData,
          h: requestH,
        },
      }),
    });
  } catch (err) {
    console.error("FETCH FAILED:", err);
    return errorResponse("Fetch Failed");
  }

  console.log("UPSTREAM STATUS:", upstream.status);

  const rawText = await upstream.text();
  console.log("UPSTREAM RAW RESPONSE:", rawText);

  let upstreamJson = null;
  try {
    upstreamJson = JSON.parse(rawText);
  } catch (e) {
    console.error("INVALID JSON");
  }

  if (!upstreamJson || upstreamJson.status !== true) {
    return errorResponse(upstreamJson?.msg ?? "Provider API Error");
  }

  const data = upstreamJson?.output?.data;
  if (!data) {
    return errorResponse("Provider API Error");
  }

  const responseFields = {
    isMember: !!data.isMember,
    ftdAmount: String(data.ftdAmount ?? "0.00"),
    recentDepositAmount: String(data.recentDepositAmount ?? "0.00"),
    ts: data.ts,
    nonce: data.nonce,
  };

  if (!data.h || !verifyHmacSha256Hex(responseFields, String(data.h), providerSecret)) {
    return errorResponse("Invalid Sign");
  }

  // Store or update in your DB
  await prisma.member.upsert({
    where: { providerUid: String(uid) },
    update: {
      isMember: !!data.isMember,
      ftdAmount: String(data.ftdAmount ?? "0.00"),
      recentDepositAmount: String(data.recentDepositAmount ?? "0.00"),
      lastSyncedAt: new Date(),
    },
    create: {
      providerUid: String(uid),
      isMember: !!data.isMember,
      ftdAmount: String(data.ftdAmount ?? "0.00"),
      recentDepositAmount: String(data.recentDepositAmount ?? "0.00"),
      lastSyncedAt: new Date(),
    },
  });

  const sessionSecret = process.env.APP_SESSION_SECRET;
  if (!sessionSecret) {
    return errorResponse("Provider Secret Key Not Found");
  }

  const sessionCookie = createSessionCookie(String(uid), sessionSecret);

  const res = NextResponse.redirect(new URL("/", url.origin));
  res.cookies.set("n8s_session", sessionCookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}