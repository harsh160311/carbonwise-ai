import { useState, useCallback } from 'react';
import type { CoachMessage, CarbonInput } from '../types';
import { sendChatMessage } from '../services/api';

export function useCoach() {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am your CarbonWise AI Sustainability Coach. Ask me about reducing your carbon footprint, understanding your impact, or getting personalized eco-tips!',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string, carbonData?: CarbonInput) => {
      const userMessage: CoachMessage = {
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await sendChatMessage(content, carbonData);
        const assistantMessage: CoachMessage = {
          role: 'assistant',
          content: response.message,
          timestamp: new Date(response.timestamp),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        const errorMessage: CoachMessage = {
          role: 'assistant',
          content:
            'Sorry, I encountered an error. Please try again or check your connection.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Hello! I am your CarbonWise AI Sustainability Coach. Ask me about reducing your carbon footprint, understanding your impact, or getting personalized eco-tips!',
        timestamp: new Date(),
      },
    ]);
  }, []);

  return { messages, isLoading, sendMessage, clearMessages };
}
