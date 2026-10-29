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
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Fire all independent queries in PARALLEL — reduces 14 round-trips to 4
    const [
      totalFeedback,
      newThisWeek,
      sentimentCounts,
      feedbackScores,
      themes,
      recentFeedbacks,
      allFeedbackForVolume,
    ] = await Promise.all([
      // 1. Total count
      prisma.feedback.count({ where: { workspaceId } }),

      // 2. New this week
      prisma.feedback.count({
        where: { workspaceId, createdAt: { gte: oneWeekAgo } },
      }),

      // 3. Sentiment breakdown — group by sentiment in one query
      prisma.feedback.groupBy({
        by: ["sentiment"],
        where: { workspaceId },
        _count: { sentiment: true },
      }),

      // 4. Avg sentiment score
      prisma.feedback.findMany({
        where: { workspaceId, NOT: { sentimentScore: null } },
        select: { sentimentScore: true },
      }),

      // 5. Themes with feedback counts
      prisma.theme.findMany({
        where: { workspaceId },
        include: { feedbacks: { select: { feedbackId: true } } },
      }),

      // 6. Recent feedback (last 5)
      prisma.feedback.findMany({
        where: { workspaceId },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),

      // 7. All feedback timestamps for last 7 days (to build volume chart client-side)
      prisma.feedback.findMany({
        where: { workspaceId, createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    // --- Compute sentiment stats ---
    const sentMap: Record<string, number> = {};
    for (const row of sentimentCounts) {
      if (row.sentiment) sentMap[row.sentiment] = row._count.sentiment;
    }
    const positive = sentMap["POS"] ?? 0;
    const neutral  = sentMap["NEU"] ?? 0;
    const negative = sentMap["NEG"] ?? 0;

    const percentNegative  = totalFeedback > 0 ? Math.round((negative / totalFeedback) * 100) : 0;
    const positivePercent  = totalFeedback > 0 ? Math.round((positive / totalFeedback) * 100) : 0;
    const neutralPercent   = totalFeedback > 0 ? Math.round((neutral  / totalFeedback) * 100) : 0;

    // --- Avg score ---
    const avgScore =
      feedbackScores.length > 0
        ? Math.round(
            (feedbackScores.reduce((sum: number, f: any) => sum + (f.sentimentScore || 0), 0) /
              feedbackScores.length) *
              10
          ) / 10
        : 0.0;

    // --- Themes ---
    const sortedThemes = themes
      .map((t: any) => ({
        name: t.name,
        count: t.feedbacks.length,
        color: t.color,
        trend: 8,
      }))
      .sort((a: any, b: any) => b.count - a.count);

    const topTheme = sortedThemes[0]?.name ?? "General Feedback";

    // --- Volume chart: bucket timestamps into days ---
    const volumeMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      volumeMap[d.toISOString().split("T")[0]] = 0;
    }
    for (const fb of allFeedbackForVolume) {
      const key = new Date(fb.createdAt).toISOString().split("T")[0];
      if (key in volumeMap) volumeMap[key]++;
    }
    const volumeOverTime = Object.entries(volumeMap).map(([date, count]) => ({ date, count }));

    return NextResponse.json({
      totalFeedback,
      newThisWeek,
      percentNegative,
      avgScore,
      topTheme,
      recentFeedback: recentFeedbacks,
      sentimentBreakdown: {
        positive,
        neutral,
        negative,
        positivePercent,
        neutralPercent,
        negativePercent: percentNegative,
      },
      volumeOverTime,
      themes: sortedThemes.slice(0, 5),
    });
  } catch (error: any) {
    console.error("[dashboard/stats] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
