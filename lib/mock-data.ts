import type {
  Channel,
  FeedbackItem,
  FeedbackStatus,
  Report,
  Sentiment,
  Theme,
  User,
  Workspace,
} from '@/types';

// ---------------------------------------------------------------------------
// Workspace
// ---------------------------------------------------------------------------
export const workspace: Workspace = {
  id: 'ws_1',
  name: 'Acme Corp',
  createdAt: '2024-01-15T08:00:00Z',
};

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export const users: User[] = [
  {
    id: 'usr_1',
    name: 'Alex Morgan',
    email: 'admin@acme.com',
    role: 'ADMIN',
    workspaceId: 'ws_1',
    avatarUrl: '',
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'usr_2',
    name: 'Riley Chen',
    email: 'analyst@acme.com',
    role: 'ANALYST',
    workspaceId: 'ws_1',
    avatarUrl: '',
    createdAt: '2024-02-01T08:00:00Z',
  },
  {
    id: 'usr_3',
    name: 'Sam Patel',
    email: 'viewer@acme.com',
    role: 'VIEWER',
    workspaceId: 'ws_1',
    avatarUrl: '',
    createdAt: '2024-03-12T08:00:00Z',
  },
];

export const demoCredentials = [
  { email: 'admin@acme.com', password: 'demo1234', role: 'ADMIN' },
  { email: 'analyst@acme.com', password: 'demo1234', role: 'ANALYST' },
  { email: 'viewer@acme.com', password: 'demo1234', role: 'VIEWER' },
];

