
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash, Plus } from 'lucide-react';
import { Scheme } from '@/types';

const schemeFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  eligibility: z.string().min(10, {
    message: "Eligibility criteria must be at least 10 characters.",
  }),
  deadline: z.string().refine(date => new Date(date) > new Date(), {
    message: "Deadline must be in the future.",
  }),
  link: z.string().url({
    message: "Please enter a valid URL.",
  }),
  documents: z.string().min(5, {
    message: "Documents must be at least 5 characters.",
  }),
  type: z.enum(["scholarship", "grant", "loan", "other"]),
  level: z.enum(["national", "state", "local"]),
  category: z.string().min(1, {
    message: "Please select at least one category.",
  }),
  minAge: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Minimum age must be a positive number.",
  }),
  maxAge: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Maximum age must be a positive number.",
  }),
  minIncome: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Minimum income must be a positive number.",
  }),
  maxIncome: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Maximum income must be a positive number.",
  }),
});

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, schemes, addScheme, updateScheme, deleteScheme } = useChat();
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Redirect if not an admin
  React.useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const form = useForm<z.infer<typeof schemeFormSchema>>({
    resolver: zodResolver(schemeFormSchema),
    defaultValues: {
      title: editingScheme?.title || "",
      description: editingScheme?.description || "",
      eligibility: editingScheme?.eligibility.join("\n") || "",
      deadline: editingScheme?.deadline.toISOString().split('T')[0] || "",
      link: editingScheme?.link || "",
      documents: editingScheme?.documents.join("\n") || "",
      type: editingScheme?.type || "scholarship",
      level: editingScheme?.level || "national",
      category: editingScheme?.category?.join(",") || "",
      minAge: editingScheme?.minAge?.toString() || "0",
      maxAge: editingScheme?.maxAge?.toString() || "0",
      minIncome: editingScheme?.minIncome?.toString() || "0",
      maxIncome: editingScheme?.maxIncome?.toString() || "0",
    },
  });
  
  // Reset form when editing scheme changes
  React.useEffect(() => {
    if (editingScheme) {
      form.reset({
        title: editingScheme.title,
        description: editingScheme.description,
        eligibility: editingScheme.eligibility.join("\n"),
        deadline: new Date(editingScheme.deadline).toISOString().split('T')[0],
        link: editingScheme.link,
        documents: editingScheme.documents.join("\n"),
        type: editingScheme.type,
        level: editingScheme.level,
        category: editingScheme.category?.join(",") || "",
        minAge: editingScheme.minAge?.toString(),
        maxAge: editingScheme.maxAge?.toString(),
        minIncome: editingScheme.minIncome?.toString(),
        maxIncome: editingScheme.maxIncome?.toString(),
      });
    } else {
      form.reset({
        title: "",
        description: "",
        eligibility: "",
        deadline: "",
        link: "",
        documents: "",
        type: "scholarship",
        level: "national",
        category: "",
        minAge: "0",
        maxAge: "0",
        minIncome: "0",
        maxIncome: "0",
      });
    }
  }, [editingScheme, form]);
  
  function onSubmit(data: z.infer<typeof schemeFormSchema>) {
    const newScheme: Scheme = {
      id: editingScheme?.id || Date.now().toString(),
      title: data.title,
      description: data.description,
      eligibility: data.eligibility.split("\n").filter(e => e.trim()),
      deadline: new Date(data.deadline),
      link: data.link,
      documents: data.documents.split("\n").filter(d => d.trim()),
      type: data.type,
      level: data.level,
      category: data.category.split(",").map(c => c.trim()),
      minAge: parseInt(data.minAge),
      maxAge: parseInt(data.maxAge),
      minIncome: parseInt(data.minIncome),
      maxIncome: parseInt(data.maxIncome),
    };
    
    if (editingScheme) {
      updateScheme(editingScheme.id, newScheme);
    } else {
      addScheme(newScheme);
    }
    
    setEditingScheme(null);
    setIsDialogOpen(false);
  }
  
  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-edu-blue-400 hover:bg-edu-blue-500">
                <Plus className="mr-2 h-4 w-4" />
                Add New Scheme
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingScheme ? 'Edit Scheme' : 'Add New Scheme'}</DialogTitle>
                <DialogDescription>
                  {editingScheme ? 'Edit the details of the existing scheme.' : 'Fill in the details to add a new scholarship or grant scheme.'}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Scholarship title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the scholarship" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="scholarship">Scholarship</SelectItem>
                              <SelectItem value="grant">Grant</SelectItem>
                              <SelectItem value="loan">Loan</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="national">National</SelectItem>
                              <SelectItem value="state">State</SelectItem>
                              <SelectItem value="local">Local</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application Deadline</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application Link</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/apply" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="eligibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Eligibility Criteria</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter each criterion on a new line" 
                            rows={4} 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Enter each eligibility criterion on a new line.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="documents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Documents</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter each document on a new line" 
                            rows={4} 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Enter each required document on a new line.
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
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <Input placeholder="General, SC, ST, OBC (comma separated)" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter categories separated by commas (e.g., General, SC, ST, OBC).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="minAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Age</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <FormField
                        control={form.control}
                        name="maxAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Age</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="minIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Income (INR)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <FormField
                        control={form.control}
                        name="maxIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Income (INR)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setEditingScheme(null);
                        setIsDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-edu-blue-400 hover:bg-edu-blue-500">
                      {editingScheme ? 'Update Scheme' : 'Add Scheme'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="schemes">
          <TabsList className="mb-4">
            <TabsTrigger value="schemes">Manage Schemes</TabsTrigger>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schemes">
            <Card>
              <CardHeader>
                <CardTitle>All Schemes</CardTitle>
                <CardDescription>Manage all scholarship and grant schemes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left p-3 border-b">Title</th>
                        <th className="text-left p-3 border-b">Type</th>
                        <th className="text-left p-3 border-b">Level</th>
                        <th className="text-left p-3 border-b">Deadline</th>
                        <th className="text-left p-3 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schemes.map(scheme => (
                        <tr key={scheme.id} className="hover:bg-gray-50">
                          <td className="p-3 border-b">{scheme.title}</td>
                          <td className="p-3 border-b capitalize">{scheme.type}</td>
                          <td className="p-3 border-b capitalize">{scheme.level}</td>
                          <td className="p-3 border-b">
                            {new Date(scheme.deadline).toLocaleDateString()}
                          </td>
                          <td className="p-3 border-b">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setEditingScheme(scheme);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => deleteScheme(scheme.id)}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      
                      {schemes.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-3 text-center text-gray-500">
                            No schemes found. Add a new scheme to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>This feature is coming soon.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p>User management functionality is under development.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>This feature is coming soon.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p>Analytics dashboard is under development.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ScholarAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
