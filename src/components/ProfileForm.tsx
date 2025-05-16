
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChat } from '@/contexts/ChatContext';
import { UserProfile, User } from '@/types';
import { toast } from '@/components/ui/sonner';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  education: z.string().min(1, {
    message: "Please select your education level.",
  }),
  age: z.string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Age must be a number.",
    })
    .refine((val) => Number(val) >= 10 && Number(val) <= 100, {
      message: "Age must be between 10 and 100.",
    }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select your category.",
  }),
  income: z.string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Income must be a number.",
    }),
});

const ProfileForm: React.FC = () => {
  const { currentUser, setCurrentUser } = useChat();
  
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      education: currentUser?.profile?.education || "",
      age: currentUser?.profile?.age?.toString() || "",
      location: currentUser?.profile?.location || "",
      category: currentUser?.profile?.category || "",
      income: currentUser?.profile?.income || "",
    },
  });
  
  function onSubmit(data: z.infer<typeof profileFormSchema>) {
    const profile: UserProfile = {
      education: data.education,
      age: Number(data.age),
      location: data.location,
      category: data.category,
      income: data.income,
      interests: currentUser?.profile?.interests || [],
    };
    
    const updatedUser: User = {
      id: currentUser?.id || '1',
      name: data.name,
      email: data.email,
      role: currentUser?.role || 'student',
      profile,
    };
    
    setCurrentUser(updatedUser);
    toast.success("Profile updated successfully!");
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="undergrad">Undergraduate</SelectItem>
                    <SelectItem value="postgrad">Postgraduate</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input placeholder="Your age" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="State/City" {...field} />
                </FormControl>
                <FormDescription>
                  Your state or city of residence.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="sc">SC</SelectItem>
                    <SelectItem value="st">ST</SelectItem>
                    <SelectItem value="obc">OBC</SelectItem>
                    <SelectItem value="ews">EWS</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Family Income</FormLabel>
                <FormControl>
                  <Input placeholder="Annual family income in INR" {...field} />
                </FormControl>
                <FormDescription>
                  Enter approximate annual family income.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="bg-edu-blue-400 hover:bg-edu-blue-500">
          Save Profile
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