// ---------------------------------------------------------------------------
// Themes
// ---------------------------------------------------------------------------
export const themes: Theme[] = [
  {
    id: 'theme_1',
    name: 'Onboarding',
    description: 'Feedback related to the first-run experience, setup flows, and getting started guides.',
    color: '#0ea5e9',
    workspaceId: 'ws_1',
    count: 0,
    trend: 28,
    createdAt: '2024-01-20T08:00:00Z',
  },
  {
    id: 'theme_2',
    name: 'Performance',
    description: 'Reports of slowness, latency, crashes, and general app speed issues.',
    color: '#f43f5e',
    workspaceId: 'ws_1',
    count: 0,
    trend: -12,
    createdAt: '2024-01-20T08:00:00Z',
  },
  {
    id: 'theme_3',
    name: 'Mobile App',
    description: 'Feedback about the iOS and Android mobile applications.',
    color: '#8b5cf6',
    workspaceId: 'ws_1',
    count: 0,
    trend: 15,
    createdAt: '2024-01-20T08:00:00Z',
  },
  {
    id: 'theme_4',
    name: 'Billing',
    description: 'Invoices, payment methods, plan upgrades/downgrades, and refund requests.',
    color: '#f59e0b',
    workspaceId: 'ws_1',
    count: 0,
    trend: 5,
    createdAt: '2024-01-20T08:00:00Z',
  },
  {
    id: 'theme_5',
    name: 'SSO / Auth',
    description: 'Single sign-on configuration, login failures, and access management.',
    color: '#10b981',
    workspaceId: 'ws_1',
    count: 0,
    trend: 34,
    createdAt: '2024-01-20T08:00:00Z',
  },
  {
    id: 'theme_6',
    name: 'Export Features',
    description: 'Requests and issues around CSV, PDF, and API data exports.',
    color: '#6366f1',
    workspaceId: 'ws_1',
    count: 0,
    trend: 8,
    createdAt: '2024-01-20T08:00:00Z',
  },
  {
    id: 'theme_7',
    name: 'Dashboard UX',
    description: 'Navigation, layout, and overall usability of the main dashboard.',
    color: '#ec4899',
    workspaceId: 'ws_1',
    count: 0,
    trend: -5,
    createdAt: '2024-01-20T08:00:00Z',
  },
  {
    id: 'theme_8',
    name: 'Customer Support',
    description: 'Feedback about support response times, agent helpfulness, and documentation.',
    color: '#14b8a6',
    workspaceId: 'ws_1',
    count: 0,
    trend: 22,
    createdAt: '2024-01-20T08:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Feedback content templates per theme — realistic and varied
// ---------------------------------------------------------------------------
const contentByTheme: Record<string, string[]> = {
  Onboarding: [
    'The onboarding flow was really confusing — I had no idea what to do after creating my first project.',
    'Loved the getting started guide! It walked me through everything step by step.',
    'It took me 20 minutes to find where to invite my team members. The setup wizard should mention that earlier.',
    'The interactive tour was helpful but it kept restarting every time I refreshed the page.',
    'First-run experience is great now after the recent update. Much smoother than when I signed up last year.',
    'I almost gave up during signup because the email verification never arrived. Had to resend twice.',
    'The checklist on the dashboard is a nice touch — it helped me complete my profile quickly.',
    'Onboarding for enterprise accounts is way too manual. We needed a guided session from support.',
  ],
  Performance: [
    'The dashboard takes forever to load when I have more than 50 items. It freezes my browser sometimes.',
    'App is noticeably faster after the last release. Great work on performance!',
    'Search is really slow — I type something and wait 5+ seconds for results to appear.',
    'The app keeps crashing on my older iPad. I lose my work when it happens.',
    'Page load times have improved a lot, but the reports section is still sluggish.',
    'Exporting large datasets basically hangs the whole app. Had to force quit.',
    'Latency is much better this month. Whatever you optimized, keep doing it.',
    'The mobile app freezes when I try to open a long thread. Have to kill and restart.',
  ],
  'Mobile App': [
    'The mobile app is missing the bulk edit feature that the web version has. Please add it!',
    'Push notifications stopped working after the last update. I missed important updates.',
    'Mobile UI is clean and intuitive. Much better than the old app.',
    'The app keeps logging me out on iOS. I have to re-enter credentials multiple times a day.',
    'Would love dark mode on the mobile app. The white screen is blinding at night.',
    'Offline mode would be a game-changer for field teams like ours.',
    'The Android app crashes when I try to attach photos to a ticket.',
    'Mobile app search is much better now. Results load instantly.',
  ],
  Billing: [
    'I was charged twice this month. I need a refund for the duplicate charge.',
    'The upgrade flow was seamless. I appreciate the prorated billing — that was a nice surprise.',
    'Why did my invoice suddenly go up? There was no email about a price change.',
    'Adding a new payment method was easy but removing the old one is buried in settings.',
    'The self-serve billing portal is great. I changed my plan without needing to contact support.',
    'I need a VAT-compliant invoice for my company. The current invoice format is missing tax details.',
    'Downgrading my plan was confusing — I wasn\'t sure what features I\'d lose.',
    'Billing support resolved my refund request in under an hour. Excellent service.',
  ],
  'SSO / Auth': [
    'SSO setup with Okta was straightforward thanks to the documentation. Took 10 minutes.',
    'Our team keeps getting logged out every few hours. The session timeout is way too aggressive.',
    'SAML configuration keeps failing with a generic error. The logs are unhelpful.',
    'Two-factor authentication via SMS is unreliable. I never receive the code. Please support authenticator apps.',
    'Adding SCIM provisioning would save us hours of manual user management every week.',
    'The new SSO dashboard makes it much easier to see which users are provisioned.',
    'We need group-based access control. Right now every SSO user gets the same role.',
    'Password reset flow is broken — the reset email link expires before I can click it.',
  ],
  'Export Features': [
    'I need to export data to CSV but the export only gives me 100 rows at a time. This is unusable for reporting.',
    'The PDF export looks professional. My stakeholders love the formatted reports.',
    'Please add an API endpoint for exporting data. We want to pipe it into our warehouse.',
    'Excel export breaks when there are special characters in the data. The file won\'t open.',
    'Scheduled exports would be amazing — I want a weekly CSV emailed to my team automatically.',
    'The new export wizard is much clearer. I can finally choose which columns to include.',
    'Exporting to Google Sheets directly would save me a step. Please consider it.',
    'The JSON export format is perfect for our integration pipeline. Great addition.',
  ],
  'Dashboard UX': [
    'The new sidebar navigation is so much cleaner. Finding things is finally easy.',
    'There\'s too much empty space on the dashboard. I have to scroll a lot to see my data.',
    'I love the customizable widgets. I rearranged my dashboard to show what matters most.',
    'The filter panel covers half the screen on smaller monitors. It should collapse by default.',
    'Dark mode for the dashboard is long overdue. Every other tool I use has it.',
    'The drag-and-drop dashboard builder is intuitive. My team set up their views in minutes.',
    'Breadcrumbs would help — I keep losing track of where I am in the settings hierarchy.',
    'The dashboard loads with a jarring layout shift. Elements jump around for 2 seconds.',
  ],
  'Customer Support': [
    'Support was incredibly responsive. They solved my issue in under 10 minutes via chat.',
    'I waited 3 days for a response to my ticket. That\'s unacceptable for a paying customer.',
    'The help center articles are outdated and reference UI that no longer exists.',
    'Your support agent went above and beyond — they made a video tutorial just for me!',
    'The chat widget is hard to find. I had to search the docs to locate the support contact.',
    'Community forum is great but there\'s no way to escalate a question to the support team.',
    'Support response times have improved dramatically. Keep it up!',
    'The AI chatbot in support is useless. It just loops me back to the same help article.',
  ],
};

const channels: Channel[] = [
  'support_ticket',
  'app_review',
  'nps_survey',
  'sales_call',
  'community_post',
  'social_mention',
];

const channelLabels: Record<Channel, string> = {
  support_ticket: 'Support Ticket',
  app_review: 'App Review',
  nps_survey: 'NPS Survey',
  sales_call: 'Sales Call',
  community_post: 'Community Post',
  social_mention: 'Social Mention',
};

const sentiments: Sentiment[] = ['POS', 'NEU', 'NEG'];

const statuses: FeedbackStatus[] = ['NEW', 'REVIEWED', 'ACTIONED'];

const featureAreas = [
  'Onboarding Wizard',
  'Dashboard',
  'Settings',
  'Reports',
  'API',
  'Integrations',
  'Mobile',
  'Webhooks',
  'Notifications',
  'Search',
];

const customerLabels = [
  'Acme Industries',
  'Globex Corp',
  'Initech LLC',
  'Umbrella Inc',
  'Hooli Tech',
  'Pied Piper',
  'Stark Industries',
  'Wayne Enterprises',
  'Soylent Corp',
  'Cyberdyne Systems',
  'Massive Dynamic',
  'Vandelay Industries',
  'Wonka Industries',
  'Nakatomi Corp',
  'Aperture Science',
];

// ---------------------------------------------------------------------------
// Deterministic pseudo-random for reproducible data
// ---------------------------------------------------------------------------
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRandom(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickThemes(): Theme[] {
  const count = 1 + Math.floor(rand() * 2); // 1-2 themes
  const selected: Theme[] = [];
  const available = [...themes];
  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = Math.floor(rand() * available.length);
    selected.push(available[idx]);
    available.splice(idx, 1);
  }
  return selected;
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(Math.floor(rand() * 24), Math.floor(rand() * 60), 0, 0);
  return d.toISOString();
}

// ---------------------------------------------------------------------------
// Generate 130+ feedback items
// ---------------------------------------------------------------------------
function generateFeedback(): FeedbackItem[] {
  const items: FeedbackItem[] = [];
  const totalItems = 138;
  let usedContent = new Set<string>();

  for (let i = 0; i < totalItems; i++) {
    const itemThemes = pickThemes();
    const primaryTheme = itemThemes[0];
    const contentPool = contentByTheme[primaryTheme.name] || contentByTheme['Onboarding'];

    // Pick content, avoiding immediate duplicates
    let content = pick(contentPool);
    let attempts = 0;
    while (usedContent.has(content + primaryTheme.id) && attempts < 5) {
      content = pick(contentPool);
      attempts++;
    }
    usedContent.add(content + primaryTheme.id);

    // Derive sentiment from content keywords
    let sentiment: Sentiment;
    const lower = content.toLowerCase();
    if (
      lower.includes('love') ||
      lower.includes('great') ||
      lower.includes('excellent') ||
      lower.includes('amazing') ||
      lower.includes('improved') ||
      lower.includes('better') ||
      lower.includes('seamless') ||
      lower.includes('clean') ||
      lower.includes('intuitive') ||
      lower.includes('helpful') ||
      lower.includes('responsive') ||
      lower.includes('professional')
    ) {
      sentiment = 'POS';
    } else if (
      lower.includes('confusing') ||
      lower.includes('slow') ||
      lower.includes('crash') ||
      lower.includes('broken') ||
      lower.includes('missing') ||
      lower.includes('unacceptable') ||
      lower.includes('useless') ||
      lower.includes('sluggish') ||
      lower.includes('hangs') ||
      lower.includes('blinding') ||
      lower.includes('waited') ||
      lower.includes('duplicate')
    ) {
      sentiment = 'NEG';
    } else {
      sentiment = pick(sentiments);
    }

    const sentimentScore =
      sentiment === 'POS'
        ? 50 + Math.floor(rand() * 50)
        : sentiment === 'NEG'
          ? -50 - Math.floor(rand() * 50)
          : Math.floor(rand() * 40) - 20;

    const channel = pick(channels);
    const status: FeedbackStatus =
      i < 20 ? 'NEW' : i < 60 ? pick(statuses) : pick(['REVIEWED', 'ACTIONED']);

    const daysBack = Math.floor(rand() * 30);
    const createdAt = daysAgo(daysBack);

    items.push({
      id: `fb_${i + 1}`,
      content,
      channel,
      sourceRef:
        channel === 'support_ticket'
          ? `TKT-${1000 + i}`
          : channel === 'app_review'
            ? `APP-${2000 + i}`
            : channel === 'nps_survey'
              ? `NPS-${3000 + i}`
              : channel === 'sales_call'
                ? `CALL-${4000 + i}`
                : channel === 'community_post'
                  ? `POST-${5000 + i}`
                  : `SOC-${6000 + i}`,
      customerLabel: pick(customerLabels),
      sentiment,
      sentimentScore,
      status,
      featureArea: pick(featureAreas),
      themes: itemThemes,
      workspaceId: 'ws_1',
      createdAt,
      classifiedAt: createdAt,
    });
  }

  // Sort by date desc
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Update theme counts
  for (const theme of themes) {
    theme.count = items.filter((item) => item.themes.some((t) => t.id === theme.id)).length;
  }

  return items;
}

export const feedbackItems: FeedbackItem[] = generateFeedback();

// ---------------------------------------------------------------------------
// Theme trend data — weekly counts for last 8 weeks
// ---------------------------------------------------------------------------
export const themeTrends: Record<string, number[]> = {};
for (const theme of themes) {
  const base = Math.floor(theme.count / 8) || 3;
  const trendDirection = theme.trend > 0 ? 1 : -1;
  const arr: number[] = [];
  for (let w = 0; w < 8; w++) {
    const variance = Math.floor(rand() * 6) - 2;
    const growth = Math.floor((trendDirection * w * Math.abs(theme.trend)) / 40);
    arr.push(Math.max(1, base + variance + growth));
  }
  themeTrends[theme.id] = arr;
}

// ---------------------------------------------------------------------------
// Volume over time — last 30 days
// ---------------------------------------------------------------------------
export const volumeOverTime: Array<{ date: string; count: number; positive: number; neutral: number; negative: number }> = [];
for (let d = 29; d >= 0; d--) {
  const date = new Date();
  date.setDate(date.getDate() - d);
  const dateStr = date.toISOString().split('T')[0];
  const base = 4 + Math.floor(rand() * 5);
  const positive = Math.floor(base * 0.4) + Math.floor(rand() * 2);
  const negative = Math.floor(base * 0.35) + Math.floor(rand() * 2);
  const neutral = Math.max(0, base - positive - negative);
  volumeOverTime.push({ date: dateStr, count: base, positive, neutral, negative });
}

// ---------------------------------------------------------------------------
// Sentiment breakdown (current period)
// ---------------------------------------------------------------------------
export const sentimentBreakdown = (() => {
  const pos = feedbackItems.filter((f) => f.sentiment === 'POS').length;
  const neu = feedbackItems.filter((f) => f.sentiment === 'NEU').length;
  const neg = feedbackItems.filter((f) => f.sentiment === 'NEG').length;
  return { positive: pos, neutral: neu, negative: neg };
})();

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------
export const reports: Report[] = [
  {
    id: 'rpt_1',
    title: 'Weekly VoC Report — Week 38',
    periodStart: daysAgo(7).split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
    createdAt: daysAgo(1),
    workspaceId: 'ws_1',
    generatedBy: users[0],
    contentJson: {
      summary:
        'This week saw a 28% spike in Onboarding-related feedback, driven by confusion around the new email verification step. SSO/Auth complaints also rose 34%. Overall sentiment improved slightly (+4pts) thanks to positive reception of the performance optimizations shipped last sprint.',
      topThemes: [
        { name: 'Onboarding', count: 18, sentiment: 'NEG', change: 28 },
        { name: 'SSO / Auth', count: 14, sentiment: 'NEG', change: 34 },
        { name: 'Performance', count: 12, sentiment: 'POS', change: -12 },
        { name: 'Mobile App', count: 10, sentiment: 'NEU', change: 15 },
        { name: 'Dashboard UX', count: 8, sentiment: 'POS', change: -5 },
      ],
      sentimentShift: {
        positive: 42,
        neutral: 28,
        negative: 30,
        prevPositive: 38,
        prevNeutral: 30,
        prevNegative: 32,
      },
      notableQuotes: [
        {
          content: 'The onboarding flow was really confusing — I had no idea what to do after creating my first project.',
          channel: 'Support Ticket',
          sentiment: 'NEG',
        },
        {
          content: 'App is noticeably faster after the last release. Great work on performance!',
          channel: 'App Review',
          sentiment: 'POS',
        },
        {
          content: 'SSO setup with Okta was straightforward thanks to the documentation. Took 10 minutes.',
          channel: 'Community Post',
          sentiment: 'POS',
        },
        {
          content: 'I waited 3 days for a response to my ticket. That\'s unacceptable for a paying customer.',
          channel: 'Support Ticket',
          sentiment: 'NEG',
        },
      ],
      recommendedActions: [
        'Add a tooltip in the onboarding wizard explaining the email verification step — 18 tickets referenced this.',
        'Investigate the SAML configuration error reported by 3 enterprise accounts; share updated docs.',
        'Ship the authenticator-app 2FA option — SMS delivery issues caused 6 support tickets.',
        'Recognize the performance team publicly — positive sentiment on speed is up 12pts.',
        'Review the support SLA; 3-day response times are driving negative sentiment.',
      ],
      totalFeedback: 34,
      newThisWeek: 34,
    },
  },
  {
    id: 'rpt_2',
    title: 'Monthly Executive Summary — September',
    periodStart: daysAgo(30).split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
    createdAt: daysAgo(3),
    workspaceId: 'ws_1',
    generatedBy: users[1],
    contentJson: {
      summary:
        'September delivered 138 feedback items across all channels. Onboarding and SSO/Auth are the fastest-rising themes. Performance sentiment turned positive for the first time this quarter. Mobile App requests for dark mode and offline mode remain the top feature asks.',
      topThemes: [
        { name: 'Onboarding', count: 32, sentiment: 'NEG', change: 28 },
        { name: 'SSO / Auth', count: 26, sentiment: 'NEG', change: 34 },
        { name: 'Performance', count: 22, sentiment: 'POS', change: -12 },
        { name: 'Mobile App', count: 20, sentiment: 'NEU', change: 15 },
        { name: 'Billing', count: 14, sentiment: 'NEU', change: 5 },
      ],
      sentimentShift: {
        positive: 40,
        neutral: 30,
        negative: 30,
        prevPositive: 35,
        prevNeutral: 32,
        prevNegative: 33,
      },
      notableQuotes: [
        {
          content: 'Would love dark mode on the mobile app. The white screen is blinding at night.',
          channel: 'App Review',
          sentiment: 'NEU',
        },
        {
          content: 'The self-serve billing portal is great. I changed my plan without needing to contact support.',
          channel: 'NPS Survey',
          sentiment: 'POS',
        },
        {
          content: 'Offline mode would be a game-changer for field teams like ours.',
          channel: 'Community Post',
          sentiment: 'POS',
        },
      ],
      recommendedActions: [
        'Prioritize dark mode for mobile — 8 requests this month, highest-impact quick win.',
        'Create an onboarding checklist widget to reduce setup confusion.',
        'Publish an SSO troubleshooting guide for SAML errors.',
        'Investigate billing price-change notification gaps.',
      ],
      totalFeedback: 138,
      newThisWeek: 34,
    },
  },
  {
    id: 'rpt_3',
    title: 'Sprint Review — Performance & Mobile',
    periodStart: daysAgo(14).split('T')[0],
    periodEnd: daysAgo(7).split('T')[0],
    createdAt: daysAgo(8),
    workspaceId: 'ws_1',
    generatedBy: users[0],
    contentJson: {
      summary:
        'Two-week focus on Performance and Mobile App feedback. Performance sentiment flipped positive after the caching improvements. Mobile crash reports are down but dark mode requests dominate.',
      topThemes: [
        { name: 'Performance', count: 16, sentiment: 'POS', change: -12 },
        { name: 'Mobile App', count: 14, sentiment: 'NEU', change: 15 },
        { name: 'Dashboard UX', count: 9, sentiment: 'POS', change: -5 },
      ],
      sentimentShift: {
        positive: 44,
        neutral: 26,
        negative: 30,
        prevPositive: 36,
        prevNeutral: 30,
        prevNegative: 34,
      },
      notableQuotes: [
        {
          content: 'Latency is much better this month. Whatever you optimized, keep doing it.',
          channel: 'App Review',
          sentiment: 'POS',
        },
        {
          content: 'The mobile app freezes when I try to open a long thread. Have to kill and restart.',
          channel: 'Support Ticket',
          sentiment: 'NEG',
        },
      ],
      recommendedActions: [
        'Ship the long-thread virtualization fix for mobile.',
        'Document the caching improvements in the changelog.',
        'Begin dark mode design exploration for mobile.',
      ],
      totalFeedback: 52,
      newThisWeek: 24,
    },
  },
  {
    id: 'rpt_4',
    title: 'Q3 Customer Sentiment Snapshot',
    periodStart: daysAgo(75).split('T')[0],
    periodEnd: daysAgo(45).split('T')[0],
    createdAt: daysAgo(46),
    workspaceId: 'ws_1',
    generatedBy: users[1],
    contentJson: {
      summary:
        'Q3 sentiment trended upward driven by performance wins and the dashboard redesign. Onboarding remained the key risk area. SSO/Auth complaints began rising late in the quarter.',
      topThemes: [
        { name: 'Onboarding', count: 28, sentiment: 'NEG', change: 20 },
        { name: 'Dashboard UX', count: 18, sentiment: 'POS', change: 10 },
        { name: 'Performance', count: 16, sentiment: 'POS', change: 5 },
        { name: 'SSO / Auth', count: 12, sentiment: 'NEG', change: 18 },
      ],
      sentimentShift: {
        positive: 38,
        neutral: 32,
        negative: 30,
        prevPositive: 33,
        prevNeutral: 34,
        prevNegative: 33,
      },
      notableQuotes: [
        {
          content: 'The new sidebar navigation is so much cleaner. Finding things is finally easy.',
          channel: 'Community Post',
          sentiment: 'POS',
        },
        {
          content: 'I almost gave up during signup because the email verification never arrived.',
          channel: 'Support Ticket',
          sentiment: 'NEG',
        },
      ],
      recommendedActions: [
        'Redesign the email verification flow for onboarding.',
        'Plan a Q4 SSO reliability sprint.',
        'Celebrate the dashboard redesign win in the next all-hands.',
      ],
      totalFeedback: 96,
      newThisWeek: 0,
    },
  },
  {
    id: 'rpt_5',
    title: 'Billing Deep-Dive — August',
    periodStart: daysAgo(50).split('T')[0],
    periodEnd: daysAgo(20).split('T')[0],
    createdAt: daysAgo(21),
    workspaceId: 'ws_1',
    generatedBy: users[0],
    contentJson: {
      summary:
        'Billing feedback was mostly neutral with a few negative spikes around duplicate charges and invoice format. The self-serve portal received consistent praise.',
      topThemes: [
        { name: 'Billing', count: 14, sentiment: 'NEU', change: 5 },
        { name: 'Customer Support', count: 8, sentiment: 'POS', change: 22 },
      ],
      sentimentShift: {
        positive: 36,
        neutral: 40,
        negative: 24,
        prevPositive: 34,
        prevNeutral: 38,
        prevNegative: 28,
      },
      notableQuotes: [
        {
          content: 'I was charged twice this month. I need a refund for the duplicate charge.',
          channel: 'Support Ticket',
          sentiment: 'NEG',
        },
        {
          content: 'The self-serve billing portal is great. I changed my plan without needing to contact support.',
          channel: 'NPS Survey',
          sentiment: 'POS',
        },
      ],
      recommendedActions: [
        'Add idempotency keys to the payment processor to prevent duplicate charges.',
        'Generate VAT-compliant invoices for EU customers.',
        'Improve the downgrade flow with a feature-comparison table.',
      ],
      totalFeedback: 28,
      newThisWeek: 0,
    },
  },
];

// ---------------------------------------------------------------------------
// Helper exports
// ---------------------------------------------------------------------------
export function getThemeById(id: string): Theme | undefined {
  return themes.find((t) => t.id === id);
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export { channelLabels };
