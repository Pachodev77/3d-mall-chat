import { useState, useEffect } from 'react';
import { earningsHistoryData } from '@/data/earningsData';

export const useEarnings = () => {
  const [totalEarnings, setTotalEarnings] = useState(158.75);
  const [weeklyEarnings, setWeeklyEarnings] = useState(32.25);
  const [monthlyEarnings, setMonthlyEarnings] = useState(87.50);
  const [availableBalance, setAvailableBalance] = useState(65.32);
  const [earningsHistory, setEarningsHistory] = useState(earningsHistoryData);
  
  // In a real app, these would be fetched from an API
  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setEarningsHistory(earningsHistoryData);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return {
    totalEarnings,
    weeklyEarnings,
    monthlyEarnings,
    availableBalance,
    earningsHistory,
  };
};