
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NotificationBell from './NotificationBell';
import { useChat } from '@/contexts/ChatContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/ui/avatar';
import { User, LogOut, Settings, UserPlus } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, setCurrentUser } = useChat();

  return (
    <header className="bg-white shadow-sm border-b py-3 px-6">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-edu-blue-400 text-white rounded-md p-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M2 3h20"></path>
              <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path>
              <path d="m9 14 3-3 3 3"></path>
            </svg>
          </div>
          <span className="font-bold text-xl">ScholarAI</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav>
            <ul className="flex items-center gap-4">
              <li><Link to="/" className="text-sm font-medium hover:text-edu-blue-500">Home</Link></li>
              <li><Link to="/schemes" className="text-sm font-medium hover:text-edu-blue-500">Schemes</Link></li>
              <li><Link to="/profile" className="text-sm font-medium hover:text-edu-blue-500">Profile</Link></li>
              {currentUser?.role === 'admin' && (
                <li><Link to="/admin" className="text-sm font-medium hover:text-edu-blue-500">Admin</Link></li>
              )}
            </ul>
          </nav>

          <NotificationBell />

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 bg-edu-blue-300">
                    <User className="h-4 w-4 text-white" />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setCurrentUser(null)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button className="flex items-center gap-2 bg-edu-blue-400 hover:bg-edu-blue-500">
                <UserPlus className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
