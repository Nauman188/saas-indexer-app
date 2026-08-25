import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // Get API key from header
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required. Pass it as X-API-Key header." }, { status: 401 });
    }

    // Find user by API key
    const user = await db.user.findUnique({
      where: { apiKey },
      select: { id: true, credits: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const { urls } = await req.json();

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "Please provide at least one URL" }, { status: 400 });
    }

    // Validate URLs
    const validUrls = urls.filter((url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return NextResponse.json({ error: "No valid URLs found" }, { status: 400 });
    }

    // Check credits
    if (user.credits < validUrls.length) {
      return NextResponse.json({
        error: `Not enough credits. Need ${validUrls.length}, have ${user.credits}.`,
      }, { status: 400 });
    }

    // Save links + deduct credits
    await db.$transaction([
      db.link.createMany({
        data: validUrls.map((url: string) => ({
          url,
          userId: user.id,
          status: "pending",
        })),
      }),
      db.user.update({
        where: { id: user.id },
        data: { credits: { decrement: validUrls.length } },
      }),
    ]);

    return NextResponse.json({
      message: "URLs submitted successfully",
      submitted: validUrls.length,
      remaining_credits: user.credits - validUrls.length,
    });
  } catch (error) {
    console.error("Public API submit error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}