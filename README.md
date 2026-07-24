# Project LOOP — AI Customer-Feedback Intelligence Platform

Project LOOP is a corporate-grade web application built for the **Zidio Development Internship Program**. It ingests multi-channel customer feedback, classifies and clusters it using Anthropic Claude AI, surfaces trending themes, and provides grounded Q&A backed by real feedback data.

---

## 🚀 Demo Credentials (Seeded Workspace)

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `admin@democorp.com` | `password123` | Full access, workspace management, feedback triage & AI generation |
| **Analyst** | `analyst@democorp.com` | `password123` | Feedback ingestion, inbox filtering, theme analysis & AI features |
| **Viewer** | `viewer@democorp.com` | `password123` | Read-only access to dashboard, inbox, trends, and reports |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 13.5 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI primitives + Lucide React Icons
- **Database & ORM**: SQLite (Local Dev) / PostgreSQL ready + Prisma ORM
- **Authentication**: NextAuth.js (JWT session handling & Role-Based Access Control)
- **AI Integration**: Anthropic Claude API (`claude-3-5-sonnet`)
- **Data Visualization**: Recharts
- **Validation**: Zod schema validation

---

## ✨ Features Implemented

1. **Authentication & Multi-Tenant Workspaces**:
   - Role-Based Access Control (Admin, Analyst, Viewer).
   - Strict tenant isolation (`workspaceId` scoped queries across all APIs).
2. **Feedback Ingestion & Management**:
   - Single item ingestion form.
   - Bulk CSV import with instant validation and error reporting.
   - Interactive feedback inbox with search, channel filtering, sentiment filtering, and inline status updates (`NEW` → `REVIEWED` → `ACTIONED`).
3. **Analytics Dashboard**:
   - Real-time stat cards (total feedback, % negative, new this week, avg sentiment).
   - Dynamic charts: volume over time, sentiment breakdown, top theme distribution.
4. **AI Capabilities (Claude AI)**:
   - **Auto-Classification**: Structured JSON output for sentiment, score, theme, and feature area.
   - **Theme Clustering & Trends**: Automated grouping of feedback into themes with trend detection.
   - **Ask LOOP (Grounded Q&A)**: Semantic keyword retrieval + Claude Q&A grounded strictly in stored customer feedback.
   - **Voice of Customer (VoC) Reports**: One-click executive summary generation with sentiment shift metrics and actionable quotes.

---

## 💻 Local Setup & Installation

### 1. Prerequisites
- Node.js 18.x or newer
- npm / yarn

### 2. Installation
```bash
# Clone the repository
git clone <your-github-repo-url>
cd project-loop-main

# Install dependencies
npm install
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="sRVR8GhreNGNon5nALKebZQsU3L816CwzDYWxvYBvCw="
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="your_anthropic_api_key_here"
```

### 4. Database Setup & Seeding
```bash
# Run Prisma migrations / sync schema
npx prisma db push

# Seed database with 150+ realistic Indian customer feedback items
npm run seed
```

### 5. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Structure

```
project-loop-main/
├── app/
│   ├── (app)/               # Protected app pages (dashboard, inbox, trends, ask, reports)
│   ├── api/                 # API Route Handlers (auth, feedback, themes, ai, reports)
│   └── login/               # Authentication page
├── components/              # UI components and charts
├── lib/                     # Database client, auth context, utils
├── prisma/                  # Prisma schema and seed script
└── services/                # API client services
```

---

## 🎥 Deliverables Checklist (Zidio Internship)

- [x] **GitHub Repository**: Full codebase with typed TypeScript code & zero secrets committed.
- [x] **README & Documentation**: Setup instructions, demo credentials, and tech stack details.
- [x] **Seeded Database**: 150+ realistic customer feedback items across multiple channels.
- [x] **Multi-Role RBAC**: Admin, Analyst, and Viewer permissions enforced.
