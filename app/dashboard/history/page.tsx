"use client";

import { useState, useEffect } from "react";

interface Link {
  id: string;
  url: string;
  status: string;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    indexed: "bg-green-500/10 text-green-400 border-green-500/30",
    failed: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  const style = styles[status] || styles.pending;
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={"text-xs font-medium px-2.5 py-1 rounded-full border " + style}>
      {label}
    </span>
  );
}

export default function HistoryPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links/list");
      const data = await res.json();
      setLinks(data.links || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleProcess = async () => {
    setProcessing(true);
    setMessage("");

    try {
      const res = await fetch("/api/indexer/process", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setMessage(
          `Processed ${data.processed} link(s) — ${data.indexed} indexed, ${data.failed} failed.`
        );
      }

      await fetchLinks();
    } catch (err) {
      setMessage("Network error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const pendingCount = links.filter((l) => l.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Submission History</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track the indexing status of your submitted links
          </p>
        </div>

        {pendingCount > 0 && (
          <button
            onClick={handleProcess}
            disabled={processing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {processing
              ? "Processing..."
              : `Process ${pendingCount} Pending Link${pendingCount !== 1 ? "s" : ""}`}
          </button>
        )}
      </div>

      {message && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm rounded-lg px-4 py-3">
          {message}
        </div>
      )}

      <div className="auth-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : links.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No links submitted yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                <th className="px-5 py-3 font-medium">URL</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-5 py-3 text-white max-w-md truncate">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">
                      {link.url}
                    </a>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={link.status} />
                  </td>
                  <td className="px-5 py-3 text-gray-400">
                    {new Date(link.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}