import { useEffect, useRef, useState } from 'react';
import type { Task } from '@/types/dashboard';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  sender: 'assistant',
  content:
    'Hello! I am your AI Co-Pilot. I can help summarize progress, highlight blockers, or plan your next sprints. How can I assist you today?',
  timestamp: new Date(),
};

/**
 * বর্তমানে board state এর উপর ভিত্তি করে locally একটা rule-based response
 * তৈরি করে। পরবর্তীতে এটা real LLM API কল দিয়ে replace করা যাবে —
 * বাকি UI (AiCopilotSidebar, ChatMessageBubble) touch করা লাগবে না।
 */
function generateResponse(text: string, tasks: Task[]): string {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('block') || lowerText.includes('critical') || lowerText.includes('blockade')) {
    const criticalTasks = tasks.filter((t) => t.priority === 'Critical' && t.status !== 'Done');
    if (criticalTasks.length > 0) {
      return `You currently have ${criticalTasks.length} critical active tasks. Highly recommend unblocking: ${criticalTasks
        .map((t) => `"${t.title}"`)
        .join(', ')}.`;
    }
    return 'Great news! There are no unresolved tasks designated with Critical priority on the board.';
  }

  if (lowerText.includes('progress') || lowerText.includes('summarize')) {
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const done = tasks.filter((t) => t.status === 'Done').length;
    const backlog = tasks.filter((t) => t.status === 'Backlog').length;
    const todo = tasks.filter((t) => t.status === 'Todo').length;
    return `Here is today's progress summary: ${done} completed, ${inProgress} in progress, ${todo} ready to start, and ${backlog} in backlog. Keep pushing!`;
  }

  return "I've analyzed the current board state. Let me know if you want to drill down into any specific task attributes or assignee workloads.";
}

export function useAiCopilot(tasks: Task[]) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiStreamingText, setAiStreamingText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, aiStreamingText, isAiTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isAiTyping) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsAiTyping(true);

    const responseText = generateResponse(text, tasks);

    setTimeout(() => {
      setIsAiTyping(false);
      let currentLength = 0;
      const interval = setInterval(() => {
        currentLength += Math.min(5, responseText.length - currentLength);
        setAiStreamingText(responseText.slice(0, currentLength));
        if (currentLength >= responseText.length) {
          clearInterval(interval);
          setChatMessages((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              sender: 'assistant',
              content: responseText,
              timestamp: new Date(),
            },
          ]);
          setAiStreamingText('');
        }
      }, 30);
    }, 1500);
  };

  return {
    chatMessages,
    chatInput,
    setChatInput,
    isAiTyping,
    aiStreamingText,
    chatEndRef,
    sendMessage,
  };
}