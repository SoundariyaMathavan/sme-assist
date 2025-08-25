import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ChatMessage, User as UserType } from '../../types';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatPartner, setChatPartner] = useState<UserType | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<UserType[]>([]);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    findChatPartners();
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = () => {
    const allMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const userMessages = allMessages.filter((msg: ChatMessage) => 
      msg.senderId === currentUser?.id || msg.receiverId === currentUser?.id
    );
    
    // Sort messages by timestamp
    userMessages.sort((a: ChatMessage, b: ChatMessage) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    setMessages(userMessages);

    // Mark received messages as read
    const updatedMessages = allMessages.map((msg: ChatMessage) => 
      msg.receiverId === currentUser?.id ? { ...msg, isRead: true } : msg
    );
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
  };

  const findChatPartners = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (currentUser?.role === 'SME') {
      // SME chats with CAs
      const cas = users.filter((user: UserType) => user.role === 'CA');
      setOnlineUsers(cas);
      if (cas.length > 0 && !chatPartner) {
        setChatPartner(cas[0]);
      }
    } else {
      // CA chats with SMEs
      const smes = users.filter((user: UserType) => user.role === 'SME');
      setOnlineUsers(smes);
      if (smes.length > 0 && !chatPartner) {
        setChatPartner(smes[0]);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatPartner) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser!.id,
      receiverId: chatPartner.id,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const allMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    allMessages.push(message);
    localStorage.setItem('chatMessages', JSON.stringify(allMessages));

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getMessagesWithPartner = (partnerId: string) => {
    return messages.filter(msg => 
      (msg.senderId === currentUser?.id && msg.receiverId === partnerId) ||
      (msg.senderId === partnerId && msg.receiverId === currentUser?.id)
    );
  };

  const partnerMessages = chatPartner ? getMessagesWithPartner(chatPartner.id) : [];

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {currentUser?.role === 'SME' ? 'Chat with CAs' : 'Chat with Clients'}
        </h1>
        <p className="text-gray-600">
          Communicate with your {currentUser?.role === 'SME' ? 'chartered accountants' : 'SME clients'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-96">
        {/* Users List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentUser?.role === 'SME' ? 'Available CAs' : 'My Clients'}
            </h3>
          </div>
          <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
            {onlineUsers.map(user => {
              const unreadCount = messages.filter(msg => 
                msg.senderId === user.id && msg.receiverId === currentUser?.id && !msg.isRead
              ).length;
              
              return (
                <button
                  key={user.id}
                  onClick={() => setChatPartner(user)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    chatPartner?.id === user.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.company}</p>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
            
            {onlineUsers.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-500 mt-2">No users available</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {chatPartner ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{chatPartner.name}</h3>
                    <p className="text-sm text-gray-600">{chatPartner.company}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-64">
                {partnerMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-gray-500 mt-2">No messages yet.</p>
                    <p className="text-sm text-gray-400 mt-1">Start a conversation!</p>
                  </div>
                ) : (
                  partnerMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === currentUser?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === currentUser?.id
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${chatPartner.name}...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-500 mt-2">Select a user to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;