import crypto from "crypto";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.PROVIDER_SECRET!;

export async function POST(req: Request) {
  try {
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

    const res = await fetch(
      "https://callback-api-staging.ez-stake.com/api-callback/match-prediction/request-register-tac/new8scoreai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            phoneNumber,
            ts,
            nonce,
            h,
          },
        }),
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