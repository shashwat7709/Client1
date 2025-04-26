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

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info', forAdmin: boolean = false) => {
    const newNotification: Notification = {
      id: String(Date.now()),
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      forAdmin
    };
    setNotifications(prev => [newNotification, ...prev]);
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