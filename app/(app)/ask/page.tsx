'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, Sparkles, User as UserIcon } from 'lucide-react';
import { askLoop } from '@/services/insights.service';
import { useAuth } from '@/lib/auth-context';
import { ChannelBadge } from '@/components/feedback/ChannelBadge';
import { SentimentBadge } from '@/components/feedback/SentimentBadge';
import type { ChatMessage } from '@/types';

const suggestedQuestions = [
  'What are users saying about onboarding?',
  'Which issues are most urgent?',
  'What features do customers request most?',
  'How is sentiment trending this month?',
];

export default function AskPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (question: string) => {
    if (!question.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { answer, citations } = await askLoop(question);
      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: answer,
        citations,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <Sparkles className="h-6 w-6 text-sky-600" />
          Ask LOOP
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ask questions about your feedback data. LOOP answers with citations from real feedback.
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.length === 0 && !loading && (
          <div className="mx-auto max-w-2xl py-12">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
                <Bot className="h-8 w-8 text-sky-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Ask me anything about your feedback
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                I can analyze themes, sentiment, trends, and recommend actions.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-700 transition-colors hover:border-sky-300 hover:bg-sky-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-600">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] ${
                  msg.role === 'user'
                    ? 'rounded-2xl rounded-tr-sm bg-sky-600 px-4 py-2.5 text-sm text-white'
                    : 'rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800'
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                    <p className="text-xs font-semibold text-slate-500">
                      Cited feedback ({msg.citations.length}):
                    </p>
                    {msg.citations.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-lg border border-slate-100 bg-slate-50 p-2.5"
                      >
                        <p className="line-clamp-2 text-xs text-slate-600">{c.content}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <ChannelBadge channel={c.channel} showIcon={false} />
                          <SentimentBadge sentiment={c.sentiment} showIcon={false} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200">
                  <UserIcon className="h-5 w-5 text-slate-600" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-600">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 pt-4">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask LOOP about your feedback..."
            rows={1}
            className="min-h-[44px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
          />
          <Button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="bg-sky-600 hover:bg-sky-700"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
