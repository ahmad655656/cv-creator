// components/editor/hooks/useEditorNotifications.ts
import { useState, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: number;
  text: string;
  type: NotificationType;
  read: boolean;
}

export const useEditorNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: 'تم حفظ التغييرات بنجاح', type: 'success', read: false },
    { id: 2, text: 'نصيحة: استخدم الكلمات المفتاحية المناسبة', type: 'info', read: false },
  ]);

  const showNotification = useCallback((text: string, type: NotificationType = 'info') => {
    const newNotification = {
      id: Date.now(),
      text,
      type,
      read: false
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 5));
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 3000);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    showNotification,
    markAllAsRead,
  };
};