import crypto from "crypto";
import { NextResponse, NextRequest } from "next/server";

const SECRET_KEY = process.env.PROVIDER_SECRET!;

function getClientIP(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") || "127.0.0.1";
}

export async function POST(req: NextRequest ) {
  try {

    const clientIP = getClientIP(req);

    const body = await req.json();

    const phoneNumber = body.phoneNumber;

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "phoneNumber required" },
        { status: 400 }
      );
    }

    const ts = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(16).toString("hex");

    // sort keys ascending
    const dataToSign = {
      phoneNumber: phoneNumber.toString(),
      clientIP,
      ts: ts.toString(),
      nonce,
    };

    const sortedKeys = Object.keys(dataToSign).sort();

    const payload = sortedKeys
      .map((key) => {
        const value =
          dataToSign[key as keyof typeof dataToSign];

        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join("&");

    const h = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(payload)
      .digest("hex");

    const requestBody = {
      data: {
        phoneNumber: String(phoneNumber),
        ts: String(ts),
        nonce: String(nonce),
        h: String(h),
      },
    };

    console.log(JSON.stringify(requestBody));

    const res = await fetch(
      "https://callback-api.tunamyr008.xyz/api-callback/match-prediction/request-register-tac/new8scoreai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const text = await res.text();

    console.log("TAC RESPONSE:", text);

    return NextResponse.json({
      raw: text,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}