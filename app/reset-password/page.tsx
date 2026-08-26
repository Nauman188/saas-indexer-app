"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";

// Humne purane function ka naam change kar ke 'ResetPasswordForm' rakh diya
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/signin?reset=success");
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <div className="gsap-item text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Set New Password</h1>
        <p className="text-sm text-gray-400 mt-1">
          Choose a strong new password for your account
        </p>
      </div>

      {error && (
        <div className="gsap-item bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="gsap-item">
          <label className="text-sm text-gray-300 mb-1 block">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="At least 6 characters"
          />
        </div>

        <div className="gsap-item">
          <label className="text-sm text-gray-300 mb-1 block">Confirm Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            placeholder="Re-enter password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="gsap-item btn-primary disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="gsap-item text-center text-sm text-gray-400 mt-6">
        <Link href="/signin" className="text-indigo-400 hover:text-indigo-300">
          Back to Sign In
        </Link>
      </p>
    </AuthCard>
  );
}

// Naya main function jo Suspense use karta hai
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-20">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}