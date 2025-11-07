import React, { useState } from 'react';
import { Shield, Check, X, Filter, Search, Calendar, Star } from 'lucide-react';

const Admin = ({ apps, onApprove, onReject, isAdmin }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Shield size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page</p>
        </div>
      </div>
    );
  }

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: apps.length,
    approved: apps.filter(app => app.status === 'approved').length,
    pending: apps.filter(app => app.status === 'pending').length,
    rejected: apps.filter(app => app.status === 'rejected').length
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
          <Shield className="text-purple-600" size={40} />
          <span>Admin Panel</span>
        </h1>
        <p className="text-xl text-gray-600">
          Review and manage app submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-gray-600 mb-2">{stats.total}</div>
          <div className="text-gray-600">Total Apps</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.approved}</div>
          <div className="text-gray-600">Approved</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pending}</div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{stats.rejected}</div>
          <div className="text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredApps.length} apps
        </p>
      </div>

      {/* Apps List */}
      <div className="space-y-6">
        {filteredApps.map(app => (
          <div
            key={app.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-1/4">
                <img
                  src={app.image}
                  alt={app.name}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
              
              <div className="flex-1 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{app.name}</h3>
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                          {app.category}
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{app.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Star className="text-yellow-500" size={16} />
                        <span className="text-sm">{app.rating} rating</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar size={16} />
                        <span className="text-sm">{formatDate(app.createdAt)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {app.downloads.toLocaleString()} downloads
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:ml-6">
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onApprove(app.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                        >
                          <Check size={16} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => onReject(app.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                    {app.status === 'approved' && (
                      <button
                        onClick={() => onReject(app.id)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2"
                      >
                        <X size={16} />
                        <span>Revoke</span>
                      </button>
                    )}
                    {app.status === 'rejected' && (
                      <button
                        onClick={() => onApprove(app.id)}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-2"
                      >
                        <Check size={16} />
                        <span>Approve</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No apps found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Admin;
window.Admin = Admin;