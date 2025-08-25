import React, { useState, useEffect } from 'react';
import { User as UserType } from '../../types';
import { Users, Search, Mail, Building, Calendar, MessageCircle, FileText, Filter } from 'lucide-react';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'company' | 'date'>('name');
  const [selectedClient, setSelectedClient] = useState<UserType | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const smeClients = users.filter((user: UserType) => user.role === 'SME');
    setClients(smeClients);
  };

  const filteredAndSortedClients = clients
    .filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'company':
          return (a.company || '').localeCompare(b.company || '');
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const getClientStats = (client: UserType) => {
    // Mock stats - in a real app, these would be calculated from actual data
    return {
      documents: Math.floor(Math.random() * 20) + 5,
      pendingTasks: Math.floor(Math.random() * 8),
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      complianceScore: Math.floor(Math.random() * 20) + 80
    };
  };

  const handleClientAction = (action: string, client: UserType) => {
    // In a real app, these would navigate to appropriate pages or open modals
    console.log(`${action} for client:`, client.name);
    
    switch (action) {
      case 'message':
        alert(`Opening chat with ${client.name}`);
        break;
      case 'documents':
        alert(`Viewing documents for ${client.name}`);
        break;
      case 'calendar':
        alert(`Viewing calendar for ${client.name}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Clients</h1>
          <p className="text-gray-600">Manage your SME clients and their compliance needs</p>
        </div>
        <div className="text-lg font-semibold text-gray-900">
          {filteredAndSortedClients.length} Client{filteredAndSortedClients.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients by name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'company' | 'date')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="company">Sort by Company</option>
              <option value="date">Sort by Join Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      {filteredAndSortedClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedClients.map(client => {
            const stats = getClientStats(client);
            
            return (
              <div
                key={client.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedClient(client)}
              >
                {/* Client Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.company}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>
                  {client.company && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{client.company}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-lg font-bold text-gray-900">{stats.documents}</p>
                    <p className="text-xs text-gray-600">Documents</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-lg font-bold text-gray-900">{stats.pendingTasks}</p>
                    <p className="text-xs text-gray-600">Pending</p>
                  </div>
                </div>

                {/* Compliance Score */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Compliance Score</span>
                    <span className="text-sm font-medium text-gray-900">{stats.complianceScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        stats.complianceScore >= 90 ? 'bg-green-500' :
                        stats.complianceScore >= 80 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${stats.complianceScore}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClientAction('message', client);
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm"
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span>Chat</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClientAction('documents', client);
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  >
                    <FileText className="h-3 w-3" />
                    <span>Files</span>
                  </button>
                </div>

                {/* Last Activity */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Last activity: {stats.lastActivity}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria.' : 'You don\'t have any clients yet.'}
          </p>
        </div>
      )}

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xl">
                      {selectedClient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedClient.name}</h3>
                    <p className="text-gray-600">{selectedClient.company}</p>
                    <p className="text-sm text-gray-500">{selectedClient.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Client Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Joined:</span> {new Date(selectedClient.createdAt).toLocaleDateString()}</p>
                    <p><span className="text-gray-600">Role:</span> {selectedClient.role}</p>
                    <p><span className="text-gray-600">Company:</span> {selectedClient.company}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleClientAction('message', selectedClient)}
                      className="w-full flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Send Message</span>
                    </button>
                    <button
                      onClick={() => handleClientAction('calendar', selectedClient)}
                      className="w-full flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>View Calendar</span>
                    </button>
                    <button
                      onClick={() => handleClientAction('documents', selectedClient)}
                      className="w-full flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      <span>View Documents</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;