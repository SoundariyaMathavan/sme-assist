import { User, Notification, CalendarEvent, Document, ChatMessage, FilingGuide } from '../types';

// Initialize sample data on first load
export const initializeSampleData = () => {
  // Sample users
  const sampleUsers: User[] = [
    {
      id: '1',
      email: 'sme@demo.com',
      password: 'demo123',
      role: 'SME',
      name: 'John Smith',
      company: 'Tech Solutions Ltd.',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      email: 'ca@demo.com',
      password: 'demo123',
      role: 'CA',
      name: 'Sarah Johnson',
      company: 'Johnson & Associates',
      createdAt: '2024-01-10T09:00:00Z'
    }
  ];

  // Sample notifications
  const sampleNotifications: Notification[] = [
    {
      id: '1',
      title: 'GST Return Due',
      message: 'Your GST return for December 2024 is due on January 20th',
      type: 'warning',
      isRead: false,
      createdAt: '2024-12-28T14:30:00Z',
      userId: '1'
    },
    {
      id: '2',
      title: 'Document Uploaded',
      message: 'Your CA has uploaded the annual financial statement',
      type: 'info',
      isRead: false,
      createdAt: '2024-12-27T11:15:00Z',
      userId: '1'
    },
    {
      id: '3',
      title: 'Client Payment Received',
      message: 'John Smith has completed the payment for consultation',
      type: 'success',
      isRead: false,
      createdAt: '2024-12-26T16:45:00Z',
      userId: '2'
    }
  ];

  // Sample calendar events
  const sampleCalendarEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'GST Return Filing',
      date: '2025-01-20',
      type: 'filing',
      priority: 'high',
      description: 'Submit monthly GST return for December 2024'
    },
    {
      id: '2',
      title: 'TDS Payment',
      date: '2025-01-07',
      type: 'payment',
      priority: 'high',
      description: 'Pay TDS for December 2024'
    },
    {
      id: '3',
      title: 'Client Meeting',
      date: '2025-01-15',
      type: 'meeting',
      priority: 'medium',
      description: 'Quarterly review with Tech Solutions Ltd.'
    }
  ];

  // Sample documents
  const sampleDocuments: Document[] = [
    {
      id: '1',
      name: 'Annual Financial Statement 2024.pdf',
      type: 'application/pdf',
      size: '2.4 MB',
      uploadedAt: '2024-12-15T10:30:00Z',
      uploadedBy: '2',
      content: 'sample-financial-statement-content'
    },
    {
      id: '2',
      name: 'GST Return November.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: '156 KB',
      uploadedAt: '2024-12-10T14:20:00Z',
      uploadedBy: '1',
      content: 'sample-gst-return-content'
    }
  ];

  // Sample chat messages
  const sampleChatMessages: ChatMessage[] = [
    {
      id: '1',
      senderId: '1',
      receiverId: '2',
      message: 'Hi Sarah, I need help with the GST filing for this month.',
      timestamp: '2024-12-28T10:30:00Z',
      isRead: true
    },
    {
      id: '2',
      senderId: '2',
      receiverId: '1',
      message: 'Hello John! I can help you with that. Have you collected all the necessary invoices?',
      timestamp: '2024-12-28T10:35:00Z',
      isRead: true
    },
    {
      id: '3',
      senderId: '1',
      receiverId: '2',
      message: 'Yes, I have uploaded them to the document vault. Please check.',
      timestamp: '2024-12-28T10:40:00Z',
      isRead: false
    }
  ];

  // Sample filing guides
  const sampleFilingGuides: FilingGuide[] = [
    {
      id: '1',
      title: 'GST Return Filing Guide',
      description: 'Step-by-step guide to file your monthly GST return',
      steps: [
        {
          id: '1',
          title: 'Gather Required Documents',
          content: 'Collect all sales invoices, purchase invoices, and payment receipts for the month.',
          isCompleted: false
        },
        {
          id: '2',
          title: 'Login to GST Portal',
          content: 'Access the official GST portal using your credentials.',
          isCompleted: false
        },
        {
          id: '3',
          title: 'Fill GSTR-1',
          content: 'Enter all outward supply details in GSTR-1 form.',
          isCompleted: false
        },
        {
          id: '4',
          title: 'Review and Submit',
          content: 'Review all entered data and submit the return before the due date.',
          isCompleted: false
        }
      ]
    }
  ];

  // Initialize data if not exists
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(sampleUsers));
  }
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify(sampleNotifications));
  }
  if (!localStorage.getItem('calendarEvents')) {
    localStorage.setItem('calendarEvents', JSON.stringify(sampleCalendarEvents));
  }
  if (!localStorage.getItem('documents')) {
    localStorage.setItem('documents', JSON.stringify(sampleDocuments));
  }
  if (!localStorage.getItem('chatMessages')) {
    localStorage.setItem('chatMessages', JSON.stringify(sampleChatMessages));
  }
  if (!localStorage.getItem('filingGuides')) {
    localStorage.setItem('filingGuides', JSON.stringify(sampleFilingGuides));
  }
};