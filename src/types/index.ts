
export type UserRole = 'student' | 'parent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profile?: UserProfile;
}

export interface UserProfile {
  education?: string;
  age?: number;
  location?: string;
  category?: string; // SC, ST, OBC, General, etc.
  income?: string;
  interests?: string[];
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Scheme {
  id: string;
  title: string;
  description: string;
  eligibility: string[];
  deadline: Date;
  link: string;
  documents: string[];
  type: 'scholarship' | 'grant' | 'loan' | 'other';
  level: 'national' | 'state' | 'local';
  category?: string[]; // SC, ST, OBC, General, etc.
  minAge?: number;
  maxAge?: number;
  minIncome?: number;
  maxIncome?: number;
}

export interface Notification {
  id: string;
  userId: string;
  schemeId: string;
  message: string;
  read: boolean;
  timestamp: Date;
}
