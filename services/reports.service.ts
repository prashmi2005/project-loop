import type { Report } from '@/types';

export async function getReports(): Promise<Report[]> {
  const res = await fetch('/api/reports');
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
}

export async function getReportById(id: string): Promise<Report | null> {
  const res = await fetch(`/api/reports/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function generateReport(
  periodStart: string,
  periodEnd: string
): Promise<Report> {
  const res = await fetch('/api/ai/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ periodStart, periodEnd }),
  });

  if (!res.ok) {
    const errorJson = await res.json();
    throw new Error(errorJson.error || "Failed to generate report");
  }
  return res.json();
}
