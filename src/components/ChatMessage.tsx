
import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex items-start gap-3 mb-4 animate-message-appear',
        isUser ? 'flex-row-reverse' : ''
      )}
    >
      <Avatar className={cn(
        'h-8 w-8 rounded-full flex items-center justify-center',
        isUser ? 'bg-edu-blue-400' : 'bg-edu-green'
      )}>
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </Avatar>
      <Card className={cn(
        'max-w-[80%] shadow-sm',
        isUser ? 'bg-edu-blue-100' : 'bg-white'
      )}>
        <CardContent className="p-3">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatMessage;
