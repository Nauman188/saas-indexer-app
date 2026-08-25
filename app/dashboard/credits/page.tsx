"use client";

import { useState } from "react";
import { creditPackages } from "@/lib/pricing";

export default function CreditsPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleBuy = async (packageId: string) => {
    setError("");
    setLoadingId(packageId);

    try {
      const res = await fetch("/api/credits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoadingId(null);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError("Network error. Please try again.");
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Buy Credits</h1>
        <p className="text-gray-400 text-sm mt-1">
          One-time purchase. Credits never expire.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {creditPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={
              "auth-card rounded-xl p-6 relative " +
              (pkg.popular ? "border-indigo-500/50" : "")
            }
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-6 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            <p className="text-gray-400 text-sm">Credit Package</p>
            <p className="text-3xl font-bold text-white mt-2">
              {pkg.credits} <span className="text-base text-gray-400">credits</span>
            </p>

            <p className="text-2xl font-bold text-indigo-400 mt-4">
              ${pkg.price}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              ${(pkg.price / pkg.credits).toFixed(3)} per credit
            </p>

            <button
              onClick={() => handleBuy(pkg.id)}
              disabled={loadingId === pkg.id}
              className="btn-primary mt-6 disabled:opacity-50"
            >
              {loadingId === pkg.id ? "Redirecting..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}