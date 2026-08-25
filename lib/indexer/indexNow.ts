// IndexNow protocol - instantly notifies Bing/Yandex about new/updated URLs
// Docs: https://www.indexnow.org/

interface IndexNowResult {
  success: boolean;
  statusCode?: number;
  error?: string;
}

export async function submitToIndexNow(url: string): Promise<IndexNowResult> {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname;

    // IndexNow endpoint accepts submissions for any host,
    // search engines verify ownership independently before crawling
    const endpoint = "https://api.indexnow.org/indexnow";

    const params = new URLSearchParams({
      url: url,
      key: process.env.INDEXNOW_API_KEY || "",
    });

    const response = await fetch(`${endpoint}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // IndexNow returns 200 (submitted) or 202 (accepted, pending validation)
    if (response.status === 200 || response.status === 202) {
      return { success: true, statusCode: response.status };
    }

    return {
      success: false,
      statusCode: response.status,
      error: `IndexNow returned status ${response.status}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Bulk submit multiple URLs (IndexNow also supports batch submission per host)
export async function submitBatchToIndexNow(
  urls: string[]
): Promise<{ url: string; result: IndexNowResult }[]> {
  const results = [];

  for (const url of urls) {
    const result = await submitToIndexNow(url);
    results.push({ url, result });

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return results;
}