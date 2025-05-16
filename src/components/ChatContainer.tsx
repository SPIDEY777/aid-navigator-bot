
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
        <p className="text-xs text-blue-100">Powered by AI</p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50 scrollbar-thin">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3 mb-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-10 w-64 rounded-md" />
              <Skeleton className="h-4 w-20 mt-1" />
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

export default ChatContainer;
