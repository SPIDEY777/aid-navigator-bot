
import { Scheme } from '@/types';

// Sample schemes data
export const sampleSchemes: Scheme[] = [
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
