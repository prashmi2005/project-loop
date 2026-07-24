import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const includeFeedback = searchParams.get("feedback") === "true";

  try {
    const theme = await prisma.theme.findUnique({
      where: { id: params.id },
      include: {
        feedbacks: {
          include: {
            feedback: true,
          },
        },
      },
    });

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    if (theme.workspaceId !== (session.user as any).workspaceId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (includeFeedback) {
      const feedbacks = theme.feedbacks.map((f: any) => f.feedback);
      return NextResponse.json(feedbacks);
    }

    return NextResponse.json({
      id: theme.id,
      name: theme.name,
      description: theme.description || "",
      color: theme.color || "sky",
      workspaceId: theme.workspaceId,
      count: theme.feedbacks.length,
      trend: 5,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
