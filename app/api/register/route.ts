import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const SECRET_KEY = process.env.PROVIDER_SECRET!;


export function generateSignature(
  data: Record<string, any>
) {
  const cleaned: Record<string, string> = {};

  // trim + REMOVE empty fields
  for (const key in data) {
    const value =
      typeof data[key] === "string"
        ? data[key].trim()
        : String(data[key]);

    // IMPORTANT:
    // skip empty string values
    if (value === "") continue;

    cleaned[key] = value;
  }

  // ksort
  const sortedKeys = Object.keys(cleaned).sort();

  const params = new URLSearchParams();

  for (const key of sortedKeys) {
    params.append(key, cleaned[key]);
  }

  const payload = params.toString();

  console.log("FINAL SIGN PAYLOAD:", payload);

  return crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex");
}



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Required fields
    const requiredFields = [
      "username",
      "password",
      "confirmPassword",
      "mobileno",
      "firstName",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            message: `${field} is required`,
          },
          { status: 400 }
        );
      }
    }

    // Password confirmation
    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        { status: 400 }
      );
    }

    // Username validation
    if (
      body.username.length < 6 ||
      body.username.length > 18
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username must be between 6 and 18 characters",
        },
        { status: 400 }
      );
    }

    // Password validation
    if (body.password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    const ts = Math.floor(Date.now() / 1000);

    const nonce = crypto
      .randomBytes(16)
      .toString("hex");


    const requestData = {
      currency: "MYR",
      username: String(body.username),
      password: String(body.password),
      confirmPassword: String(body.confirmPassword),
      countryCode: "60",
      mobileno: String(body.mobileno),
      firstName: String(body.firstName),
      dateOfBirth: String(
        body.dateOfBirth || "2000-01-01"
      ),
      refCode: String(body.refCode || ""),
      layer: "1",
      langCountry: "en-my",
      ts: String(ts),
      nonce: String(nonce),
    };


    // IMPORTANT:
    // Provider docs inconsistent:
    // docs say mobileNo
    // payload example says mobileno
    // using mobileno based on example

    const h = generateSignature(requestData);

    const response = await fetch(
      "https://callback-api.butterusd001.xyz/api-callback/match-prediction/register/new8scoreai",
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
          message:
            "Provider returned invalid JSON",
          raw: text,
        },
        { status: 500 }
      );
    }

    if (!data?.status) {
      return NextResponse.json(
        {
          success: false,
          message:
            data?.msg ||
            "Registration failed",
          providerResponse: data,
        },
        { status: 400 }
      );
    }

    await prisma.member.upsert({
      where: {
        providerUid: body.username,
      },
      update: {
        updatedAt: new Date(),
      },
      create: {
        providerUid: body.username,
        isMember: false,
        ftdAmount: "0.00",
        recentDepositAmount: "0.00",
        accessUntil: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ),
      },
    });

    return NextResponse.json({
      success: true,
      data,
    });
    
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}
