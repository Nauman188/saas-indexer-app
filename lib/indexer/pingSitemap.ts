// Notify search engines that the sitemap has been updated
// This encourages faster re-crawling of the discover page

export async function pingSitemap(): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  const pingUrls = [
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];

  for (const pingUrl of pingUrls) {
    try {
      await fetch(pingUrl, { method: "GET" });
    } catch (error) {
      console.error(`Failed to ping: ${pingUrl}`, error);
    }
  }
}