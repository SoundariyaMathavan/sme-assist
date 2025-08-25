import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Notification, ChatMessage } from '../../types';
import { 
  Users,
  Bell,
  MessageCircle,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

const CADashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [clients, setClients] = useState<User[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Load clients (SME users)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const smeUsers = users.filter((user: User) => user.role === 'SME');
    setClients(smeUsers);

    // Load CA notifications
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const caNotifications = notifications
      .filter((n: Notification) => n.userId === currentUser?.id)
      .sort((a: Notification, b: Notification) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    setRecentNotifications(caNotifications);

    // Load unread messages
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const unreadMsgs = chatMessages
      .filter((msg: ChatMessage) => msg.receiverId === currentUser?.id && !msg.isRead)
      .slice(0, 5);
    setUnreadMessages(unreadMsgs);
  }, [currentUser?.id]);

  const quickActions = [
    {
      title: 'My Clients',
      description: 'Manage and view all your SME clients',
      icon: Users,
      link: '/clients',
      color: 'bg-blue-500'
    },
    {
      title: 'Calendar',
      description: 'View client deadlines and appointments',
      icon: Calendar,
      link: '/calendar',
      color: 'bg-green-500'
    },
    {
      title: 'Documents',
      description: 'Access client documents and uploads',
      icon: FileText,
      link: '/documents',
      color: 'bg-purple-500'
    },
    {
      title: 'Client Chat',
      description: 'Communicate with your clients',
      icon: MessageCircle,
      link: '/chat',
      color: 'bg-teal-500'
    }
  ];

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'success': return 'text-green-600 bg-green-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
        <p className="text-teal-100">
          Manage your clients and stay on top of their compliance needs.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-2xl font-bold text-gray-900">{unreadMessages.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-teal-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹2.4L</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.link}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${action.color} p-3 rounded-lg group-hover:scale-105 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Clients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Clients</h2>
              <Link to="/clients" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {clients.length > 0 ? (
              <div className="space-y-4">
                {clients.slice(0, 3).map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-600">{client.company}</p>
                        <p className="text-xs text-gray-500">{client.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        Joined {new Date(client.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-500 mt-2">No clients yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Notifications</h2>
              <Link to="/notifications" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentNotifications.length > 0 ? (
              <div className="space-y-4">
                {recentNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getNotificationTypeColor(notification.type)}`}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-500 mt-2">No recent notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unread Messages */}
      {unreadMessages.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Unread Messages</h2>
              <Link to="/chat" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {unreadMessages.map((message) => {
                const sender = clients.find(c => c.id === message.senderId);
                return (
                  <div key={message.id} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {sender ? sender.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{sender?.name || 'Unknown User'}</h3>
                      <p className="text-sm text-gray-700">{message.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CADashboard;