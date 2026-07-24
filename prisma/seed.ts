import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const CHANNELS = [
  'support_ticket',
  'app_review',
  'nps_survey',
  'sales_call',
  'community_post',
  'social_mention',
]

// Indian names for customerLabel / source attribution
const INDIAN_NAMES = [
  'Aarav Sharma', 'Priya Nair', 'Rohit Verma', 'Sneha Iyer', 'Karan Mehta',
  'Anjali Gupta', 'Vikram Patel', 'Divya Rao', 'Arjun Reddy', 'Pooja Singh',
  'Rahul Joshi', 'Nisha Pillai', 'Amit Agarwal', 'Kavya Menon', 'Suresh Bhat',
  'Shreya Kulkarni', 'Nikhil Tiwari', 'Meera Desai', 'Aditya Sinha', 'Riya Malhotra',
  'Siddharth Pandey', 'Ananya Ghosh', 'Mayank Chaudhary', 'Tanvi Shah', 'Gaurav Mishra',
  'Deepa Krishnan', 'Harish Nambiar', 'Pallavi Saxena', 'Vivek Rajan', 'Swati Banerjee',
  'Manish Dubey', 'Lakshmi Venkatesh', 'Chirag Thakur', 'Ritika Oberoi', 'Aryan Kapoor',
  'Simran Bedi', 'Hemant Yadav', 'Disha Jain', 'Pranav Chopra', 'Nandini Murthy',
]

