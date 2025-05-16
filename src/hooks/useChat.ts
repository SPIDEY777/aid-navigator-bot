
import { useState } from 'react';
import { Message } from '@/types';
import { processWithOpenAI } from '@/services/aiService';

export const useChatMessages = (initialMessages: Message[] = []) => {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0 ? initialMessages : [
      {
        id: '1',
        content: 'Hello! I\'m your Scholarship Assistant. I can help you find and apply for scholarships, grants, and financial aid programs. What would you like to know?',
        role: 'assistant',
        timestamp: new Date(),
      },
    ]
  );
  const [isTyping, setIsTyping] = useState(false);

  // Add a message to the chat
  const addMessage = async (content: string, role: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (role === 'user') {
      // Set typing state to true when starting AI processing
      setIsTyping(true);
      
      // Process with OpenAI and get response
      const aiResponse = await processWithOpenAI(content, messages);
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Set typing state to false when AI processing is complete
      setIsTyping(false);
    }
  };

  return { messages, addMessage, isTyping };
};
