import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "accuracy.json");

  try {
    const json = await fs.readFile(filePath, "utf8");
    return NextResponse.json(JSON.parse(json));
  } catch (err) {
    return NextResponse.json({
      total: 0,
      correct: 0,
      accuracy: 0,
      matches: [],
      updatedAt: null,
      error: "No accuracy data found",
    });
  }
}