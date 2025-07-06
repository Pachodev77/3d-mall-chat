import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'earnings' | 'system';
  read: boolean;
  timestamp: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New High-Paying Task Available',
      message: 'A new user research task worth $15.00 has been posted. Complete it before it expires!',
      type: 'task',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
    },
    {
      id: '2',
      title: 'Earnings Received',
      message: 'You\'ve earned $4.50 for completing the fitness app testing task.',
      type: 'earnings',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
    },
    {
      id: '3',
      title: 'Daily Bonus Available',
      message: 'Your daily bonus of $0.25 is ready to claim. Don\'t miss out!',
      type: 'system',
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 24 hours ago
    }
  ]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};