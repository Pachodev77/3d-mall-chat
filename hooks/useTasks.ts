import { useState, useEffect } from 'react';
import { taskData } from '@/data/taskData';

export const useTasks = () => {
  const [featuredTasks, setFeaturedTasks] = useState(taskData.filter(task => task.featured));
  const [allTasks, setAllTasks] = useState(taskData);
  
  // In a real app, these would be fetched from an API
  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setFeaturedTasks(taskData.filter(task => task.featured));
      setAllTasks(taskData);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return {
    featuredTasks,
    allTasks,
  };
};