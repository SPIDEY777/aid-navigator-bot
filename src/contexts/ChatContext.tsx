
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Message, User, Scheme, Notification } from '@/types';
import { toast } from '@/components/ui/sonner';

// Sample schemes data
const sampleSchemes: Scheme[] = [
  {
    id: '1',
    title: 'National Scholarship Portal Scholarships',
    description: 'Various scholarships offered by the central government for students.',
    eligibility: ['Indian citizen', 'Enrolled in recognized institution', 'Family income below 6 lakhs per annum'],
    deadline: new Date(2025, 5, 30),
    link: 'https://scholarships.gov.in',
    documents: ['Aadhaar card', 'Income certificate', 'Previous academic records'],
    type: 'scholarship',
    level: 'national',
    category: ['General', 'SC', 'ST', 'OBC'],
    minAge: 16,
    maxAge: 32,
    minIncome: 0,
    maxIncome: 600000,
  },
  {
    id: '2',
    title: 'Prime Minister\'s Research Fellowship (PMRF)',
    description: 'Fellowship for doctoral studies in IITs, IISERs and other premier institutions.',
    eligibility: ['Master\'s degree with 60% marks', 'Selected through national-level test'],
    deadline: new Date(2025, 3, 15),
    link: 'https://pmrf.in',
    documents: ['Master\'s degree certificate', 'Research proposal', 'Recommendation letters'],
    type: 'scholarship',
    level: 'national',
    category: ['General', 'SC', 'ST', 'OBC'],
    minAge: 21,
    maxAge: 35,
    minIncome: 0,
    maxIncome: 1800000,
  },
  {
    id: '3',
    title: 'Central Sector Scheme of Scholarship',
    description: 'Scholarships for college and university students based on merit.',
    eligibility: ['Top 20 percentile in 12th standard', 'Family income below 4.5 lakhs per annum'],
    deadline: new Date(2025, 7, 31),
    link: 'https://scholarships.gov.in',
    documents: ['12th marksheet', 'Income certificate', 'College/university admission proof'],
    type: 'scholarship',
    level: 'national',
    category: ['General', 'SC', 'ST', 'OBC'],
    minAge: 17,
    maxAge: 25,
    minIncome: 0,
    maxIncome: 450000,
  }
];

interface ChatContextProps {
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

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your Scholarship Assistant. I can help you find and apply for scholarships, grants, and financial aid programs. What would you like to know?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>(sampleSchemes);
  const [notifications, setNotifications] = useState<Notification[]>([
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
  ]);

  // Calculate unread notifications
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Process the user's message and generate a response
  const processMessage = async (content: string): Promise<string> => {
    setIsTyping(true);
    try {
      // This simulates an AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple response logic based on keywords
      const contentLower = content.toLowerCase();
      
      if (contentLower.includes('hello') || contentLower.includes('hi') || contentLower.includes('hey')) {
        return "Hello! How can I assist you with finding scholarships or financial aid today?";
      }
      
      if (contentLower.includes('scholarship') || contentLower.includes('financial aid')) {
        return "I can help you find scholarships and financial aid! To provide personalized recommendations, could you tell me a bit about yourself? For example, your education level, location, and any specific areas of interest.";
      }
      
      if (contentLower.includes('deadline') || contentLower.includes('due date')) {
        return "Keeping track of deadlines is important! I can help you with that. The National Scholarship Portal Scholarships deadline is June 30, 2025. The Prime Minister's Research Fellowship deadline is April 15, 2025. Would you like to set up notifications for these deadlines?";
      }
      
      if (contentLower.includes('eligibility') || contentLower.includes('qualify') || contentLower.includes('eligible')) {
        return "Eligibility criteria vary by scholarship. Common factors include academic performance, family income, age, and sometimes specific categories like SC/ST/OBC. Would you like me to check your eligibility for specific scholarships?";
      }
      
      if (contentLower.includes('document') || contentLower.includes('require')) {
        return "Most scholarships require documents such as ID proof (Aadhaar card), income certificate, previous academic records, and admission proof. Specific scholarships may have additional requirements. Which scholarship are you interested in?";
      }
      
      if (contentLower.includes('profile') || contentLower.includes('information')) {
        return "Setting up your profile helps me provide personalized scholarship recommendations. You can add details like your education level, age, location, category (SC/ST/OBC/General), family income, and areas of interest.";
      }
      
      return "I'm here to help you find the right scholarships and guide you through the application process. Could you please provide more details about what you're looking for?";
    } finally {
      setIsTyping(false);
    }
  };

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
      // Process user message and get response
      const response = await processMessage(content);
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }
  };
  
  // Add a new scheme
  const addScheme = (scheme: Scheme) => {
    setSchemes(prev => [...prev, scheme]);
    toast.success("New scheme added successfully!");
    
    // Create a notification for the new scheme
    const newNotification: Notification = {
      id: Date.now().toString(),
      userId: currentUser?.id || '1',
      schemeId: scheme.id,
      message: `New scholarship available: ${scheme.title}`,
      read: false,
      timestamp: new Date(),
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };
  
  // Update a scheme
  const updateScheme = (id: string, updatedScheme: Partial<Scheme>) => {
    setSchemes(prev => prev.map(scheme => 
      scheme.id === id ? { ...scheme, ...updatedScheme } : scheme
    ));
    toast.success("Scheme updated successfully!");
  };
  
  // Delete a scheme
  const deleteScheme = (id: string) => {
    setSchemes(prev => prev.filter(scheme => scheme.id !== id));
    toast.success("Scheme deleted successfully!");
  };
  
  // Mark notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  // Check for scheme deadlines and create notifications (this would run daily in a real app)
  useEffect(() => {
    const checkDeadlines = () => {
      const today = new Date();
      schemes.forEach(scheme => {
        // Check if deadline is within the next 30 days
        const deadline = new Date(scheme.deadline);
        const daysToDeadline = Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysToDeadline <= 30 && daysToDeadline >= 0) {
          // Check if a notification already exists for this deadline
          const notificationExists = notifications.some(
            n => n.schemeId === scheme.id && n.message.includes('deadline')
          );
          
          // If no notification exists, create one
          if (!notificationExists) {
            const newNotification: Notification = {
              id: Date.now().toString(),
              userId: currentUser?.id || '1',
              schemeId: scheme.id,
              message: `${scheme.title} deadline is approaching (${deadline.toLocaleDateString()})!`,
              read: false,
              timestamp: new Date(),
            };
            
            setNotifications(prev => [...prev, newNotification]);
          }
        }
      });
    };
    
    // In a real app, this would be on a schedule
    checkDeadlines();
    
    // For demo purposes, we'll also check when schemes are updated
    const interval = setInterval(checkDeadlines, 60000 * 60); // Check every hour
    
    return () => clearInterval(interval);
  }, [schemes, currentUser, notifications]);

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
