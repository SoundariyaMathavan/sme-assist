export interface User {
  id: string;
  email: string;
  password: string;
  role: 'SME' | 'CA';
  name: string;
  company?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  content: string; // base64 or metadata
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'filing' | 'payment' | 'meeting' | 'deadline';
  priority: 'high' | 'medium' | 'low';
  description: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface FilingGuide {
  id: string;
  title: string;
  description: string;
  steps: Array<{
    id: string;
    title: string;
    content: string;
    isCompleted: boolean;
  }>;
}