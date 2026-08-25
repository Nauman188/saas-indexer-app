import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// GET - fetch existing API key
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { apiKey: true },
    });

    return NextResponse.json({ apiKey: user?.apiKey || null });
  } catch (error) {
    console.error("Fetch API key error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST - generate new API key
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const newApiKey = `pi_${uuidv4().replace(/-/g, "")}`;

    await db.user.update({
      where: { id: userId },
      data: { apiKey: newApiKey },
    });

    return NextResponse.json({ apiKey: newApiKey });
  } catch (error) {
    console.error("Generate API key error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}