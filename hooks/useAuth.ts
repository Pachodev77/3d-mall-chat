import { useState, useEffect } from 'react';
import { router } from 'expo-router';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  membershipLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    membershipLevel: 'Gold'
  });
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        name: 'Alex Johnson',
        email,
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        membershipLevel: 'Gold'
      });
      router.replace('/');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(null);
      router.replace('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    signIn,
    signOut
  };
};