
import { Message } from '@/types';

// Simulate OpenAI API call as fallback
export const simulateOpenAIChatAPI = async (messages: any[]): Promise<string> => {
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

// OpenAI API integration via Supabase Edge Function
export const processWithOpenAI = async (message: string, messageHistory: Message[]): Promise<string> => {
  try {    
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
  }
};
