import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ChatMessage } from '../../types';
import ChatWindow from './ChatWindow';

const ChatIcon: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Count unread messages
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const unread = messages.filter((msg: ChatMessage) => 
      msg.receiverId === currentUser?.id && !msg.isRead
    ).length;
    setUnreadCount(unread);
  }, [currentUser?.id]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Mark messages as read when opening chat
      const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      const updatedMessages = messages.map((msg: ChatMessage) => 
        msg.receiverId === currentUser?.id ? { ...msg, isRead: true } : msg
      );
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      setUnreadCount(0);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
            <h3 className="font-medium">
              {currentUser?.role === 'SME' ? 'Chat with CA' : 'Chat with Clients'}
            </h3>
            <button
              onClick={toggleChat}
              className="p-1 hover:bg-blue-700 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            <ChatWindow />
          </div>
        </div>
      )}

      {/* Chat Icon */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-40"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </>
  );
};

export default ChatIcon;