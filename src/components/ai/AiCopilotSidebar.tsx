import { motion } from 'motion/react';
import { MotionButton } from '@/components/shared/MotionWrapper';
import type { Task } from '@/types/dashboard';
import { useAiCopilot } from '../../lib/hooks/useAiCopilot';
import { ChatMessageBubble, TypingIndicator } from './ChatMessageBubble';

interface AiCopilotSidebarProps {
  tasks: Task[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AiCopilotSidebar({ tasks, isOpen, onOpenChange }: AiCopilotSidebarProps) {
  const { chatMessages, chatInput, setChatInput, isAiTyping, aiStreamingText, chatEndRef, sendMessage } =
    useAiCopilot(tasks);

  return (
    <div
      className={`transition-all duration-300 ${
        isOpen ? 'w-full lg:w-1/4' : 'w-10'
      } shrink-0 relative flex flex-col border border-slate-800/80 bg-[#1E293B]/70 rounded-2xl overflow-hidden backdrop-blur-md h-full`}
    >
      {isOpen ? (
        <div className="flex flex-col h-full w-full overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#1E293B] shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
              <span className="text-xs font-bold text-[#F8FAFC] tracking-wider uppercase">AI Co-Pilot</span>
            </div>
            <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
            {chatMessages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}

            {aiStreamingText && (
              <div className="flex flex-col max-w-[85%] mr-auto items-start">
                <div className="p-3 bg-[#0B0F19] text-[#F8FAFC] border border-slate-800 rounded-xl rounded-tl-none text-xs leading-relaxed">
                  <p className="whitespace-pre-wrap">{aiStreamingText}</p>
                </div>
                <span className="text-[9px] text-[#06B6D4] mt-1 font-semibold">Streaming...</span>
              </div>
            )}

            {isAiTyping && <TypingIndicator />}

            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-slate-800 p-3 space-y-3 bg-[#1E293B]/90 shrink-0">
            <div className="flex flex-wrap gap-1.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => sendMessage('What are my critical blockades?')}
                className="text-[9px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded bg-[#0B0F19] border border-slate-800 hover:border-[#06B6D4] transition-colors cursor-pointer"
              >
                Show critical blockades
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => sendMessage("Summarize today's progress")}
                className="text-[9px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded bg-[#0B0F19] border border-slate-800 hover:border-[#06B6D4] transition-colors cursor-pointer"
              >
                Summarize progress
              </motion.button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(chatInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask co-pilot..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-[#0B0F19] border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-[#06B6D4]"
              />
              <MotionButton
                id="copilot-send-btn"
                type="submit"
                disabled={!chatInput.trim() || isAiTyping}
                className="bg-[#06B6D4] hover:bg-[#06B6D4]/80 disabled:bg-slate-800 disabled:text-slate-600 text-[#0B0F19] font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 cursor-pointer"
              >
                Send
              </MotionButton>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => onOpenChange(true)}
          className="w-full h-full flex items-center justify-center text-slate-400 hover:text-white p-2 cursor-pointer"
          title="Open AI Co-Pilot"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}