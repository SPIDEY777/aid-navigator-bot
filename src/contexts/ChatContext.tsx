
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '@/types';
import { ChatContextProps } from '@/types/chat';
import { useChatMessages } from '@/hooks/useChat';
import { useSchemes } from '@/hooks/useSchemes';
import { useNotifications } from '@/hooks/useNotifications';

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { schemes, addScheme, updateScheme, deleteScheme } = useSchemes();
  const { messages, addMessage, isTyping } = useChatMessages();
  const { notifications, markNotificationAsRead, unreadNotifications } = useNotifications(
    schemes,
    currentUser,
    [
      {
        id: '1',
        userId: '1',
        schemeId: '1',
        message: 'National Scholarship Portal Scholarships deadline is approaching (June 30, 2025)!',
        read: false,
        timestamp: new Date(),
      },
      {
        id: '2',
        userId: '1',
        schemeId: '2',
        message: 'Prime Minister\'s Research Fellowship deadline is approaching (April 15, 2025)!',
        read: false,
        timestamp: new Date(),
      }
    ]
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        isTyping,
        currentUser,
        setCurrentUser,
        schemes,
        addScheme,
        updateScheme,
        deleteScheme,
        notifications,
        markNotificationAsRead,
        unreadNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
