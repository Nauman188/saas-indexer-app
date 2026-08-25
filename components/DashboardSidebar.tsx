"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Link2,
  History,
  CreditCard,
  Key,
  Settings,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/submit", label: "Submit Links", icon: Link2 },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/credits", label: "Buy Credits", icon: CreditCard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen flex flex-col border-r border-white/[0.06]" style={{ background: "rgba(8,8,18,0.95)" }}>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">
            Prime<span className="gradient-text">Indexer</span>
          </h1>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-10">Fast Link Indexing</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="text-xs text-gray-600 font-medium uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={"flex items-center gap-3 px-3 py-2.5 text-sm sidebar-item " + (isActive ? "sidebar-active font-medium" : "text-gray-400")}
            >
              <Icon size={17} className={isActive ? "text-indigo-400" : "text-gray-500"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="glass-card p-3 rounded-xl">
          <p className="text-xs text-gray-500">Need help?</p>
          <p className="text-xs text-indigo-400 mt-0.5 cursor-pointer hover:text-indigo-300">
            View Documentation →
          </p>
        </div>
      </div>
    </aside>
  );
}