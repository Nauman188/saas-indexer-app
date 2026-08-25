"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/signin" })}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-red-400 transition-colors border border-white/[0.06] hover:border-red-400/30"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <LogOut size={14} />
      <span className="hidden sm:inline">Sign Out</span>
    </button>
  );
}