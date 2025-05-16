
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '@/contexts/ChatContext';
import { Skeleton } from '@/components/ui/skeleton';

const ChatContainer: React.FC = () => {
  const { messages, addMessage, isTyping } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or when typing status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full border rounded-lg shadow-sm overflow-hidden">
      <div className="bg-edu-blue-400 text-white py-3 px-4 rounded-t-lg">
        <h2 className="text-lg font-semibold">Scholarship Assistant</h2>
        <p className="text-xs text-blue-100">Powered by OpenAI</p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50 scrollbar-thin">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-edu-green flex items-center justify-center text-white">
              <BotIcon className="h-4 w-4" />
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm max-w-[80%]">
              <div className="flex space-x-2 items-center">
                <div className="h-2 w-2 bg-edu-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-edu-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="h-2 w-2 bg-edu-blue-300 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput 
        onSendMessage={(content) => addMessage(content, 'user')} 
        disabled={isTyping}
        placeholder="Ask me about scholarships..." 
      />
    </div>
  );
};

// Create a simple Bot icon component
const BotIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

export default ChatContainer;
