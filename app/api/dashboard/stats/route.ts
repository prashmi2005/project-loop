import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceId = (session.user as any).workspaceId;

  try {
    const totalFeedback = await prisma.feedback.count({
      where: { workspaceId },
    });

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newThisWeek = await prisma.feedback.count({
      where: {
        workspaceId,
        createdAt: { gte: oneWeekAgo },
      },
    });

    const negative = await prisma.feedback.count({
      where: {
        workspaceId,
        sentiment: "NEG",
      },
    });

    const positive = await prisma.feedback.count({
      where: {
        workspaceId,
        sentiment: "POS",
      },
    });

    const neutral = await prisma.feedback.count({
      where: {
        workspaceId,
        sentiment: "NEU",
      },
    });

    const percentNegative = totalFeedback > 0 ? Math.round((negative / totalFeedback) * 100) : 0;
    const positivePercent = totalFeedback > 0 ? Math.round((positive / totalFeedback) * 100) : 0;
    const neutralPercent = totalFeedback > 0 ? Math.round((neutral / totalFeedback) * 100) : 0;

    // Get average sentiment score
    const feedbacks = await prisma.feedback.findMany({
      where: { workspaceId, NOT: { sentimentScore: null } },
      select: { sentimentScore: true },
    });
    const avgScore = feedbacks.length > 0
      ? Math.round((feedbacks.reduce((sum: number, f: any) => sum + (f.sentimentScore || 0), 0) / feedbacks.length) * 10) / 10
      : 0.0;

    // Top theme
    const themes = await prisma.theme.findMany({
      where: { workspaceId },
      include: {
        feedbacks: true,
      },
    });

    const sortedThemes = themes.map((t: any) => ({
      name: t.name,
      count: t.feedbacks.length,
      trend: 8,
    }))
    .sort((a: any, b: any) => b.count - a.count);

    const topTheme = sortedThemes[0] || { name: "General Feedback", count: 0, trend: 0 };

    // Recent feedback
    const recentFeedbacks = await prisma.feedback.findMany({
      where: { workspaceId },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    // Mock volume data over 7 days based on actual DB records
    const volumeData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const count = await prisma.feedback.count({
        where: {
          workspaceId,
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
      });

      volumeData.push({
        date: startOfDay.toISOString().split("T")[0],
        count,
      });
    }

    return NextResponse.json({
      totalFeedback,
      newThisWeek,
      percentNegative,
      avgScore,
      topTheme: topTheme.name,
      recentFeedback: recentFeedbacks,
      sentimentBreakdown: {
        positive,
        neutral,
        negative,
        positivePercent,
        neutralPercent,
        negativePercent: percentNegative,
      },
      volumeOverTime: volumeData,
      themes: sortedThemes.slice(0, 5),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
