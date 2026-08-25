"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/signin?registered=true");
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <div className="gsap-item text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <p className="text-sm text-gray-400 mt-1">
          Start indexing your links in minutes
        </p>
      </div>

      {error && (
        <div className="gsap-item bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="gsap-item">
          <label className="text-sm text-gray-300 mb-1 block">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="input-field"
            placeholder="John Doe"
          />
        </div>

        <div className="gsap-item">
          <label className="text-sm text-gray-300 mb-1 block">Business Name</label>
          <input
            type="text"
            name="businessName"
            required
            value={form.businessName}
            onChange={handleChange}
            className="input-field"
            placeholder="Your Company Inc."
          />
        </div>

        <div className="gsap-item">
          <label className="text-sm text-gray-300 mb-1 block">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="input-field"
            placeholder="you@example.com"
          />
        </div>

        <div className="gsap-item">
          <label className="text-sm text-gray-300 mb-1 block">Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="input-field"
            placeholder="At least 6 characters"
          />
        </div>

        <div className="gsap-item">
          <label className="text-sm text-gray-300 mb-1 block">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={6}
            value={form.confirmPassword}
            onChange={handleChange}
            className="input-field"
            placeholder="Re-enter password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="gsap-item btn-primary disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="gsap-item text-center text-sm text-gray-400 mt-6">
        Already have an account?{" "}
        <Link href="/signin" className="text-indigo-400 hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}