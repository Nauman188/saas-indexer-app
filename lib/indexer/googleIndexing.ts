import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/indexing"],
});

interface GoogleIndexingResult {
  success: boolean;
  statusCode?: number;
  error?: string;
}

export async function submitToGoogle(url: string): Promise<GoogleIndexingResult> {
  try {
    const authClient = await auth.getClient();

    const response = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await authClient.getAccessToken().then((r) => r.token)}`,
        },
        body: JSON.stringify({
          url: url,
          type: "URL_UPDATED",
        }),
      }
    );

    if (response.ok) {
      return { success: true, statusCode: response.status };
    }

    const errorData = await response.json();
    console.error("Google Indexing API error:", errorData);

    return {
      success: false,
      statusCode: response.status,
      error: errorData?.error?.message || "Unknown error",
    };
  } catch (error) {
    console.error("Google Indexing submit error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}