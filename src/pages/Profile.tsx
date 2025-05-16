
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/contexts/ChatContext';
import ProfileForm from '@/components/ProfileForm';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useChat();
  
  // Redirect to login if user is not logged in
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="bg-white rounded-lg shadow">
          <Tabs defaultValue="personal">
            <TabsList className="border-b px-6 pt-2">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal information to help us find the most suitable scholarships for you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how and when you want to receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about new scholarships and upcoming deadlines.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          id="email-notifications" 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="email-notifications" className="text-sm">Enabled</label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Deadline Reminders</h3>
                        <p className="text-sm text-muted-foreground">
                          Get reminders when scholarship deadlines are approaching.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          id="deadline-reminders" 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="deadline-reminders" className="text-sm">Enabled</label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">New Scholarship Alerts</h3>
                        <p className="text-sm text-muted-foreground">
                          Be notified when new scholarships matching your profile are added.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          id="new-scholarships" 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="new-scholarships" className="text-sm">Enabled</label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account details and password.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Email Address</h3>
                      <p className="text-sm">{currentUser.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Account Type</h3>
                      <p className="text-sm capitalize">{currentUser.role}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Change Password</h3>
                      <button className="text-sm text-edu-blue-500 hover:text-edu-blue-600">
                        Update password
                      </button>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1 text-red-500">Danger Zone</h3>
                      <button className="text-sm text-red-500 hover:text-red-600">
                        Delete account
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ScholarAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
