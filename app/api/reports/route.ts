import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/reports
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceId = (session.user as any).workspaceId;

  try {
    const reports = await prisma.report.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      include: { generatedBy: true },
    });

    const items = reports.map((r: any) => ({
      ...r,
      contentJson: JSON.parse(r.contentJson),
    }));

    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
