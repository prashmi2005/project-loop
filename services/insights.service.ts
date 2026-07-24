import type { FeedbackItem } from '@/types';

interface AskResult {
  answer: string;
  citations: FeedbackItem[];
}

export async function askLoop(question: string): Promise<AskResult> {
  const res = await fetch('/api/ai/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    throw new Error("Failed to get answer from Ask LOOP");
  }

  return res.json();
}
