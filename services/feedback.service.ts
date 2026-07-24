import type {
  FeedbackFilters,
  FeedbackItem,
  FeedbackStatus,
  PaginationMeta,
} from '@/types';

export async function getFeedback(
  filters: FeedbackFilters = {},
  page = 1,
  pageSize = 10
): Promise<{ data: FeedbackItem[]; meta: PaginationMeta }> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (filters.search) query.append("search", filters.search);
  if (filters.channel) query.append("channel", filters.channel);
  if (filters.sentiment) query.append("sentiment", filters.sentiment);
  if (filters.status) query.append("status", filters.status);
  if (filters.themeId) query.append("themeId", filters.themeId);
  if (filters.dateFrom) query.append("dateFrom", filters.dateFrom);
  if (filters.dateTo) query.append("dateTo", filters.dateTo);

  const res = await fetch(`/api/feedback?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to load feedback");

  const json = await res.json();
  return {
    data: json.items,
    meta: json.meta,
  };
}

export async function getFeedbackById(id: string): Promise<FeedbackItem | null> {
  const res = await fetch(`/api/feedback/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createFeedback(
  data: Pick<FeedbackItem, 'content' | 'channel' | 'customerLabel' | 'sourceRef'>
): Promise<FeedbackItem> {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorJson = await res.json();
    throw new Error(errorJson.error || "Failed to create feedback");
  }
  return res.json();
}

export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus
): Promise<FeedbackItem | null> {
  const res = await fetch(`/api/feedback/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) return null;
  return res.json();
}

export async function reclassifyFeedback(id: string): Promise<FeedbackItem | null> {
  const res = await fetch('/api/ai/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feedbackId: id }),
  });

  if (!res.ok) return null;
  return getFeedbackById(id);
}

export async function uploadCsv(file: File): Promise<{ success: number; failed: number; total: number }> {
  // Simple CSV parser helper in Javascript
  const text = await file.text();
  const lines = text.split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ''));
  
  const contentIdx = headers.indexOf("content");
  const channelIdx = headers.indexOf("channel");
  const labelIdx = headers.indexOf("customer_label");

  if (contentIdx === -1 || channelIdx === -1) {
    throw new Error("Invalid CSV format. Must contain 'content' and 'channel' columns.");
  }

  const items = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = line.split(",").map(v => v.trim().replace(/"/g, ''));
    if (values.length < headers.length) continue;

    items.push({
      content: values[contentIdx],
      channel: values[channelIdx] || "Support ticket",
      customerLabel: labelIdx !== -1 ? values[labelIdx] : undefined,
    });
  }

  const res = await fetch('/api/feedback/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) throw new Error("Failed to upload CSV");
  const result = await res.json();
  return {
    success: result.successCount,
    failed: result.failCount,
    total: result.total,
  };
}

export async function simulateChannel(
  channel: FeedbackItem['channel']
): Promise<{ generated: number; channel: string }> {
  // Simulate channel fetches realistic comments and pushes them via manual creation API
  const items = [
    { content: "This is a great new feature! Extremely satisfied.", channel },
    { content: "The system runs too slow. I can't download my invoices.", channel },
    { content: "How do I configure SSO authentication for my team?", channel },
    { content: "The UX is a bit confusing but the backend works.", channel },
  ];

  let generated = 0;
  for (const item of items) {
    try {
      await createFeedback(item);
      generated++;
    } catch (e) {
      // ignore
    }
  }

  return { generated, channel };
}
