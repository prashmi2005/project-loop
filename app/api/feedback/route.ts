import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const createFeedbackSchema = z.object({
  content: z.string().min(1, "Content is required"),
  channel: z.string().min(1, "Channel is required"),
  sourceRef: z.string().optional(),
  customerLabel: z.string().optional(),
});

// GET /api/feedback
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("pageSize") || "10");
  const skip = (page - 1) * limit;

  const search = searchParams.get("search") || "";
  const channel = searchParams.get("channel") || "";
  const sentiment = searchParams.get("sentiment") || "";
  const status = searchParams.get("status") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";

  // Base filters scoped to the workspace
  const where: any = {
    workspaceId: (session.user as any).workspaceId,
  };

  if (search) {
    where.content = { contains: search };
  }
  if (channel) {
    where.channel = channel;
  }
  if (sentiment) {
    where.sentiment = sentiment;
  }
  if (status) {
    where.status = status;
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo);
  }

  try {
    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          themes: {
            include: {
              theme: true,
            },
          },
        },
      }),
      prisma.feedback.count({ where }),
    ]);

    const items = feedbacks.map((f: any) => ({
      ...f,
      themes: f.themes.map((t: any) => t.theme),
    }));

    return NextResponse.json({
      items,
      meta: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/feedback
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RBAC Enforcement: Viewers cannot create feedback
  const role = (session.user as any).role;
  if (role === "VIEWER") {
    return NextResponse.json({ error: "Forbidden: Viewer role cannot create feedback." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = createFeedbackSchema.parse(body);

    const feedback = await prisma.feedback.create({
      data: {
        content: validated.content,
        channel: validated.channel,
        sourceRef: validated.sourceRef,
        customerLabel: validated.customerLabel,
        workspaceId: (session.user as any).workspaceId,
        status: "NEW",
      },
    });

    // Queue for auto-classification by returning a success message but trigger classification
    // In a fast-track build, we will classify immediately inline or mock it if Claude fails
    try {
      const baseUrl = req.nextUrl.origin;
      // Fire-and-forget background fetch for classification
      fetch(`${baseUrl}/api/ai/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackId: feedback.id }),
      }).catch((err: any) => console.error("Classification triggers fail", err));
    } catch (e) {
      // ignore background trigger error
    }

    return NextResponse.json(feedback, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
