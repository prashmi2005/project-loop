import type { FeedbackItem, Theme } from '@/types';

export async function getThemes(): Promise<Theme[]> {
  const res = await fetch('/api/themes');
  if (!res.ok) throw new Error("Failed to fetch themes");
  return res.json();
}

export async function getThemeById(id: string): Promise<Theme | null> {
  const res = await fetch(`/api/themes/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getThemeTrends(): Promise<Record<string, number[]>> {
  // Simple mock implementation for UI trends mapping since db doesn't hold historic analytics directly
  return {
    "Bugs & Reliability": [12, 19, 15, 25, 22, 30],
    "User Satisfaction": [45, 48, 52, 58, 62, 65],
    "Billing & Invoicing": [5, 8, 4, 12, 9, 11]
  };
}

export async function getThemeFeedback(themeId: string): Promise<FeedbackItem[]> {
  const res = await fetch(`/api/themes/${themeId}?feedback=true`);
  if (!res.ok) return [];
  return res.json();
}
