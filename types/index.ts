export type Role = 'ADMIN' | 'ANALYST' | 'VIEWER';
export type Sentiment = 'POS' | 'NEU' | 'NEG';
export type FeedbackStatus = 'NEW' | 'REVIEWED' | 'ACTIONED';
export type Channel =
  | 'support_ticket'
  | 'app_review'
  | 'nps_survey'
  | 'sales_call'
  | 'community_post'
  | 'social_mention';

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  workspaceId: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  color: string;
  workspaceId: string;
  count: number;
  trend: number; // % change vs previous period
  createdAt: string;
}

export interface FeedbackItem {
  id: string;
  content: string;
  channel: Channel;
  sourceRef?: string;
  customerLabel?: string;
  sentiment: Sentiment;
  sentimentScore: number;
  status: FeedbackStatus;
  featureArea?: string;
  themes: Theme[];
  workspaceId: string;
  createdAt: string;
  classifiedAt?: string;
}

export interface Report {
  id: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  contentJson: ReportContent;
  createdAt: string;
  workspaceId: string;
  generatedBy: User;
}

export interface ReportContent {
  summary: string;
  topThemes: Array<{ name: string; count: number; sentiment: string; change: number }>;
  sentimentShift: {
    positive: number;
    neutral: number;
    negative: number;
    prevPositive: number;
    prevNeutral: number;
    prevNegative: number;
  };
  notableQuotes: Array<{ content: string; channel: string; sentiment: Sentiment }>;
  recommendedActions: string[];
  totalFeedback: number;
  newThisWeek: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: FeedbackItem[];
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface FeedbackFilters {
  search?: string;
  channel?: Channel | '';
  sentiment?: Sentiment | '';
  status?: FeedbackStatus | '';
  themeId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface DashboardStats {
  totalFeedback: number;
  newThisWeek: number;
  percentNegative: number;
  topTheme: string;
  sentimentTrend: number;
}
