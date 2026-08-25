import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const { urls } = await req.json();

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least one URL" },
        { status: 400 }
      );
    }

    // Basic URL validation - filter out invalid ones
    const validUrls = urls.filter((url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: "No valid URLs found. Make sure URLs start with http:// or https://" },
        { status: 400 }
      );
    }

    // Check user has enough credits
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.credits < validUrls.length) {
      return NextResponse.json(
        {
          error: `Not enough credits. You need ${validUrls.length} credits but only have ${user.credits}.`,
        },
        { status: 400 }
      );
    }

    // Create links + deduct credits in a single transaction (atomic - avoids race conditions)
    await db.$transaction([
      db.link.createMany({
        data: validUrls.map((url: string) => ({
          url,
          userId,
          status: "pending",
        })),
      }),
      db.user.update({
        where: { id: userId },
        data: { credits: { decrement: validUrls.length } },
      }),
    ]);

    // TODO: trigger background indexing job here (IndexNow / sitemap ping)

    return NextResponse.json({
      message: "Links submitted successfully",
      submitted: validUrls.length,
    });
  } catch (error) {
    console.error("Link submit error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}