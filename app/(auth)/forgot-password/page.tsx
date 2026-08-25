"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import AuthCard from "@/components/AuthCard";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const checkRef = useRef<SVGPathElement>(null);

  const animateCheck = () => {
    if (!checkRef.current) return;
    const length = checkRef.current.getTotalLength();
    gsap.set(checkRef.current, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(checkRef.current, {
      strokeDashoffset: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.1,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSent(true);
      setLoading(false);
      setTimeout(animateCheck, 50);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center text-center gsap-item">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="none" stroke="#4F46E5" strokeWidth="2" />
            <path
              ref={checkRef}
              d="M18 33 L28 43 L46 22"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="text-xl font-bold text-white mt-4">Check your email</h2>
          <p className="text-sm text-gray-400 mt-2">
            If an account exists for <span className="text-white">{email}</span>,
            we&apos;ve sent a password reset link.
          </p>
          <Link
            href="/signin"
            className="text-indigo-400 hover:text-indigo-300 text-sm mt-6"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="gsap-item text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
        <p className="text-sm text-gray-400 mt-1">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {error && (
        <div className="gsap-item bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="gsap-item">
          <label className="text-sm text-gray-300 mb-1 block">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="gsap-item btn-primary disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="gsap-item text-center text-sm text-gray-400 mt-6">
        Remembered your password?{" "}
        <Link href="/signin" className="text-indigo-400 hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}