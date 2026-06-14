import { useEffect, useRef } from 'react';
import { useCoach } from '../hooks/useCoach';
import { useCarbonData } from '../hooks/useCarbonData';
import { ChatMessage } from '../components/coach/ChatMessage';
import { ChatInput } from '../components/coach/ChatInput';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function AICoach() {
  const { messages, isLoading, sendMessage, clearMessages } = useCoach();
  const { latestEntry } = useCarbonData();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            AI Sustainability Coach
          </h1>
          <p className="text-slate-500">
            Ask me anything about reducing your carbon footprint.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearMessages}>
          Clear Chat
        </Button>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div
          className="h-[500px] space-y-4 overflow-y-auto p-4"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: '0.1s' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          onSend={(message) => sendMessage(message, latestEntry?.input)}
          isLoading={isLoading}
        />
      </Card>

      {latestEntry && (
        <Card className="mt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <svg
                className="h-5 w-5 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                Using your latest carbon data
              </p>
              <p className="text-xs text-slate-400">
                Ask about your specific impact for personalized advice.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
