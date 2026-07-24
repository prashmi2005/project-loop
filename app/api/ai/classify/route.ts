import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const classificationResponseSchema = z.object({
  sentiment: z.enum(["POS", "NEU", "NEG"]),
  sentimentScore: z.number().min(-1).max(1),
  themes: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    color: z.string().optional()
  })),
  featureArea: z.string(),
  rationale: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const { feedbackId } = await req.json();
    if (!feedbackId) {
      return NextResponse.json({ error: "Missing feedbackId" }, { status: 400 });
    }

    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }

    // Fetch existing themes for this workspace to pass as context
    const existingThemes = await prisma.theme.findMany({
      where: { workspaceId: feedback.workspaceId }
    });
    const themeContext = existingThemes.map((t: any) => `${t.name}: ${t.description || ""}`).join("\n");

    let classificationResult: any;

    // Call Anthropic Claude API if key exists
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const prompt = `
You are an expert customer feedback classifier. Classify the following customer feedback item.
Feedback: "${feedback.content}"

Existing workspace themes (reuse these if the feedback fits one of them, otherwise propose a new theme):
${themeContext || "None yet."}

Respond ONLY with a valid JSON object matching this schema:
{
  "sentiment": "POS" | "NEU" | "NEG",
  "sentimentScore": number (between -1.0 for very negative and 1.0 for very positive),
  "themes": [
    { "name": "Theme Name", "description": "Brief description", "color": "sky" | "emerald" | "amber" | "rose" | "indigo" | "violet" }
  ],
  "featureArea": "Short feature area label (e.g. Onboarding, Billing, Performance)"
}

Do not include any other text, markdown blocks, or explanation. Return raw JSON only.
`;

        const message = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        });

        const rawText = message.content[0].type === "text" ? message.content[0].text : "";
        // Strip code fences if Claude included them
        const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        classificationResult = classificationResponseSchema.parse(JSON.parse(cleaned));
      } catch (apiErr) {
        console.error("Claude classification error, falling back to mock:", apiErr);
        classificationResult = getMockClassification(feedback.content);
      }
    } else {
      classificationResult = getMockClassification(feedback.content);
    }

    // Apply classification to database in a transaction
    await prisma.$transaction(async (tx: any) => {
      // 1. Update feedback item sentiment and area
      await tx.feedback.update({
        where: { id: feedbackId },
        data: {
          sentiment: classificationResult.sentiment,
          sentimentScore: classificationResult.sentimentScore,
          customerLabel: classificationResult.featureArea,
          status: "REVIEWED"
        }
      });

      // 2. Link themes
      for (const t of classificationResult.themes) {
        // Find or create theme
        let theme = await tx.theme.findFirst({
          where: {
            name: t.name,
            workspaceId: feedback.workspaceId
          }
        });

        if (!theme) {
          theme = await tx.theme.create({
            data: {
              name: t.name,
              description: t.description || "",
              color: t.color || "sky",
              workspaceId: feedback.workspaceId
            }
          });
        }

        // Link FeedbackTheme
        await tx.feedbackTheme.upsert({
          where: {
            feedbackId_themeId: {
              feedbackId,
              themeId: theme.id
            }
          },
          create: {
            feedbackId,
            themeId: theme.id,
            confidence: 0.9
          },
          update: {}
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Critical classification function failure:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Simple rule-based mock classifier to act as a fallback
function getMockClassification(content: string) {
  const lowercase = content.toLowerCase();
  let sentiment: "POS" | "NEU" | "NEG" = "NEU";
  let score = 0.0;
  let themeName = "General Feedback";
  let themeDesc = "General user comments and feedback.";
  let color = "sky";
  let featureArea = "Core Service";

  if (lowercase.includes("error") || lowercase.includes("crash") || lowercase.includes("fail") || lowercase.includes("slow") || lowercase.includes("bad")) {
    sentiment = "NEG";
    score = -0.6;
    themeName = "Bugs & Reliability";
    themeDesc = "Issues related to application crashes, errors, or latency.";
    color = "rose";
    featureArea = "Stability";
  } else if (lowercase.includes("love") || lowercase.includes("great") || lowercase.includes("awesome") || lowercase.includes("fast") || lowercase.includes("beautiful")) {
    sentiment = "POS";
    score = 0.8;
    themeName = "User Satisfaction";
    themeDesc = "Positive comments and expressions of delight from users.";
    color = "emerald";
    featureArea = "UX";
  }

  if (lowercase.includes("billing") || lowercase.includes("price") || lowercase.includes("invoice")) {
    themeName = "Billing & Invoicing";
    themeDesc = "Payments, pricing models, and invoicing feedback.";
    color = "amber";
    featureArea = "Billing";
  }

  return {
    sentiment,
    sentimentScore: score,
    themes: [{ name: themeName, description: themeDesc, color }],
    featureArea
  };
}
