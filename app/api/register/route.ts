import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Required fields
    const requiredFields = [
      "username",
      "password",
      "mobileno",
      "mobileTac",
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

    // Mobile validation
    if (
      body.mobileno.length < 9 ||
      body.mobileno.length > 10
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mobile number",
        },
        { status: 400 }
      );
    }

    const res = await fetch(
      "https://callback-api-staging.ez-stake.com/api/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currency: "MYR",

          username: body.username,
          password: body.password,
          confirmPassword: body.confirmPassword,

          countryCode: body.countryCode || 60,
          mobileno: body.mobileno,
          mobileTac: body.mobileTac,

          firstName: body.firstName,

          dateOfBirth:
            body.dateOfBirth || "2000-01-01",

          refCode: body.refCode || "",

          layer: 1,
          langCountry: "en-my",
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            data?.message || "Registration failed",
          data,
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