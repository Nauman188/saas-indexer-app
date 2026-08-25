"use client";

import { useState, useEffect } from "react";

export default function ApiKeysPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");

  const fetchApiKey = async () => {
    try {
      const res = await fetch("/api/user/api-key");
      const data = await res.json();
      setApiKey(data.apiKey || null);
    } catch {
      console.error("Failed to fetch API key");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKey();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage("");

    try {
      const res = await fetch("/api/user/api-key", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setApiKey(data.apiKey);
        setMessage("New API key generated successfully");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">API Keys</h1>
        <p className="text-gray-400 text-sm mt-1">
          Use your API key to submit links programmatically
        </p>
      </div>

      {message && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm rounded-lg px-4 py-3">
          {message}
        </div>
      )}

      <div className="auth-card rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Your API Key</h2>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : apiKey ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={apiKey}
                readOnly
                className="input-field font-mono text-sm"
              />
              <button
                onClick={handleCopy}
                className="whitespace-nowrap px-4 py-2 rounded-lg border border-white/10 text-sm text-white hover:border-indigo-500/50 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Keep this key secret. Do not share it publicly.
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            No API key generated yet. Click below to generate one.
          </p>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary w-auto px-6 disabled:opacity-50"
        >
          {generating ? "Generating..." : apiKey ? "Regenerate Key" : "Generate API Key"}
        </button>

        {apiKey && (
          <p className="text-xs text-yellow-500/70">
            ⚠️ Regenerating will invalidate your current key immediately.
          </p>
        )}
      </div>

      <div className="auth-card rounded-xl p-6 space-y-3">
        <h2 className="text-white font-semibold">How to use</h2>
        <p className="text-gray-400 text-sm">Submit URLs via API:</p>
        <pre className="bg-black/30 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto">
{`POST https://yourdomain.com/api/public/v1/submit
Content-Type: application/json
X-API-Key: your-api-key

{
  "urls": [
    "https://example.com/page-1",
    "https://example.com/page-2"
  ]
}`}
        </pre>
      </div>
    </div>
  );
}