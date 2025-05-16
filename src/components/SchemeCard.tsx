
import React from 'react';
import { Scheme } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SchemeCardProps {
  scheme: Scheme;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  const daysUntilDeadline = Math.ceil(
    (new Date(scheme.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const isDeadlineSoon = daysUntilDeadline <= 30;
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{scheme.title}</CardTitle>
          <Badge variant={scheme.level === 'national' ? 'default' : 'outline'} className="capitalize">
            {scheme.level}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{scheme.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-edu-blue-400" />
            <span className={isDeadlineSoon ? 'font-medium text-edu-red' : ''}>
              Deadline: {new Date(scheme.deadline).toLocaleDateString()}
              {isDeadlineSoon && ` (${daysUntilDeadline} days left)`}
            </span>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <FileText className="h-4 w-4 mt-0.5 text-edu-blue-400" />
            <div>
              <span className="font-medium">Required Documents:</span>
              <ul className="list-disc list-inside ml-1">
                {scheme.documents.slice(0, 2).map((doc, index) => (
                  <li key={index} className="text-sm text-gray-600">{doc}</li>
                ))}
                {scheme.documents.length > 2 && (
                  <li className="text-sm text-gray-600">+{scheme.documents.length - 2} more</li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {scheme.category?.map((cat) => (
              <Badge key={cat} variant="outline" className="bg-edu-blue-100">
                {cat}
              </Badge>
            ))}
            <Badge variant="outline" className="bg-edu-yellow bg-opacity-20">
              {scheme.type}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-3">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/schemes/${scheme.id}`}>
            <Info className="h-4 w-4 mr-1" />
            Details
          </Link>
        </Button>
        <Button size="sm" className="bg-edu-blue-400 hover:bg-edu-blue-500" asChild>
          <a href={scheme.link} target="_blank" rel="noopener noreferrer">
            Apply Now
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SchemeCard;
