import { useEffect, useRef, useState } from 'react';
import type { CurrentUser, Task } from '@/types/dashboard';
import { clientMutate } from '../action/(core)/clientMutate';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// 🎯 ১. ব্যাকএন্ড থেকে আসা রেসপন্সের টাইপ
interface CopilotApiResponse {
  success: boolean;
  reply?: string;
  message?: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  sender: 'assistant',
  content:
    'Hello! I am your AI Co-Pilot. I can help summarize progress, highlight blockers, or plan your next sprints. How can I assist you today?',
  timestamp: new Date(),
};

/**
 * ইউজার মেসেজ অনুযায়ী কোন টাস্কগুলো ব্যাকএন্ডে পাঠানো হবে তা ফিল্টার করা
 */
function preparePayload(text: string, tasks: Task[], currentUser: CurrentUser) {
  const lowerText = text.toLowerCase();

  // 🎯 ১. কারেন্ট ইউজারের Assigned Tasks বের করা
  const myTasks = tasks.filter((t) => {
    const assigneeId = typeof t.assignedTo === 'object' ? t.assignedTo?._id : t.assignedTo;
    return assigneeId === currentUser?._id;
  });

  // 🎯 ২. ক্রিটিক্যাল/ব্লকার সম্পর্কিত মেসেজ হলে শুধু Critical Tasks ফিল্টার করা
  const isCriticalQuery =
    lowerText.includes('block') ||
    lowerText.includes('critical') ||
    lowerText.includes('blockade');

  let filteredTasks = myTasks;

  if (isCriticalQuery) {
    filteredTasks = myTasks.filter(
      (t) => t.priority === 'Critical' && t.status !== 'Done'
    );
  }

  return {
    queryType: isCriticalQuery ? 'critical' : 'general_or_summary',
    tasksToSend: filteredTasks,
    totalMyTasksCount: myTasks.length,
  };
}

export function useAiCopilot(tasks: Task[], currentUser: CurrentUser) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    WELCOME_MESSAGE,
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiStreamingText, setAiStreamingText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, aiStreamingText, isAiTyping]);

  const sendMessage = async (text: string) => {
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

    // 🎯 ফিল্টার করা পেলোড রেডি করা
    const { queryType, tasksToSend, totalMyTasksCount } = preparePayload(
      text,
      tasks,
      currentUser
    );

    // ইউজারকে যদি কোনো টাস্ক অ্যাসাইন না করা থাকে
    if (totalMyTasksCount === 0) {
      setIsAiTyping(false);
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'assistant',
          content: 'You currently have no tasks assigned to you on this board.',
          timestamp: new Date(),
        },
      ]);
      return;
    }

    try {
      // 🚀 clientMutate ব্যবহার করে ব্যাকএন্ডে কল
      const requestObject = {
        message: text,
        queryType,
        tasks: tasksToSend,
        userId: currentUser?._id,
      };

      // 🎯 ২. Generic Type বা Type Assertion দিয়ে data অবজেক্টটি টাইপ-সেফ করা হলো
      const data = (await clientMutate(
        '/api/copilot',
        requestObject,
        'POST'
      )) as CopilotApiResponse;

      const responseText =
        data?.reply || 'Sorry, I could not process your request at this moment.';

      setIsAiTyping(false);

      // ✍️ টাইপিং/স্ট্রিমিং অ্যানিমেশন
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
    } catch (error: unknown) {
      // 🎯 ৩. catch ব্লকে 'any'-এর বদলে 'unknown' এবং সেফ এরর মেসেজ হ্যান্ডলিং
      console.error('Error fetching AI response:', error);
      setIsAiTyping(false);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while connecting to the AI assistant. Please try again.';

      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'assistant',
          content: errorMessage,
          timestamp: new Date(),
        },
      ]);
    }
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