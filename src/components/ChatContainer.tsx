
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '@/contexts/ChatContext';
import { Bot } from 'lucide-react';

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
              <Bot className="h-4 w-4" />
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

export default ChatContainer;
