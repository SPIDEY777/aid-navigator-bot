
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useChat } from '@/contexts/ChatContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, CircleDollarSign, FileText, ExternalLink, ChevronLeft } from 'lucide-react';

const SchemeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { schemes } = useChat();
  
  const scheme = schemes.find(s => s.id === id);
  
  if (!scheme) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container max-w-4xl mx-auto py-8 px-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Scheme Not Found</h1>
            <p className="text-gray-600 mb-6">The scholarship or scheme you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/schemes')}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Schemes
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  const daysUntilDeadline = Math.ceil(
    (new Date(scheme.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const isDeadlineSoon = daysUntilDeadline <= 30 && daysUntilDeadline > 0;
  const isDeadlinePassed = daysUntilDeadline < 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/schemes')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Schemes
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={scheme.level === 'national' ? 'default' : 'outline'} className="capitalize">
                    {scheme.level}
                  </Badge>
                  <Badge variant="outline" className="capitalize bg-edu-yellow bg-opacity-20">
                    {scheme.type}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold">{scheme.title}</h1>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button className="bg-edu-blue-400 hover:bg-edu-blue-500" asChild>
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Apply Now
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">{scheme.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Deadline Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-edu-blue-400" />
                    <div>
                      <div className="font-medium">Application Deadline</div>
                      <div className={`text-sm ${isDeadlineSoon && !isDeadlinePassed ? 'text-edu-red font-medium' : isDeadlinePassed ? 'text-gray-500' : ''}`}>
                        {new Date(scheme.deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        {isDeadlineSoon && !isDeadlinePassed && ` (${daysUntilDeadline} days left)`}
                        {isDeadlinePassed && ' (Passed)'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Eligibility Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-edu-blue-400" />
                    <div>
                      <div className="font-medium">Categories</div>
                      <div className="text-sm">
                        {scheme.category?.join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-edu-blue-400" />
                    <div>
                      <div className="font-medium">Age Range</div>
                      <div className="text-sm">
                        {scheme.minAge} to {scheme.maxAge} years
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CircleDollarSign className="h-5 w-5 text-edu-blue-400" />
                    <div>
                      <div className="font-medium">Income Criteria</div>
                      <div className="text-sm">
                        Up to ₹{(scheme.maxIncome / 100000).toFixed(1)} Lakhs per annum
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Eligibility Criteria</h2>
              <ul className="list-disc list-inside space-y-2">
                {scheme.eligibility.map((criterion, index) => (
                  <li key={index} className="text-gray-700">{criterion}</li>
                ))}
              </ul>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Required Documents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scheme.documents.map((document, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-edu-blue-400" />
                    <span>{document}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 border-t">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h3 className="font-medium mb-1">Need Help?</h3>
                <p className="text-sm text-gray-600">Ask our AI assistant for guidance with the application process.</p>
              </div>
              <Link to="/" className="block">
                <Button variant="outline">Chat with Assistant</Button>
              </Link>
            </div>
          </div>
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

export default SchemeDetail;
