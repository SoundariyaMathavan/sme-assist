import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ChatMessage, User } from '../../types';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatPartner, setChatPartner] = useState<User | null>(null);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    findChatPartner();
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
    setMessages(userMessages);
  };

  const findChatPartner = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (currentUser?.role === 'SME') {
      // SME chats with CA
      const ca = users.find((user: User) => user.role === 'CA');
      setChatPartner(ca || null);
    } else {
      // CA chats with first SME (in real app, this would be dynamic)
      const sme = users.find((user: User) => user.role === 'SME');
      setChatPartner(sme || null);
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
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet.</p>
            <p className="text-sm mt-1">Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
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
      {chatPartner && (
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${chatPartner.name}...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChatWindow;