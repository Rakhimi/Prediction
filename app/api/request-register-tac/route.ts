import crypto from "crypto";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.PROVIDER_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const phoneNumber = body.phoneNumber;
    const uid = body.uid;

    if (!phoneNumber || !uid) {
      return NextResponse.json(
        {
          success: false,
          message: "phoneNumber and uid required",
        },
        { status: 400 }
      );
    }

    const ts = Math.floor(Date.now() / 1000);

    const nonce = crypto
      .randomBytes(16)
      .toString("hex");

    // SORT KEYS ASCENDING
    const payload = new URLSearchParams({
      nonce,
      ts: ts.toString(),
      uid: uid.toString(),
    }).toString();

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

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("REQUEST TAC ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}