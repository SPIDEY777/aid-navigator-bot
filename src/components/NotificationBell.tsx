
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

const NotificationBell: React.FC = () => {
  const { notifications, markNotificationAsRead, unreadNotifications } = useChat();
  const [open, setOpen] = useState(false);

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-edu-red rounded-full h-5 w-5 text-xs flex items-center justify-center text-white">
              {unreadNotifications}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <div className="font-medium">Notifications</div>
          <div className="text-sm text-muted-foreground">
            Stay updated with deadline reminders
          </div>
        </div>
        <Separator />
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`m-2 cursor-pointer transition-colors ${
                  notification.read ? 'bg-background' : 'bg-edu-blue-100'
                }`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <CardContent className="p-3">
                  <div className="text-sm">{notification.message}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="p-4 text-sm text-center text-muted-foreground">
              No notifications yet
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
