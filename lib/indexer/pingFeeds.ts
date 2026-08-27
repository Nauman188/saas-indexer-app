// Ping search engines and RSS aggregators when feed is updated

export async function pingFeeds(): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://saas-indexer-app.vercel.app";
  const feedUrl = `${baseUrl}/feed.xml`;
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  const pingEndpoints = [
    // Bing sitemap ping
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    // RSS aggregators
    `https://rpc.pingomatic.com/`,
    `https://ping.blogs.yandex.ru/RPC2`,
  ];

  for (const endpoint of pingEndpoints) {
    try {
      await fetch(endpoint, { method: "GET" });
      console.log(`Pinged: ${endpoint}`);
    } catch (error) {
      console.error(`Failed to ping: ${endpoint}`);
    }
  }

  // Ping Google with feed URL
  try {
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(feedUrl)}`);
    console.log("Pinged Google with feed URL");
  } catch (error) {
    console.error("Failed to ping Google");
  }
}