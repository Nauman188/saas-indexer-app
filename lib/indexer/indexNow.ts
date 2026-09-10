interface IndexNowResult {
  success: boolean;
  statusCode?: number;
  error?: string;
}

export async function submitToIndexNow(url: string): Promise<IndexNowResult> {
  try {
    const indexNowKey = "5fb0c29e3b394eb3adea776e31c02c99";

    // Method 1: IndexNow API (Bing + Yandex)
    const indexNowResponse = await fetch(
      `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${indexNowKey}`,
      { method: "GET" },
    );

    console.log(`IndexNow response for ${url}: ${indexNowResponse.status}`);

    // Method 2: Bing Submission API (direct)
    const bingResponse = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl?apikey=${process.env.BING_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          siteUrl: "https://saas-indexer-app.vercel.app",
          urlList: [url],
        }),
      },
    );

    console.log(`Bing API response for ${url}: ${bingResponse.status}`);

    if (
      indexNowResponse.status === 200 ||
      indexNowResponse.status === 202 ||
      bingResponse.status === 200
    ) {
      return { success: true, statusCode: indexNowResponse.status };
    }

    return {
      success: false,
      statusCode: indexNowResponse.status,
      error: `IndexNow: ${indexNowResponse.status}, Bing: ${bingResponse.status}`,
    };
  } catch (error) {
    console.error("IndexNow/Bing submit error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
