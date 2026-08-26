import { db } from "@/lib/db";

export const revalidate = 0;

export default async function DiscoverPage() {
  const links = await db.link.findMany({ where: { status: { in: ["pending", "processing", "indexed"] } }, orderBy: { createdAt: "desc" }, take: 500, select: { url: true, createdAt: true } });

  return (
    <div className="bg-[#0f0f1a] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">PrimeIndexer</h1>
        <p className="text-gray-400 text-sm mt-1">Live URL Discovery Feed</p>
        <div className="auth-card rounded-xl p-6 mt-8">
          <h2 className="text-lg font-semibold text-white mb-6">Recently Submitted Pages</h2>
          <ul className="divide-y divide-white/5">
            {links.map((link: any, i: number) => (
              <li key={i} className="py-3">
                <a href={link.url} rel="noopener" className="text-indigo-400 break-all text-sm">{link.url}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}