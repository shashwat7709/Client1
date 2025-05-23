import React, { createContext, useContext, useState, useEffect } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: string;
  read: boolean;
  forAdmin: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: 'success' | 'error' | 'info', forAdmin?: boolean) => void;
  markAsRead: (id: string) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
  getUserNotifications: () => Notification[];
  getAdminNotifications: () => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const MAX_NOTIFICATIONS = 50; // Maximum number of notifications to keep
const NOTIFICATION_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        // Clean up old notifications on load
        const now = Date.now();
        return parsed
          .filter((n: Notification) => now - new Date(n.timestamp).getTime() < NOTIFICATION_TTL)
          .slice(0, MAX_NOTIFICATIONS);
      }
      return [];
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  });

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      // Filter out error notifications before saving to local storage
      const notificationsToSave = notifications.filter(n => n.type !== 'error');
      localStorage.setItem('notifications', JSON.stringify(notificationsToSave));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }, [notifications]);

  // Cleanup old notifications periodically
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      setNotifications(prev => 
        prev.filter(n => now - new Date(n.timestamp).getTime() < NOTIFICATION_TTL)
      );
    };

    const interval = setInterval(cleanup, 60000); // Run cleanup every minute
    return () => clearInterval(interval);
  }, []);

  const addNotification = (message: string, type: 'success' | 'error' | 'info', forAdmin: boolean = false) => {
    console.log('addNotification called with:', { message, type, forAdmin }); // Log notification details
    setNotifications(prev => {
      // Remove duplicate error messages that occurred in the last minute
      const now = Date.now();
      const recentDuplicates = prev.filter(n => 
        n.message === message && 
        n.type === type && 
        now - new Date(n.timestamp).getTime() < 60000
      );

      if (recentDuplicates.length > 0) {
        return prev; // Don't add duplicate notifications
      }

      const newNotification: Notification = {
        id: String(Date.now()),
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false,
        forAdmin
      };

      // Keep only the most recent notifications up to MAX_NOTIFICATIONS
      return [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS);
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getUserNotifications = () => {
    return notifications.filter(n => !n.forAdmin);
  };

  const getAdminNotifications = () => {
    return notifications.filter(n => n.forAdmin);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      clearNotification,
      clearAllNotifications,
      unreadCount,
      getUserNotifications,
      getAdminNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}; 