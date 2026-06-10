import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/session";

const SECRET_KEY = process.env.PROVIDER_SECRET!;
const LOGIN_URL =
  "https://callback-api.tunamyr008.xyz/api-callback/match-prediction/login/new8scoreai";

const REGISTER_DATA_URL =
  "https://callback-api.tunamyr008.xyz/api-callback/match-prediction/get-register-data/new8scoreai";

/**
 * HMAC SIGNATURE
 */
function generateSignature(data: Record<string, any>) {
  const sortedKeys = Object.keys(data).sort();

  const payload = sortedKeys
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");

  return crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex");
}

/**
 * FETCH JSON SAFE
 */
async function safeFetchJson(url: string, options: RequestInit) {
  const res = await fetch(url, options);
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const ts = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(8).toString("hex");

    /**
     * =========================
     * 1. LOGIN REQUEST
     * =========================
     */
    const loginRequestData = {
      username: body.username,
      password: body.password,
      ts,
      nonce,
    };

    const loginSignature = generateSignature(loginRequestData);

    const loginResponse = await safeFetchJson(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          ...loginRequestData,
          h: loginSignature,
        },
      }),
    });

    console.log("loginResponse", loginResponse)

    if (!loginResponse?.status) {
      return NextResponse.json(
        {
          success: false,
          message: loginResponse?.msg || "Login failed",
          providerResponse: loginResponse,
        },
        { status: 400 }
      );
    }

    const token = loginResponse.output?.data?.token;

    const providerUid = loginResponse.output?.data?.uid;

    if (!token || !providerUid) {
      return NextResponse.json(
        {
          success: false,
          message: "Token or UID missing from provider",
        },
        { status: 400 }
      );
    }

    /**
     * =========================
     * 2. GET REGISTER DATA
     * =========================
     */
    const regTs = Math.floor(Date.now() / 1000);
    const regNonce = crypto.randomBytes(8).toString("hex");

    const registerRequestData = {
      uid: providerUid,
      ts: regTs,
      nonce: regNonce,
    };

    const registerSignature = generateSignature(registerRequestData);

    const registerResponse = await safeFetchJson(REGISTER_DATA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          ...registerRequestData,
          h: registerSignature,
        },
      }),
    });

    const profile = registerResponse?.output?.data;

    const deposit = Number(profile?.recentDepositAmount ?? 0);

    let accessUntil: Date | null = null;

    if (deposit >= 50) {
      accessUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    await prisma.member.upsert({
      where: {
        providerUid: String(providerUid),
      },
      update: {
        isMember: !!profile?.isMember,
        ftdAmount: String(profile?.ftdAmount ?? "0.00"),
        recentDepositAmount: String(profile?.recentDepositAmount ?? "0.00"),
        lastSyncedAt: new Date(),
        accessUntil,
      },
      create: {
        providerUid: String(providerUid),
        isMember: !!profile?.isMember,
        ftdAmount: String(profile?.ftdAmount ?? "0.00"),
        recentDepositAmount: String(profile?.recentDepositAmount ?? "0.00"),
        lastSyncedAt: new Date(),
        accessUntil,
      },
    });

    /**
     * =========================
     * 4. SESSION COOKIE
     * =========================
     */
    const sessionCookie = createSessionCookie(
      {
        uid: body.username,
        providerToken: token,
      },
      process.env.APP_SESSION_SECRET!
    );

    const res = NextResponse.json({
      success: true,
      token,
      profile,
    });

    res.cookies.set("n8s_session", sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      domain: ".new8scoreai.com",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}