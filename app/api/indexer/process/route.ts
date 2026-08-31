import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { submitToIndexNow } from "@/lib/indexer/indexNow";
import { submitToGoogle } from "@/lib/indexer/googleIndexing";
import { pingSitemap } from "@/lib/indexer/pingSitemap";
import { pingFeeds } from "@/lib/indexer/pingFeeds";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const pendingLinks = await db.link.findMany({
      where: { userId, status: "pending" },
      take: 20,
    });

    if (pendingLinks.length === 0) {
      return NextResponse.json({
        message: "No pending links to process",
        processed: 0,
      });
    }

    let indexedCount = 0;
    let failedCount = 0;

    for (const link of pendingLinks) {
      await db.link.update({
        where: { id: link.id },
        data: { status: "processing" },
      });

      // 1. Submit to Google Indexing API
      const googleResult = await submitToGoogle(link.url);

      // 2. Submit to IndexNow (Bing/Yandex)
      const indexNowResult = await submitToIndexNow(link.url);

      // If either succeeds, mark as indexed
      if (googleResult.success || indexNowResult.success) {
        await db.link.update({
          where: { id: link.id },
          data: { status: "indexed", indexedAt: new Date() },
        });
        indexedCount++;
      } else {
        await db.link.update({
          where: { id: link.id },
          data: { status: "failed" },
        });
        failedCount++;
      }
    }

    // 3. Ping sitemap
    await pingSitemap();

    // 4. Ping RSS feeds
    await pingFeeds();

    return NextResponse.json({
      message: "Processing complete",
      processed: pendingLinks.length,
      indexed: indexedCount,
      failed: failedCount,
    });
  } catch (error) {
    console.error("Indexer process error:", error);
    return NextResponse.json(
      { error: "Something went wrong while processing links" },
      { status: 500 }
    );
  }
}