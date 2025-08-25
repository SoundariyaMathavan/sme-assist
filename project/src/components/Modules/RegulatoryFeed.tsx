import React, { useState } from 'react';
import { Rss, ExternalLink, Calendar, Tag, Search, Filter } from 'lucide-react';

interface RegulatoryUpdate {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  importance: 'high' | 'medium' | 'low';
  source: string;
  link?: string;
}

const RegulatoryFeed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImportance, setSelectedImportance] = useState('all');

  const sampleUpdates: RegulatoryUpdate[] = [
    {
      id: '1',
      title: 'GST Rate Changes for Construction Services',
      summary: 'The GST Council has announced revised rates for construction services effective from January 1, 2025. The new rates will impact residential and commercial construction projects.',
      date: '2024-12-28',
      category: 'GST',
      importance: 'high',
      source: 'GST Council',
      link: '#'
    },
    {
      id: '2',
      title: 'Extended Due Date for Income Tax Returns',
      summary: 'The Central Board of Direct Taxes (CBDT) has extended the due date for filing income tax returns for AY 2024-25 to January 31, 2025.',
      date: '2024-12-27',
      category: 'Income Tax',
      importance: 'medium',
      source: 'CBDT',
      link: '#'
    },
    {
      id: '3',
      title: 'New ROC Filing Requirements',
      summary: 'The Ministry of Corporate Affairs (MCA) has introduced new mandatory disclosures for companies in their annual filings with ROC.',
      date: '2024-12-26',
      category: 'Corporate Law',
      importance: 'high',
      source: 'MCA',
      link: '#'
    },
    {
      id: '4',
      title: 'TDS Rate Revision for Professional Services',
      summary: 'TDS rates for payments to professionals have been revised. New rates are applicable from January 1, 2025.',
      date: '2024-12-25',
      category: 'TDS',
      importance: 'medium',
      source: 'Income Tax Department',
      link: '#'
    },
    {
      id: '5',
      title: 'Updated Labour Law Compliance Requirements',
      summary: 'New compliance requirements under the Labour Codes have been notified. Employers need to ensure adherence to updated provisions.',
      date: '2024-12-24',
      category: 'Labour Law',
      importance: 'medium',
      source: 'Ministry of Labour',
      link: '#'
    },
    {
      id: '6',
      title: 'FEMA Notification on Foreign Investment',
      summary: 'Reserve Bank of India has issued new FEMA notification regarding foreign direct investment in certain sectors.',
      date: '2024-12-23',
      category: 'FEMA',
      importance: 'low',
      source: 'RBI',
      link: '#'
    }
  ];

  const categories = ['all', 'GST', 'Income Tax', 'Corporate Law', 'TDS', 'Labour Law', 'FEMA'];
  const importanceLevels = ['all', 'high', 'medium', 'low'];

  const filteredUpdates = sampleUpdates.filter(update => {
    const matchesSearch = update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || update.category === selectedCategory;
    const matchesImportance = selectedImportance === 'all' || update.importance === selectedImportance;
    
    return matchesSearch && matchesCategory && matchesImportance;
  });

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'GST': 'bg-blue-100 text-blue-700',
      'Income Tax': 'bg-purple-100 text-purple-700',
      'Corporate Law': 'bg-indigo-100 text-indigo-700',
      'TDS': 'bg-pink-100 text-pink-700',
      'Labour Law': 'bg-teal-100 text-teal-700',
      'FEMA': 'bg-orange-100 text-orange-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Regulatory Feed</h1>
        <p className="text-gray-600">Stay updated with the latest regulatory changes and announcements</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search updates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Importance Filter */}
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedImportance}
              onChange={(e) => setSelectedImportance(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {importanceLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Importance' : `${level.charAt(0).toUpperCase() + level.slice(1)} Priority`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {filteredUpdates.length > 0 ? (
          filteredUpdates.map(update => (
            <div key={update.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{update.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImportanceColor(update.importance)}`}>
                      {update.importance} priority
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">{update.summary}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(update.date).toLocaleDateString()}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(update.category)}`}>
                      {update.category}
                    </span>
                    <span>Source: {update.source}</span>
                  </div>
                </div>

                {update.link && (
                  <button className="ml-4 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <ExternalLink className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Rss className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No updates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or check back later for new updates.
            </p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {filteredUpdates.length > 0 && (
        <div className="text-center">
          <button className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Load More Updates
          </button>
        </div>
      )}
    </div>
  );
};

export default RegulatoryFeed;