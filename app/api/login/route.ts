import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/session";

const SECRET_KEY = process.env.PROVIDER_SECRET!;

function generateSignature(data: Record<string, any>) {
  const sortedKeys = Object.keys(data).sort();

  const payload = sortedKeys
    .map((key) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(
        data[key]
      )}`;
    })
    .join("&");

  return crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const ts = Math.floor(Date.now() / 1000);

    const nonce = crypto.randomBytes(8).toString("hex");

    const requestData = {
      username: body.username,
      password: body.password,
      ts,
      nonce,
    };

    const h = generateSignature(requestData);

    const response = await fetch(
      "https://callback-api.butterusd001.xyz/api-callback/match-prediction/login/new8scoreai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            ...requestData,
            h,
          },
        }),
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          message: "Provider returned invalid JSON",
          raw: text,
        },
        { status: 500 }
      );
    }

    // IMPORTANT
    if (!data?.status) {
      return NextResponse.json(
        {
          success: false,
          message: data?.msg || "Login failed",
          providerResponse: data,
        },
        { status: 400 }
      );
    }

    const token = data.output?.data?.token;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token missing from provider",
        },
        { status: 400 }
      );
    }

    // CREATE OR UPDATE USER IN YOUR DATABASE
    await prisma.member.upsert({
      where: {
        providerUid: body.username,
      },
      update: {
        lastSyncedAt: new Date(),
      },
      create: {
        providerUid: body.username,
        isMember: false,
        ftdAmount: "0.00",
        recentDepositAmount: "0.00",
      },
    });

    // CREATE YOUR SESSION COOKIE
    const sessionCookie = createSessionCookie(
      {
        uid: body.username,
        providerToken: token,
      },
      process.env.APP_SESSION_SECRET!
    );

    // CREATE RESPONSE
    const res = NextResponse.json({
      success: true,
      token,
    });

    // SET COOKIE
    res.cookies.set("n8s_session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
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
