import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Download, Heart, Plus } from 'lucide-react';

const Discovery = ({ apps, onAddToStack, myStack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('trending');

  const categories = ['All', ...new Set(apps.map(app => app.category))];

  const filteredAndSortedApps = useMemo(() => {
    let filtered = apps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return b.trending - a.trending || b.downloads - a.downloads;
        case 'new':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'rated':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [apps, searchTerm, selectedCategory, sortBy]);

  const isInStack = (appId) => myStack.some(app => app.id === appId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Amazing Apps
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Browse through our curated collection of innovative applications
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
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

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="trending">Trending</option>
            <option value="new">New</option>
            <option value="rated">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredAndSortedApps.length} apps
        </p>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedApps.map(app => (
          <div
            key={app.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="relative">
              <img
                src={app.image}
                alt={app.name}
                className="w-full h-48 object-cover"
              />
              {app.trending && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  🔥 Trending
                </div>
              )}
              {app.new && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ✨ New
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {app.name}
                </h3>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                  {app.category}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {app.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-500 fill-current" size={16} />
                  <span className="text-sm font-medium">{app.rating}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Download size={14} />
                  <span className="text-xs">{app.downloads.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => onAddToStack(app)}
                disabled={isInStack(app.id)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                  isInStack(app.id)
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
                }`}
              >
                {isInStack(app.id) ? (
                  <span className="flex items-center justify-center space-x-2">
                    <Heart className="fill-current" size={16} />
                    <span>In Stack</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Plus size={16} />
                    <span>Add to Stack</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedApps.length === 0 && (
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

export default Discovery;
window.Discovery = Discovery;