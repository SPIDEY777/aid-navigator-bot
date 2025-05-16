
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChat } from '@/contexts/ChatContext';
import { toast } from '@/components/ui/sonner';
import Header from '@/components/Header';
import { User } from '@/types';

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
  role: z.enum(["student", "parent"]),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useChat();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
  });
  
  function onLoginSubmit(data: z.infer<typeof loginSchema>) {
    // In a real app, this would authenticate with a backend service
    
    // For demo purposes, let's use hard-coded credentials
    if (data.email === "admin@example.com" && data.password === "admin123") {
      const user: User = {
        id: "admin",
        name: "Admin User",
        email: data.email,
        role: "admin",
      };
      setCurrentUser(user);
      toast.success("Welcome Admin!");
      navigate("/admin");
      return;
    }
    
    if (data.email === "student@example.com" && data.password === "password") {
      const user: User = {
        id: "student1",
        name: "Jane Smith",
        email: data.email,
        role: "student",
        profile: {
          education: "undergrad",
          age: 20,
          location: "Delhi",
          category: "general",
          income: "300000",
          interests: ["Engineering", "Technology"],
        },
      };
      setCurrentUser(user);
      toast.success("Welcome back, Jane!");
      navigate("/");
      return;
    }
    
    if (data.email === "parent@example.com" && data.password === "password") {
      const user: User = {
        id: "parent1",
        name: "John Doe",
        email: data.email,
        role: "parent",
      };
      setCurrentUser(user);
      toast.success("Welcome back, John!");
      navigate("/");
      return;
    }
    
    toast.error("Invalid email or password");
  }
  
  function onRegisterSubmit(data: z.infer<typeof registerSchema>) {
    // In a real app, this would create an account with a backend service
    
    // For demo purposes, let's set up a simple user
    const user: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role,
    };
    
    setCurrentUser(user);
    toast.success("Account created successfully!");
    navigate("/profile");
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your email and password to access your account.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-edu-blue-400 hover:bg-edu-blue-500">
                        Sign In
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <div className="text-sm text-muted-foreground">
                    <p>Demo Accounts:</p>
                    <p>student@example.com / password</p>
                    <p>parent@example.com / password</p>
                    <p>admin@example.com / admin123</p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Enter your details to create a new account.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>I am a</FormLabel>
                            <div className="flex gap-4">
                              <Button
                                type="button"
                                variant={field.value === 'student' ? 'default' : 'outline'}
                                className={field.value === 'student' ? 'bg-edu-blue-400 hover:bg-edu-blue-500' : ''}
                                onClick={() => registerForm.setValue('role', 'student')}
                              >
                                Student
                              </Button>
                              <Button
                                type="button"
                                variant={field.value === 'parent' ? 'default' : 'outline'}
                                className={field.value === 'parent' ? 'bg-edu-blue-400 hover:bg-edu-blue-500' : ''}
                                onClick={() => registerForm.setValue('role', 'parent')}
                              >
                                Parent
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-edu-blue-400 hover:bg-edu-blue-500">
                        Create Account
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Login;
