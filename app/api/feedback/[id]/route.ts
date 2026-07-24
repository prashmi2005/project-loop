import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const updateFeedbackSchema = z.object({
  status: z.enum(["NEW", "REVIEWED", "ACTIONED"]).optional(),
  sentiment: z.enum(["POS", "NEU", "NEG"]).optional(),
  customerLabel: z.string().optional(),
});

// PATCH /api/feedback/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RBAC Enforcement: Viewers cannot manage feedback status
  const role = (session.user as any).role;
  if (role === "VIEWER") {
    return NextResponse.json({ error: "Forbidden: Viewers are read-only." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = updateFeedbackSchema.parse(body);

    const feedback = await prisma.feedback.findUnique({
      where: { id: params.id },
    });

    if (!feedback) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }

    // Workspace Isolation enforcement
    if (feedback.workspaceId !== (session.user as any).workspaceId) {
      return NextResponse.json({ error: "Forbidden: Workspace mismatch." }, { status: 403 });
    }

    const updated = await prisma.feedback.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
