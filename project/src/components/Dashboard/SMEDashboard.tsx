import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CalendarEvent, Notification, Document } from '../../types';
import { 
  Calendar,
  FileText,
  Bell,
  BookOpen,
  Rss,
  MessageCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

const SMEDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);

  useEffect(() => {
    // Load recent data
    const events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');

    // Filter and sort
    const today = new Date();
    const upcomingEventsFiltered = events
      .filter((event: CalendarEvent) => new Date(event.date) >= today)
      .sort((a: CalendarEvent, b: CalendarEvent) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);

    const userNotifications = notifications
      .filter((n: Notification) => n.userId === currentUser?.id)
      .sort((a: Notification, b: Notification) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    const recentDocsFiltered = documents
      .sort((a: Document, b: Document) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 3);

    setUpcomingEvents(upcomingEventsFiltered);
    setRecentNotifications(userNotifications);
    setRecentDocuments(recentDocsFiltered);
  }, [currentUser?.id]);

  const quickActions = [
    {
      title: 'Compliance Calendar',
      description: 'View upcoming deadlines and important dates',
      icon: Calendar,
      link: '/calendar',
      color: 'bg-blue-500'
    },
    {
      title: 'Document Vault',
      description: 'Upload and manage your business documents',
      icon: FileText,
      link: '/documents',
      color: 'bg-green-500'
    },
    {
      title: 'Filing Guides',
      description: 'Step-by-step guides for various filings',
      icon: BookOpen,
      link: '/filing-guides',
      color: 'bg-purple-500'
    },
    {
      title: 'Chat with CA',
      description: 'Get expert advice from your CA',
      icon: MessageCircle,
      link: '/chat',
      color: 'bg-teal-500'
    }
  ];

  const getEventPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
        <p className="text-blue-100">
          Here's what's happening with your compliance activities today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Urgent Tasks</p>
              <p className="text-2xl font-bold text-gray-900">
                {upcomingEvents.filter(e => e.priority === 'high').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-2xl font-bold text-gray-900">{recentDocuments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
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
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
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
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h2>
              <Link to="/calendar" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventPriorityColor(event.priority)}`}>
                      {event.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-500 mt-2">No upcoming deadlines</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Notifications</h2>
              <Link to="/notifications" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
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

      {/* Recent Documents */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Recent Documents</h2>
            <Link to="/documents" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {recentDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{doc.name}</h3>
                      <p className="text-xs text-gray-600">{doc.size}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-gray-500 mt-2">No documents uploaded yet</p>
              <Link
                to="/documents"
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 hover:text-blue-500"
              >
                Upload your first document
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SMEDashboard;