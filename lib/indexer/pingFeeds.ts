export async function pingFeeds(): Promise<void> {
  const sitemapUrl = "https://saas-indexer-app.vercel.app/sitemap.xml";
  const feedUrl = "https://saas-indexer-app.vercel.app/feed.xml";

  const pingEndpoints = [
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://rpc.pingomatic.com/`,
  ];

  for (const endpoint of pingEndpoints) {
    try {
      await fetch(endpoint, { method: "GET" });
      console.log(`Pinged: ${endpoint}`);
    } catch (error) {
      console.error(`Failed to ping: ${endpoint}`);
    }
  }

  try {
    await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(feedUrl)}`,
    );
    console.log("Pinged Google with feed URL");
  } catch (error) {
    console.error("Failed to ping Google");
  }
}
