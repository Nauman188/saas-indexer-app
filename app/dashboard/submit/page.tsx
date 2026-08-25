"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitLinksPage() {
  const router = useRouter();
  const [urls, setUrls] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Count non-empty lines to show how many credits will be used
  const urlCount = urls
    .split("\n")
    .map((u) => u.trim())
    .filter((u) => u.length > 0).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urlList.length === 0) {
      setError("Please enter at least one URL");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/links/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urlList }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSuccess(`${data.submitted} link(s) submitted for indexing!`);
      setUrls("");
      setLoading(false);

      // Refresh dashboard data after short delay
      setTimeout(() => {
        router.push("/dashboard/history");
      }, 1500);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Submit Links</h1>
        <p className="text-gray-400 text-sm mt-1">
          Paste one URL per line. Each URL costs 1 credit.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-3">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-card rounded-xl p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-300 mb-2 block">
            URLs (one per line)
          </label>
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={10}
            placeholder={`https://example.com/page-1\nhttps://example.com/page-2\nhttps://example.com/page-3`}
            className="input-field font-mono text-sm resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {urlCount} URL{urlCount !== 1 ? "s" : ""} ={" "}
            <span className="text-indigo-400 font-medium">
              {urlCount} credit{urlCount !== 1 ? "s" : ""}
            </span>
          </p>

          <button
            type="submit"
            disabled={loading || urlCount === 0}
            className="btn-primary w-auto px-6 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit for Indexing"}
          </button>
        </div>
      </form>
    </div>
  );
}