
import { Message, User, Scheme, Notification } from './index';

export interface ChatContextProps {
  messages: Message[];
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  isTyping: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  schemes: Scheme[];
  addScheme: (scheme: Scheme) => void;
  updateScheme: (id: string, scheme: Partial<Scheme>) => void;
  deleteScheme: (id: string) => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  unreadNotifications: number;
}
