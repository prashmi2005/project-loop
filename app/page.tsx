import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Layers,
  LineChart,
  MessageSquareText,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
              <Workflow className="h-5 w-5 text-sky-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">LOOP</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              How it works
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Demo
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950" />
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-1.5 text-sm text-slate-300">
              <Sparkles className="h-4 w-4 text-sky-400" />
              AI-powered feedback intelligence
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Close the loop on{' '}
              <span className="bg-gradient-to-r from-sky-400 to-sky-500 bg-clip-text text-transparent">
                customer feedback
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              LOOP automatically classifies, clusters, and analyzes feedback from every channel —
              support tickets, app reviews, NPS surveys, sales calls, and more — so your team can
              act on what matters.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="w-full bg-sky-600 hover:bg-sky-700 sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-slate-600 bg-transparent text-white hover:bg-slate-800 hover:text-white sm:w-auto"
                >
                  See Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: '138+', label: 'Feedback items analyzed' },
              { value: '4', label: 'AI features' },
              { value: '3', label: 'User roles' },
              { value: '1', label: 'Unified platform' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900 lg:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Everything you need to understand your customers
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Four AI-powered capabilities that turn raw feedback into actionable intelligence.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Layers,
                title: 'Auto-Classification',
                description:
                  'Every feedback item is automatically tagged with sentiment, themes, and feature areas the moment it arrives.',
                color: 'text-sky-600 bg-sky-50',
              },
              {
                icon: BarChart3,
                title: 'Theme Clustering',
                description:
                  'AI clusters related feedback into themes and tracks volume trends so you spot emerging issues before they escalate.',
                color: 'text-emerald-600 bg-emerald-50',
              },
              {
                icon: Bot,
                title: 'Ask LOOP',
                description:
                  'Ask questions in plain English and get answers grounded in your actual feedback data, with citations.',
                color: 'text-amber-600 bg-amber-50',
              },
              {
                icon: MessageSquareText,
                title: 'VoC Reports',
                description:
                  'Generate executive-ready Voice of the Customer reports with summaries, quotes, and recommended actions.',
                color: 'text-rose-600 bg-rose-50',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              How it works
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From raw feedback to actionable insight in three steps.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Ingest feedback',
                description:
                  'Connect your channels — support tickets, app reviews, NPS, sales calls — or upload a CSV. LOOP ingests everything.',
                icon: Workflow,
              },
              {
                step: '02',
                title: 'AI analyzes',
                description:
                  'LOOP classifies sentiment, clusters themes, and identifies trends automatically. No manual tagging required.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Act on insights',
                description:
                  'Ask questions, generate reports, and track trends. Close the loop with your product and support teams.',
                icon: LineChart,
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">
                  <item.icon className="h-8 w-8 text-sky-400" />
                </div>
                <div className="mt-4 text-sm font-bold text-sky-600">{item.step}</div>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to close the loop?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Start analyzing your customer feedback with AI in minutes. No credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="w-full bg-sky-600 hover:bg-sky-700 sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-slate-600 bg-transparent text-white hover:bg-slate-800 hover:text-white sm:w-auto"
              >
                Explore the Demo
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-sky-400" />
              No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-sky-400" />
              138+ sample items
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-sky-400" />
              Full demo access
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <Workflow className="h-4 w-4 text-sky-400" />
            </div>
            <span className="font-bold text-slate-900">LOOP</span>
            <span className="text-sm text-slate-500">AI Feedback Intelligence</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} LOOP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
