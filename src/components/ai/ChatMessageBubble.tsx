import type { ChatMessage } from '../../lib/hooks/useAiCopilot';

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex flex-col max-w-[85%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
      <div
        className={`p-3 rounded-xl text-xs leading-relaxed ${
          isUser
            ? 'bg-[#06B6D4] text-[#0B0F19] font-medium rounded-tr-none shadow-md shadow-[#06B6D4]/10'
            : 'bg-[#0B0F19] text-[#F8FAFC] border border-slate-800 rounded-tl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      <span className="text-[9px] text-slate-500 mt-1">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 bg-[#0B0F19] border border-slate-800 p-3 rounded-xl rounded-tl-none w-20 justify-center">
      <span className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}