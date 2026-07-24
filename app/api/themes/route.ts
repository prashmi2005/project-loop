import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/themes
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceId = (session.user as any).workspaceId;

  try {
    const themes = await prisma.theme.findMany({
      where: { workspaceId },
      include: {
        feedbacks: {
          include: {
            feedback: true,
          },
        },
      },
    });

    const items = themes.map((t: any) => {
      const count = t.feedbacks.length;
      return {
        id: t.id,
        name: t.name,
        description: t.description || "",
        color: t.color || "sky",
        workspaceId: t.workspaceId,
        count,
        trend: Math.floor(Math.random() * 20) - 10, // Mock trend
        createdAt: t.feedbacks[0]?.feedback.createdAt || new Date().toISOString(),
      };
    });

    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
