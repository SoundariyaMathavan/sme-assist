import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Calendar, 
  FileText, 
  Bell, 
  BookOpen, 
  Rss, 
  MessageCircle, 
  Users, 
  LogOut,
  Building2
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const smeMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/sme-dashboard' },
    { icon: Calendar, label: 'Compliance Calendar', path: '/calendar' },
    { icon: FileText, label: 'Document Vault', path: '/documents' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: BookOpen, label: 'Filing Guides', path: '/filing-guides' },
    { icon: Rss, label: 'Regulatory Feed', path: '/regulatory-feed' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
  ];

  const caMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/ca-dashboard' },
    { icon: Users, label: 'My Clients', path: '/clients' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
  ];

  const menuItems = currentUser?.role === 'SME' ? smeMenuItems : caMenuItems;

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      {/* Logo and Company */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">ComplianceHub</h1>
            <p className="text-sm text-gray-600">{currentUser?.role} Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {currentUser?.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{currentUser?.name}</p>
            <p className="text-sm text-gray-600">{currentUser?.company}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;