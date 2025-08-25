import React, { useState, useEffect } from 'react';
import { Document } from '../../types';
import { FileText, Upload, Download, Trash2, Search, Filter, Eye } from 'lucide-react';

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const savedDocuments = JSON.parse(localStorage.getItem('documents') || '[]');
    setDocuments(savedDocuments);
  };

  const handleFileUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    
    if (!file || !name) return;

    const newDocument: Document = {
      id: Date.now().toString(),
      name: name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: '1', // Current user ID
      content: 'base64-encoded-content' // In real app, convert file to base64
    };

    const updatedDocuments = [...documents, newDocument];
    setDocuments(updatedDocuments);
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
    setShowUploadModal(false);
  };

  const deleteDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('image')) return '🖼️';
    return '📄';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type.includes(filterType);
    return matchesSearch && matchesFilter;
  });

  const documentTypes = [
    { value: 'all', label: 'All Documents' },
    { value: 'pdf', label: 'PDF Files' },
    { value: 'excel', label: 'Excel Files' },
    { value: 'word', label: 'Word Documents' },
    { value: 'image', label: 'Images' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Vault</h1>
          <p className="text-gray-600">Upload, manage, and organize your business documents</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Documents ({filteredDocuments.length})
          </h2>
        </div>
        <div className="p-6">
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map(doc => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getFileIcon(doc.type)}</span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{doc.name}</h3>
                        <p className="text-xs text-gray-600">{doc.size}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    <p>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Document"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {doc.type.split('/')[1] || 'file'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by uploading your first document.'
                }
              </p>
              {!searchTerm && filterType === 'all' && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 hover:text-blue-500"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
            </div>
            <form onSubmit={handleFileUpload} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Document Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter document name"
                  />
                </div>
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                    Select File
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;