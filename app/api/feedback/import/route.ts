import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const importSchema = z.object({
  items: z.array(
    z.object({
      content: z.string().min(1),
      channel: z.string().min(1),
      customerLabel: z.string().optional(),
      sourceRef: z.string().optional(),
    })
  ),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role === "VIEWER") {
    return NextResponse.json({ error: "Forbidden: Viewer cannot import data." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validated = importSchema.parse(body);
    const workspaceId = (session.user as any).workspaceId;

    let successCount = 0;
    let failCount = 0;

    // Create the items
    const createdItems = [];
    for (const item of validated.items) {
      try {
        const created = await prisma.feedback.create({
          data: {
            content: item.content,
            channel: item.channel,
            customerLabel: item.customerLabel || null,
            sourceRef: item.sourceRef || null,
            workspaceId,
            status: "NEW",
          },
        });
        createdItems.push(created);
        successCount++;
      } catch (err) {
        failCount++;
      }
    }

    // Trigger classification for imported items asynchronously
    try {
      const baseUrl = req.nextUrl.origin;
      for (const item of createdItems) {
        fetch(`${baseUrl}/api/ai/classify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feedbackId: item.id }),
        }).catch((err: any) => console.error("Batch classification fail", err));
      }
    } catch (e) {
      // ignore
    }

    return NextResponse.json({
      successCount,
      failCount,
      total: validated.items.length,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
