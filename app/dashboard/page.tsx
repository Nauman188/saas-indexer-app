import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Link2, TrendingUp, CheckCircle, XCircle, ArrowRight, Zap } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const user = await db.user.findUnique({ where: { id: userId } });

  const totalLinks = await db.link.count({ where: { userId } }).catch(() => 0);
  const indexedLinks = await db.link.count({ where: { userId, status: "indexed" } }).catch(() => 0);
  const pendingLinks = await db.link.count({ where: { userId, status: "pending" } }).catch(() => 0);
  const failedLinks = await db.link.count({ where: { userId, status: "failed" } }).catch(() => 0);

  const recentLinks = await db.link.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  }).catch(() => []);

  const successRate = totalLinks > 0 ? Math.round((indexedLinks / totalLinks) * 100) : 0;

  const stats = [
    { label: "Available Credits", value: user?.credits ?? 0, icon: Zap, color: "from-indigo-500 to-purple-600", textColor: "text-indigo-400" },
    { label: "Total Submitted", value: totalLinks, icon: Link2, color: "from-blue-500 to-cyan-600", textColor: "text-blue-400" },
    { label: "Successfully Indexed", value: indexedLinks, icon: CheckCircle, color: "from-green-500 to-emerald-600", textColor: "text-green-400" },
    { label: "Failed", value: failedLinks, icon: XCircle, color: "from-red-500 to-rose-600", textColor: "text-red-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Track your indexing activity</p>
        </div>
        <Link href="/dashboard/submit" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", boxShadow: "0 4px 15px rgba(79,70,229,0.3)" }}>
          <Zap size={15} />
          Submit Links
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <div className={"w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center " + stat.color}>
                  <Icon size={16} className="text-white" />
                </div>
              </div>
              <p className={"text-3xl font-bold " + stat.textColor}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Success Rate + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Success Rate */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-indigo-400" />
            <p className="text-white font-medium text-sm">Success Rate</p>
          </div>
          <p className="text-4xl font-bold text-white">{successRate}<span className="text-xl text-gray-500">%</span></p>
          <div className="mt-4 bg-white/5 rounded-full h-2">
            <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all" style={{ width: `${successRate}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">{indexedLinks} of {totalLinks} links indexed</p>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-5 lg:col-span-2">
          <p className="text-white font-medium text-sm mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/submit" className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] hover:border-indigo-500/30 transition-colors group" style={{ background: "rgba(79,70,229,0.05)" }}>
              <div>
                <p className="text-white text-sm font-medium">Submit Links</p>
                <p className="text-gray-500 text-xs mt-0.5">Add new URLs</p>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
            </Link>

            <Link href="/dashboard/credits" className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] hover:border-indigo-500/30 transition-colors group" style={{ background: "rgba(79,70,229,0.05)" }}>
              <div>
                <p className="text-white text-sm font-medium">Buy Credits</p>
                <p className="text-gray-500 text-xs mt-0.5">Top up balance</p>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
            </Link>

            <Link href="/dashboard/history" className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] hover:border-indigo-500/30 transition-colors group" style={{ background: "rgba(79,70,229,0.05)" }}>
              <div>
                <p className="text-white text-sm font-medium">View History</p>
                <p className="text-gray-500 text-xs mt-0.5">Check status</p>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
            </Link>

            <Link href="/dashboard/api-keys" className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] hover:border-indigo-500/30 transition-colors group" style={{ background: "rgba(79,70,229,0.05)" }}>
              <div>
                <p className="text-white text-sm font-medium">API Access</p>
                <p className="text-gray-500 text-xs mt-0.5">Get API key</p>
              </div>
              <ArrowRight size={16} className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Links */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white font-medium text-sm">Recent Submissions</p>
          <Link href="/dashboard/history" className="text-xs text-indigo-400 hover:text-indigo-300">
            View all →
          </Link>
        </div>

        {recentLinks.length === 0 ? (
          <div className="text-center py-8">
            <Link2 size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No links submitted yet</p>
            <Link href="/dashboard/submit" className="text-indigo-400 text-sm hover:text-indigo-300 mt-1 inline-block">
              Submit your first link →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentLinks.map((link) => {
              const statusClass = link.status === "indexed" ? "badge-indexed" : link.status === "failed" ? "badge-failed" : link.status === "processing" ? "badge-processing" : "badge-pending";
              return (
                <div key={link.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-indigo-400 truncate max-w-md transition-colors">
                    {link.url}
                  </a>
                  <span className={"text-xs px-2.5 py-1 rounded-full " + statusClass}>
                    {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}