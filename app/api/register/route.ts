import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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

      username: body.username,
      password: body.password,
      confirmPassword: body.confirmPassword,

      countryCode: body.countryCode || 60,

      mobileno: body.mobileno,

      firstName: body.firstName,

      dateOfBirth:
        body.dateOfBirth || "2000-01-01",

      refCode: body.refCode || "",

      layer: 1,

      langCountry: "en-my",

      ts,
      nonce,
    };

    // IMPORTANT:
    // Provider docs inconsistent:
    // docs say mobileNo
    // payload example says mobileno
    // using mobileno based on example

    const h = generateSignature(requestData);

    const response = await fetch(
      "https://callback-api.butterusd001.xyz/api/match-prediction/register/new8scoreai",
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

    console.log("REGISTER STATUS:", response.status);
    console.log("REGISTER RAW RESPONSE:", text);

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
