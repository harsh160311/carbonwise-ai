import type { CoachMessage as CoachMessageType } from '../../types';
import { formatDate } from '../../utils/format';

interface ChatMessageProps {
  message: CoachMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}
      role="listitem"
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-emerald-500 text-white'
            : 'border border-slate-200 bg-white text-slate-700'
        }`}
      >
        {!isUser && (
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
              <svg
                className="h-3 w-3 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xs font-medium text-emerald-600">
              AI Coach
            </span>
          </div>
        )}
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </p>
        <p
          className={`mt-1 text-right text-xs ${
            isUser ? 'text-emerald-100' : 'text-slate-400'
          }`}
        >
          {formatDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