const TEMPLATES = [
  // Onboarding & Setup
  { content: "Onboarding bahut time le raha tha — team ko invite karna samajh hi nahi aaya.", sentiment: "NEG", channel: "support_ticket" },
  { content: "Onboarding process is too slow. I spent 2 hours just setting up the workspace. Please simplify it for Indian SMBs.", sentiment: "NEG", channel: "support_ticket" },
  { content: "The setup wizard is confusing. Should have a Hinglish option for non-English users.", sentiment: "NEG", channel: "nps_survey" },
  { content: "Getting started was smooth. The tutorial videos helped a lot. But please add subtitles in Hindi.", sentiment: "POS", channel: "nps_survey" },
  { content: "Bahut accha product hai but onboarding mein kuch aur guidance chahiye thi.", sentiment: "NEU", channel: "community_post" },

  // Dashboard & UI
  { content: "Naya dashboard bahut sundar aur fast hai. Bahut improvement hua hai!", sentiment: "POS", channel: "app_review" },
  { content: "The new dashboard is finally fast. Works great even on my Jio 4G connection.", sentiment: "POS", channel: "app_review" },
  { content: "Dashboard looks premium! Reminds me of the big MNCs tools but made for Indian teams.", sentiment: "POS", channel: "community_post" },
  { content: "UI is good but dark mode abhi bhi thoda buggy hai on Android.", sentiment: "NEU", channel: "app_review" },
  { content: "Charts on the dashboard are not loading properly on Chrome mobile. Please fix.", sentiment: "NEG", channel: "support_ticket" },

  // Mobile Experience
  { content: "Mobile app bahut slow hai. 2G pe toh bilkul nahi chalta.", sentiment: "NEG", channel: "app_review" },
  { content: "Kaam toh karta hai, but mobile experience mein bahut improvement ki zaroorat hai.", sentiment: "NEU", channel: "nps_survey" },
  { content: "App crashes when switching between tabs on my Redmi Note 12. Please optimize for budget phones.", sentiment: "NEG", channel: "app_review" },
  { content: "Please make the app work offline also. In tier-2 cities connectivity is an issue.", sentiment: "NEU", channel: "community_post" },
  { content: "Works perfectly on my OnePlus. Very smooth experience.", sentiment: "POS", channel: "app_review" },

  // Billing & Payments
  { content: "Billing page keeps timing out when I try to download my GST invoice. Very frustrating!", sentiment: "NEG", channel: "support_ticket" },
  { content: "Please add UPI payment option. Net banking and cards are fine but UPI is how India pays.", sentiment: "NEG", channel: "community_post" },
  { content: "Invoice nahi aa raha tha for 3 days. Support ne help kiya toh resolve hua.", sentiment: "NEU", channel: "support_ticket" },
  { content: "Billing mein GST number add karne ka option nahi hai. This is mandatory for Indian businesses.", sentiment: "NEG", channel: "support_ticket" },
  { content: "Pricing is very competitive compared to foreign tools. Good value for Indian startups.", sentiment: "POS", channel: "nps_survey" },
  { content: "Annual plan discount is great. Please also offer quarterly billing for small businesses.", sentiment: "NEU", channel: "nps_survey" },

  // Features & Integrations
  { content: "SSO integration chahiye. Hamari IT team toh yahi bol rahi hai har baar.", sentiment: "NEG", channel: "sales_call" },
  { content: "Client wanted Zoho CRM integration before they sign. Please add it ASAP.", sentiment: "NEG", channel: "sales_call" },
  { content: "WhatsApp Business API integration please! Our entire sales team runs on WhatsApp.", sentiment: "NEU", channel: "community_post" },
  { content: "Nayi export feature bahut kaam ki hai. Aaj 1 ghanta bachaaya!", sentiment: "POS", channel: "community_post" },
  { content: "Please add bulk import via Excel. Our data is all in Excel sheets.", sentiment: "NEU", channel: "support_ticket" },
  { content: "Tally integration hoti toh accountant bhi directly use kar sakta. Please consider.", sentiment: "NEU", channel: "community_post" },
  { content: "Love the Slack notifications. Now I don't miss any important updates.", sentiment: "POS", channel: "community_post" },
  { content: "Please add regional language support — at least Hindi and Tamil for our field team.", sentiment: "NEU", channel: "nps_survey" },

  // Performance & Reliability
  { content: "App bahut slow ho jaata hai month end par. Lag raha hai server issue hai.", sentiment: "NEG", channel: "support_ticket" },
  { content: "Server downtime on 15th was very bad. We lost 2 hours of work. Please improve uptime.", sentiment: "NEG", channel: "support_ticket" },
  { content: "API response times have improved a lot this month. Keep it up!", sentiment: "POS", channel: "community_post" },
  { content: "Large file upload karte time app crash ho jaata hai. 10MB se upar nahi jaata.", sentiment: "NEG", channel: "app_review" },

  // Documentation & Support
  { content: "API documentation dhundh nahi pa raha tha. Please improve the search.", sentiment: "NEG", channel: "support_ticket" },
  { content: "Support team ne 10 minute mein resolve kar diya. Bahut accha experience!", sentiment: "POS", channel: "nps_survey" },
  { content: "Customer support is top notch. They even helped me on Sunday evening.", sentiment: "POS", channel: "nps_survey" },
  { content: "Please make video tutorials in Hindi. Many of our staff don't understand English well.", sentiment: "NEU", channel: "community_post" },
  { content: "Documentation is very technical. Need simpler guides for non-technical founders.", sentiment: "NEU", channel: "community_post" },

  // Reports & Analytics
  { content: "Custom date range filter reports mein chahiye. Monthly analysis ke liye zaroorat hai.", sentiment: "NEU", channel: "community_post" },
  { content: "The analytics report helped me present to my investors. Very professional output!", sentiment: "POS", channel: "nps_survey" },
  { content: "Please add Indian financial year reporting (April to March) in the analytics.", sentiment: "NEU", channel: "nps_survey" },
  { content: "Reports export to PDF is broken since last update. Please fix urgently.", sentiment: "NEG", channel: "support_ticket" },

  // Positive General
  { content: "Bahut accha product hai! Made in India feel aata hai. Proud to use Indian SaaS.", sentiment: "POS", channel: "social_mention" },
  { content: "Switched from a US tool to this. Much better support and pricing for India market.", sentiment: "POS", channel: "social_mention" },
  { content: "Mera poora team ab isko use karta hai. Productivity badh gayi hai clearly.", sentiment: "POS", channel: "nps_survey" },
  { content: "Really impressed with how fast new features are being shipped. Keep it up team!", sentiment: "POS", channel: "social_mention" },
  { content: "Perfect tool for our Bangalore startup. Recommended to 3 other founders already.", sentiment: "POS", channel: "social_mention" },
  { content: "This is what Indian B2B SaaS should look like. World class quality.", sentiment: "POS", channel: "app_review" },
]

function randomDate(daysBack: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack))
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
  return d
}

