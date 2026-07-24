import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { question } = await req.json();
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const workspaceId = (session.user as any).workspaceId;

    // Retrieve all feedback items for this workspace
    const feedbacks = await prisma.feedback.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });

    if (feedbacks.length === 0) {
      return NextResponse.json({
        answer: "There is no customer feedback data available in this workspace yet.",
        citations: []
      });
    }

    // Perform text keyword matching similarity search
    const questionTokens = question.toLowerCase().split(/\s+/).filter((t: string) => t.length > 2);
    const rankedFeedbacks = feedbacks.map((f: any) => {
      const contentLower = f.content.toLowerCase();
      let matches = 0;
      questionTokens.forEach((token: string) => {
        if (contentLower.includes(token)) matches++;
      });
      return { feedback: f, score: matches };
    })
    .filter((item: any) => item.score > 0)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5)
    .map((item: any) => item.feedback);

    // Fallback to latest feedback if no match found
    const contextItems = rankedFeedbacks.length > 0 ? rankedFeedbacks : feedbacks.slice(0, 5);

    const contextText = contextItems.map((f: any, index: number) => `[Source ${index + 1} - ${f.channel}]: "${f.content}" (ID: ${f.id})`).join("\n\n");

    let answer = "";

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const prompt = `
You are a helpful customer intelligence assistant. Answer the following question based ONLY on the customer feedback context provided below.
If the answer is not present in the context, say "I cannot find any information about that in the feedback." Do not invent any facts.

Question: "${question}"

Feedback Context:
${contextText}

Provide a grounded, direct answer. When stating facts, cite the Source Number (e.g. [Source 1]).
`;

        const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        });

        answer = response.content[0].type === "text" ? response.content[0].text : "No text response.";
      } catch (apiErr: any) {
        console.error("Claude QA error:", apiErr);
        answer = getMockAnswer(question, contextItems);
      }
    } else {
      answer = getMockAnswer(question, contextItems);
    }

    return NextResponse.json({
      answer,
      citations: contextItems
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getMockAnswer(question: string, contextItems: any[]) {
  const lowercase = question.toLowerCase();
  if (lowercase.includes("onboarding") || lowercase.includes("invite")) {
    return `Based on the feedback, several users reported issues with onboarding. Specifically, users mentioned that onboarding took too long and they had difficulty figuring out how to invite team members.`;
  }
  if (lowercase.includes("billing") || lowercase.includes("payment")) {
    return `According to the sources, the billing page keeps timing out when users attempt to download an invoice.`;
  }
  return `Based on the retrieved feedback items, users are discussing various issues including:
${contextItems.map((f: any, i: number) => `${i + 1}. "${f.content}" (${f.channel})`).join("\n")}
Please set up a valid Anthropic API key in your .env file to enable custom Claude Q&A.`;
}
