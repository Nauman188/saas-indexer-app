import { db } from "@/lib/db";

export async function GET() {
  const links = await db.link.findMany({
    where: { status: { in: ["pending", "processing", "indexed"] } },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { url: true, createdAt: true },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://saas-indexer-app.vercel.app";

  const rssItems = links.map((link) => {
    const pubDate = new Date(link.createdAt).toUTCString();
    const escapedUrl = link.url
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return `
    <item>
      <title>${escapedUrl}</title>
      <link>${escapedUrl}</link>
      <guid isPermaLink="true">${escapedUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>URL submitted for indexing on ${pubDate}</description>
    </item>`;
  }).join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PrimeIndexer - Recently Submitted URLs</title>
    <link>${baseUrl}</link>
    <description>Latest URLs submitted for fast search engine indexing</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}