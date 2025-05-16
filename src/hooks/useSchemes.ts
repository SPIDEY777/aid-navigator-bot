
import { useState } from 'react';
import { Scheme } from '@/types';
import { toast } from '@/components/ui/sonner';
import { sampleSchemes } from '@/data/sampleSchemes';

export const useSchemes = (initialSchemes = sampleSchemes) => {
  const [schemes, setSchemes] = useState<Scheme[]>(initialSchemes);
  
  // Add a new scheme
  const addScheme = (scheme: Scheme) => {
    setSchemes(prev => [...prev, scheme]);
    toast.success("New scheme added successfully!");
  };
  
  // Update a scheme
  const updateScheme = (id: string, updatedScheme: Partial<Scheme>) => {
    setSchemes(prev => prev.map(scheme => 
      scheme.id === id ? { ...scheme, ...updatedScheme } : scheme
    ));
    toast.success("Scheme updated successfully!");
  };
  
  // Delete a scheme
  const deleteScheme = (id: string) => {
    setSchemes(prev => prev.filter(scheme => scheme.id !== id));
    toast.success("Scheme deleted successfully!");
  };

  return { schemes, addScheme, updateScheme, deleteScheme };
};
