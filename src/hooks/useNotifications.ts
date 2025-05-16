
import { useState, useEffect } from 'react';
import { Notification, Scheme, User } from '@/types';

export const useNotifications = (
  schemes: Scheme[], 
  currentUser: User | null, 
  initialNotifications: Notification[] = []
) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Mark notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Calculate unread notifications
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Check for scheme deadlines and create notifications
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

  return { notifications, markNotificationAsRead, unreadNotifications, setNotifications };
};