function generateFeedback(count: number, workspaceId: string) {
  const feedback = []
  for (let i = 0; i < count; i++) {
    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)]
    const name = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)]
    feedback.push({
      content: template.content,
      channel: template.channel,
      sentiment: template.sentiment as any,
      sentimentScore:
        template.sentiment === 'POS'
          ? parseFloat((Math.random() * 0.4 + 0.5).toFixed(2))
          : template.sentiment === 'NEG'
          ? parseFloat((-Math.random() * 0.4 - 0.3).toFixed(2))
          : parseFloat((Math.random() * 0.2 - 0.1).toFixed(2)),
      status: i % 5 === 0 ? 'REVIEWED' : 'NEW',
      customerLabel: name,
      workspaceId,
      createdAt: randomDate(60),
    })
  }
  return feedback
}

async function main() {
  console.log('🌱 Seeding database with Indian user data...')

  // Clear existing data
  await prisma.feedbackTheme.deleteMany()
  await prisma.feedback.deleteMany()
  await prisma.theme.deleteMany()
  await prisma.report.deleteMany()
  await prisma.user.deleteMany()
  await prisma.workspace.deleteMany()

  const workspace = await prisma.workspace.create({
    data: { name: 'DemoCorp India Pvt. Ltd.' },
  })

  const passwordHash = await bcrypt.hash('password123', 10)

  await prisma.user.createMany({
    data: [
      { email: 'admin@democorp.com', name: 'Arjun Mehta', passwordHash, role: 'ADMIN', workspaceId: workspace.id },
      { email: 'analyst@democorp.com', name: 'Priya Sharma', passwordHash, role: 'ANALYST', workspaceId: workspace.id },
      { email: 'viewer@democorp.com', name: 'Rahul Verma', passwordHash, role: 'VIEWER', workspaceId: workspace.id },
    ],
  })

  // Create themes
  const themes = await Promise.all([
    prisma.theme.create({ data: { name: 'Onboarding & Setup', description: 'Issues with getting started, team invites, and initial configuration.', color: 'sky', workspaceId: workspace.id } }),
    prisma.theme.create({ data: { name: 'Mobile Experience', description: 'Feedback about Android/iOS app performance and usability.', color: 'violet', workspaceId: workspace.id } }),
    prisma.theme.create({ data: { name: 'Billing & Payments', description: 'GST invoices, UPI requests, billing page issues.', color: 'amber', workspaceId: workspace.id } }),
    prisma.theme.create({ data: { name: 'Feature Requests', description: 'WhatsApp, Tally, Zoho integrations and regional language support.', color: 'emerald', workspaceId: workspace.id } }),
    prisma.theme.create({ data: { name: 'Performance & Reliability', description: 'Slow load times, crashes, server downtime.', color: 'rose', workspaceId: workspace.id } }),
  ])

  const feedbacks = generateFeedback(150, workspace.id)
  await prisma.feedback.createMany({ data: feedbacks as any })

  // Link some feedbacks to themes for trends page
  const allFeedback = await prisma.feedback.findMany({ where: { workspaceId: workspace.id }, take: 80 })

  const themeKeywords: Record<string, string[]> = {
    'Onboarding & Setup': ['onboarding', 'invite', 'setup', 'wizard', 'getting started'],
    'Mobile Experience': ['mobile', 'app', 'android', 'crash', 'redmi', 'slow'],
    'Billing & Payments': ['billing', 'invoice', 'gst', 'upi', 'payment'],
    'Feature Requests': ['integration', 'whatsapp', 'tally', 'zoho', 'hindi', 'excel'],
    'Performance & Reliability': ['slow', 'downtime', 'server', 'crash', 'timeout'],
  }

  for (const fb of allFeedback) {
    const contentLower = fb.content.toLowerCase()
    for (const theme of themes) {
      const keywords = themeKeywords[theme.name] || []
      if (keywords.some(k => contentLower.includes(k))) {
        await prisma.feedbackTheme.upsert({
          where: { feedbackId_themeId: { feedbackId: fb.id, themeId: theme.id } },
          create: { feedbackId: fb.id, themeId: theme.id, confidence: 0.85 },
          update: {},
        })
        break // one theme per feedback
      }
    }
  }

  console.log('✅ Database seeded successfully with 150 Indian user feedback items!')
  console.log('👤 Login: admin@democorp.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

export {}
