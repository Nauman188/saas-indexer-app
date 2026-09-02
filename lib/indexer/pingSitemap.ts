export async function pingSitemap(): Promise<void> {
  const sitemapUrl = "https://saas-indexer-app.vercel.app/sitemap.xml";

  const pingUrls = [
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];

  for (const pingUrl of pingUrls) {
    try {
      await fetch(pingUrl, { method: "GET" });
      console.log(`Pinged: ${pingUrl}`);
    } catch (error) {
      console.error(`Failed to ping: ${pingUrl}`, error);
    }
  }
}