
import React from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { useChat } from '@/contexts/ChatContext';
import { Link } from 'react-router-dom';
import { SearchIcon, CalendarIcon, BellIcon, CheckIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChatContainer from '@/components/ChatContainer';

const Index: React.FC = () => {
  const { currentUser, schemes } = useChat();
  
  // Count upcoming deadlines in the next 30 days
  const upcomingDeadlinesCount = schemes.filter(scheme => {
    const daysUntil = Math.ceil(
      (new Date(scheme.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil > 0 && daysUntil <= 30;
  }).length;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto py-8 px-4">
        {!currentUser ? (
          <div className="flex flex-col md:flex-row items-center gap-12 py-16">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Find the Perfect <span className="text-edu-blue-500">Scholarships</span> for Your Future
              </h1>
              
              <p className="text-lg text-gray-600">
                Our AI assistant helps students and parents navigate government schemes, scholarships, 
                and financial aid programs with personalized guidance.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <Link to="/login">
                  <Button className="bg-edu-blue-400 hover:bg-edu-blue-500">Get Started</Button>
                </Link>
                <Link to="/schemes">
                  <Button variant="outline">Browse Schemes</Button>
                </Link>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <div className="flex items-center gap-2">
                  <div className="bg-edu-blue-100 p-1.5 rounded-full">
                    <CheckIcon className="h-4 w-4 text-edu-blue-500" />
                  </div>
                  <span className="text-sm">Personalized Recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-edu-blue-100 p-1.5 rounded-full">
                    <CheckIcon className="h-4 w-4 text-edu-blue-500" />
                  </div>
                  <span className="text-sm">Deadline Reminders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-edu-blue-100 p-1.5 rounded-full">
                    <CheckIcon className="h-4 w-4 text-edu-blue-500" />
                  </div>
                  <span className="text-sm">Application Guidance</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 border rounded-lg shadow-lg overflow-hidden h-[500px] w-full">
              <div className="bg-edu-blue-400 text-white py-3 px-4">
                <h2 className="text-lg font-semibold">Scholarship Assistant Preview</h2>
              </div>
              <div className="p-4 h-[calc(500px-64px)] overflow-y-auto bg-gray-50">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-edu-green flex items-center justify-center">
                    <BellIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                    <p className="text-sm">Hello! I'm your Scholarship Assistant. I can help you find and apply for scholarships, grants, and financial aid programs.</p>
                    <div className="text-xs text-gray-400 mt-1">10:30 AM</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-4 flex-row-reverse">
                  <div className="h-8 w-8 rounded-full bg-edu-blue-400 flex items-center justify-center">
                    <SearchIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-edu-blue-100 p-3 rounded-lg shadow-sm max-w-[80%]">
                    <p className="text-sm">I'm looking for scholarships for engineering students from OBC category.</p>
                    <div className="text-xs text-gray-400 mt-1">10:31 AM</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-edu-green flex items-center justify-center">
                    <BellIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                    <p className="text-sm">I can help you with that! Are you currently enrolled in an engineering program or planning to apply? Also, what's your approximate annual family income?</p>
                    <div className="text-xs text-gray-400 mt-1">10:31 AM</div>
                  </div>
                </div>
              </div>
              <div className="border-t p-3 flex items-center gap-2 bg-white">
                <input 
                  type="text" 
                  placeholder="Sign in to start chatting..." 
                  className="flex-1 p-2 border rounded-md bg-gray-50" 
                  disabled 
                />
                <Button size="icon" disabled>
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-2xl font-bold">
                Welcome back, {currentUser.name.split(' ')[0]}!
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Available Schemes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{schemes.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Scholarships and grants
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Upcoming Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{upcomingDeadlinesCount}</div>
                    <p className="text-xs text-muted-foreground">
                      In the next 30 days
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Profile Completion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {currentUser.profile ? '80%' : '20%'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Complete your profile for better matches
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-edu-blue-500" />
                      Upcoming Deadlines
                    </CardTitle>
                    <CardDescription>
                      Don't miss these important dates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {schemes
                      .filter(scheme => {
                        const daysUntil = Math.ceil(
                          (new Date(scheme.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                        );
                        return daysUntil > 0 && daysUntil <= 30;
                      })
                      .slice(0, 3)
                      .map(scheme => (
                        <div key={scheme.id} className="flex items-center justify-between mb-3 last:mb-0">
                          <div>
                            <div className="font-medium">{scheme.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(scheme.deadline).toLocaleDateString()}
                            </div>
                          </div>
                          <Link to={`/schemes/${scheme.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      ))}
                    {upcomingDeadlinesCount === 0 && (
                      <div className="text-sm text-muted-foreground">
                        No upcoming deadlines in the next 30 days.
                      </div>
                    )}
                    {upcomingDeadlinesCount > 3 && (
                      <div className="mt-3 text-center">
                        <Link to="/schemes">
                          <Button variant="link" size="sm">
                            View all deadlines
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckIcon className="h-5 w-5 text-edu-blue-500" />
                      Recommended Next Steps
                    </CardTitle>
                    <CardDescription>
                      Improve your chances of success
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {!currentUser.profile && (
                        <li className="flex justify-between items-center">
                          <span className="text-sm">Complete your profile</span>
                          <Link to="/profile">
                            <Button variant="outline" size="sm">
                              Update
                            </Button>
                          </Link>
                        </li>
                      )}
                      <li className="flex justify-between items-center">
                        <span className="text-sm">Check eligibility for schemes</span>
                        <Link to="/schemes">
                          <Button variant="outline" size="sm">
                            Explore
                          </Button>
                        </Link>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-sm">Ask the AI assistant for personalized advice</span>
                        <Button variant="outline" size="sm" onClick={() => document.querySelector('.chat-container')?.scrollIntoView({ behavior: 'smooth' })}>
                          Chat
                        </Button>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="chat-container">
              <ChatContainer />
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ScholarAI. All rights reserved.</p>
          <p className="mt-1">Helping students find and apply for the perfect scholarships.</p>
        </div>
      </footer>
    </div>
  );
};

// Manually define SendIcon since it's not in our allowed lucide-react icons list
const SendIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export default Index;
