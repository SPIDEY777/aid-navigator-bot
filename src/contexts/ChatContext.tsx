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

  // OpenAI API integration via Supabase Edge Function
  const processWithOpenAI = async (message: string, messageHistory: Message[]): Promise<string> => {
    try {
      setIsTyping(true);
      
      // Prepare conversation history for OpenAI
      const conversationHistory = messageHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add system message to provide context about the app
      const systemMessage = {
        role: "system",
        content: `You are an AI assistant specialized in helping students and parents find and apply for scholarships, 
        grants, and financial aid programs. You have knowledge about eligibility criteria, application processes,
        required documents, and deadlines. Your goal is to provide personalized guidance based on the user's profile.
        
        Available scholarship information:
        1. National Scholarship Portal Scholarships - Deadline: June 30, 2025
           Eligibility: Indian citizen, Enrolled in recognized institution, Family income below 6 lakhs per annum
           Documents: Aadhaar card, Income certificate, Previous academic records
        
        2. Prime Minister's Research Fellowship (PMRF) - Deadline: April 15, 2025
           Eligibility: Master's degree with 60% marks, Selected through national-level test
           Documents: Master's degree certificate, Research proposal, Recommendation letters
        
        3. Central Sector Scheme of Scholarship - Deadline: July 31, 2025
           Eligibility: Top 20 percentile in 12th standard, Family income below 4.5 lakhs per annum
           Documents: 12th marksheet, Income certificate, College/university admission proof`
      };
      
      // Add user's new message
      const userMessage = {
        role: "user",
        content: message
      };
      
      // Combine all messages
      const apiMessages = [
        systemMessage,
        ...conversationHistory,
        userMessage
      ];
      
      try {
        // Call OpenAI API via Supabase Edge Function
        const response = await fetch('https://project-slug.supabase.co/functions/v1/chat-completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // No need for API key here as it's stored securely in Supabase
          },
          body: JSON.stringify({
            messages: apiMessages,
            model: 'gpt-4o', // Using GPT-4o for better responses
          }),
        });

        if (!response.ok) {
          throw new Error('Error connecting to AI service');
        }

        const data = await response.json();
        return data.message.content;
      } catch (error) {
        console.error('Error calling OpenAI API via Supabase:', error);
        // Fall back to simulated responses if the API call fails
        return await simulateOpenAIChatAPI(apiMessages);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
    } finally {
      setIsTyping(false);
    }
  };
  
  // Simulate OpenAI API call as fallback
  const simulateOpenAIChatAPI = async (messages: any[]): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Extract the last user message
    const userMessage = messages.find(msg => msg.role === "user")?.content || "";
    const contentLower = userMessage.toLowerCase();
    
    // Enhanced responses based on keywords (simulating AI behavior)
    if (contentLower.includes('hello') || contentLower.includes('hi') || contentLower.includes('hey')) {
      return "Hello! I'm your AI scholarship assistant. How can I help you find financial aid today?";
    }
    
    if (contentLower.includes('scholarship') || contentLower.includes('financial aid')) {
      return "Based on the information in our database, we have several scholarship options that might interest you. The National Scholarship Portal offers various scholarships with a deadline of June 30, 2025. For research scholars, the Prime Minister's Research Fellowship is available until April 15, 2025. To provide more personalized recommendations, could you share some details about your education level, location, and specific interests?";
    }
    
    if (contentLower.includes('deadline') || contentLower.includes('due date')) {
      return "I'm tracking several important deadlines for you. The National Scholarship Portal Scholarships are due by June 30, 2025. The Prime Minister's Research Fellowship applications close on April 15, 2025. The Central Sector Scheme of Scholarship has a deadline of July 31, 2025. I recommend setting up notifications so you don't miss these dates. Would you like me to help you set up reminders?";
    }
    
    if (contentLower.includes('eligibility') || contentLower.includes('qualify') || contentLower.includes('eligible')) {
      return "Eligibility requirements vary by scholarship program. For the National Scholarship Portal scholarships, you need to be an Indian citizen enrolled in a recognized institution with a family income below 6 lakhs per annum. The PMRF requires a Master's degree with at least 60% marks and selection through a national-level test. The Central Sector Scheme targets students in the top 20 percentile of their 12th standard with family income below 4.5 lakhs. Would you like me to check your eligibility for a specific scholarship?";
    }
    
    if (contentLower.includes('document') || contentLower.includes('require')) {
      return "Most scholarships require standard documentation. For the National Scholarship Portal, you'll need your Aadhaar card, income certificate, and previous academic records. The PMRF requires your Master's degree certificate, a research proposal, and recommendation letters. The Central Sector Scheme requires your 12th marksheet, income certificate, and college/university admission proof. I recommend gathering these documents early to avoid last-minute rushes. Is there a specific scholarship you're preparing documents for?";
    }
    
    if (contentLower.includes('profile') || contentLower.includes('information')) {
      return "Completing your profile helps me provide more accurate scholarship recommendations. Important details include your education level, age, location, category (SC/ST/OBC/General), family income, and academic interests. The more complete your profile, the better I can match you with suitable opportunities. Would you like to update your profile now?";
    }
    
    if (contentLower.includes('how') && contentLower.includes('apply')) {
      return "The application process typically involves creating an account on the scholarship portal, filling out personal and academic details, uploading required documents, and submitting the application before the deadline. For National Scholarship Portal scholarships, you'd need to register at scholarships.gov.in. For the PMRF, applications are processed through pmrf.in. I can provide step-by-step guidance for any specific scholarship you're interested in applying for.";
    }
    
    if (contentLower.includes('thank')) {
      return "You're welcome! I'm here to help you navigate the scholarship application process. If you have more questions in the future or need guidance on specific scholarships, feel free to ask. Good luck with your applications!";
    }
    
    // Default response for other queries
    return "I understand you're asking about " + userMessage + ". As your AI scholarship assistant, I'm here to help with all aspects of finding and applying for financial aid. Could you provide more specific details about what you're looking for, so I can give you the most relevant information?";
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
