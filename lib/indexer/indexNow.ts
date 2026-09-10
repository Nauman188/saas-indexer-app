interface IndexNowResult {
  success: boolean;
  statusCode?: number;
  error?: string;
}

export async function submitToIndexNow(url: string): Promise<IndexNowResult> {
  try {
    const indexNowKey = "5fb0c29e3b394eb3adea776e31c02c99";

    const response = await fetch(
      `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${indexNowKey}`,
      { method: "GET" },
    );

    console.log(`IndexNow response for ${url}: ${response.status}`);

    if (response.status === 200 || response.status === 202) {
      return { success: true, statusCode: response.status };
    }

    return { success: false, statusCode: response.status };
  } catch (error) {
    console.error("IndexNow submit error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
