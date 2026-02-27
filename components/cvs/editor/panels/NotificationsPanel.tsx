// components/editor/panels/NotificationsPanel.tsx (تعديل لوحة الإشعارات لتظهر فقط عند الضغط على زر الإشعارات)
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';

interface NotificationsPanelProps {
  show: boolean;
  notifications: Array<{ id: number; text: string; type: string; read: boolean }>;
  unreadCount: number;
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsPanel = ({
  show,
  notifications,
  unreadCount,
  onClose,
  onMarkAllAsRead,
}: NotificationsPanelProps) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* خلفية معتمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
            onClick={onClose}
          />
          
          {/* لوحة الإشعارات */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-[100]"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">الإشعارات</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={onMarkAllAsRead} 
                    className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                  >
                    تحديد الكل كمقروء
                  </button>
                )}
                <button 
                  onClick={onClose} 
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell size={32} className="mx-auto mb-2 opacity-50" />
                  <p>لا توجد إشعارات</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer ${
                      !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {notification.type === 'success' && (
                        <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                        </div>
                      )}
                      {notification.type === 'error' && (
                        <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
                        </div>
                      )}
                      {notification.type === 'info' && (
                        <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{notification.text}</p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};