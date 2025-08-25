import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Notification } from '../../types';
import { Bell, X, Clock, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const { currentUser } = useAuth();

  useEffect(() => {
    loadNotifications();
  }, [currentUser]);

  const loadNotifications = () => {
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const userNotifications = allNotifications
      .filter((n: Notification) => n.userId === currentUser?.id)
      .sort((a: Notification, b: Notification) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setNotifications(userNotifications);
  };

  const updateNotifications = (updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications);
    // Update localStorage with all notifications
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const otherNotifications = allNotifications.filter((n: Notification) => n.userId !== currentUser?.id);
    const newAllNotifications = [...otherNotifications, ...updatedNotifications];
    localStorage.setItem('notifications', JSON.stringify(newAllNotifications));
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    );
    updateNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    updateNotifications(updatedNotifications);
  };

  const dismissNotification = (id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    updateNotifications(updatedNotifications);
  };

  const snoozeNotification = (id: string) => {
    // For demo purposes, we'll just mark it as read and show a message
    markAsRead(id);
    alert('Notification snoozed for 1 hour');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'read':
        return notification.isRead;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with important alerts and messages
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'read', label: 'Read', count: notifications.length - unreadCount }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    filter === tab.key
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-6 transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(notification.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <>
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                              title="Mark as read"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => snoozeNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-yellow-600 rounded-full hover:bg-yellow-100 transition-colors"
                              title="Snooze"
                            >
                              <Clock className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"
                          title="Dismiss"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? 'You\'re all caught up! New notifications will appear here.'
                  : `No ${filter} notifications to show.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;