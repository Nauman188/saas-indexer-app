import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import DashboardSidebar from "@/components/DashboardSidebar";
import SignOutButton from "@/components/SignOutButton";
import { Coins, Bell } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/signin");
  }

  const user = await db.user.findUnique({
    where: { id: (session.user as any).id },
    select: { name: true, email: true, businessName: true, credits: true },
  });

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="flex min-h-screen" style={{ background: "#080812" }}>
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] sticky top-0 z-10" style={{ background: "rgba(8,8,18,0.95)", backdropFilter: "blur(20px)" }}>
          <div>
            <p className="text-xs text-gray-500">Welcome back 👋</p>
            <p className="text-white font-semibold text-sm mt-0.5">{user?.name || "User"}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Credits Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-500/30 glow-indigo" style={{ background: "rgba(79,70,229,0.1)" }}>
              <Coins size={15} className="text-indigo-400" />
              <div>
                <p className="text-xs text-gray-400 leading-none">Credits</p>
                <p className="text-indigo-400 font-bold text-sm leading-none mt-0.5">
                  {user?.credits ?? 0}
                </p>
              </div>
            </div>

            {/* Notification Bell */}
            <button className="w-9 h-9 rounded-xl border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors" style={{ background: "rgba(255,255,255,0.03)" }}>
              <Bell size={15} />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>

            <SignOutButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}