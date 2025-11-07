import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Download, Heart, Plus, Share2, TrendingUp, Zap } from 'lucide-react';

const Discovery = ({ apps, onAddToStack, onShare, myStack, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('personalized');

  const categories = ['All', ...new Set(apps.map(app => app.category))];

  const getPersonalizationBoost = (app) => {
    if (!user?.preferences?.categories) return 0;
    return user.preferences.categories.includes(app.category) ? 50 : 0;
  };

  const filteredAndSortedApps = useMemo(() => {
    let filtered = apps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'personalized':
          const aScore = a.trendingScore + getPersonalizationBoost(a) + (a.featured ? 25 : 0);
          const bScore = b.trendingScore + getPersonalizationBoost(b) + (b.featured ? 25 : 0);
          return bScore - aScore;
        case 'trending':
          return (b.trendingScore + b.viralFactors.shares * 0.1) - (a.trendingScore + a.viralFactors.shares * 0.1);
        case 'new':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'rated':
          return b.rating - a.rating;
        case 'viral':
          return (b.viralFactors.shares + b.viralFactors.referrals) - (a.viralFactors.shares + a.viralFactors.referrals);
        default:
          return 0;
      }
    });
  }, [apps, searchTerm, selectedCategory, sortBy, user]);

  const isInStack = (appId) => myStack.some(app => app.id === appId);

  const handleQuickShare = (app, e) => {
    e.stopPropagation();
    onShare(app);
    // Show temporary feedback
    e.target.style.transform = 'scale(1.2)';
    setTimeout(() => {
      e.target.style.transform = 'scale(1)';
    }, 200);
  };

  const getAppInsights = (app) => {
    const insights = [];
    
    if (app.weeklyGrowth > 50) {
      insights.push({ text: '🚀 Fast Growing', color: 'text-green-600' });
    }
    
    if (app.viralFactors.shares > 500) {
      insights.push({ text: '🔥 Highly Shared', color: 'text-orange-600' });
    }
    
    if (user?.preferences?.categories?.includes(app.category)) {
      insights.push({ text: '🎯 Matches Your Interest', color: 'text-purple-600' });
    }
    
    return insights;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Personalized Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {user ? `Hey ${user.name.split(' ')[0]}! ` : ''}Discover Amazing Apps
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {user?.preferences?.categories?.length > 0 
            ? `Apps curated for your interests: ${user.preferences.categories.join(', ')}`
            : 'Browse through our curated collection of innovative applications'
          }
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{apps.length}</div>
          <div className="text-sm text-gray-600">Total Apps</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {apps.filter(app => app.weeklyGrowth > 20).length}
          </div>
          <div className="text-sm text-gray-600">Fast Growing</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{myStack.length}</div>
          <div className="text-sm text-gray-600">Your Stack</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {user?.badges?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Badges</div>
        </div>
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
            <option value="personalized">For You</option>
            <option value="trending">Trending</option>
            <option value="viral">Most Shared</option>
            <option value="new">New</option>
            <option value="rated">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredAndSortedApps.length} apps
        </p>
        {user && (
          <div className="flex items-center space-x-2 text-sm text-purple-600">
            <Zap size={16} />
            <span>Personalized for you</span>
          </div>
        )}
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedApps.map(app => {
          const insights = getAppInsights(app);
          
          return (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={app.image}
                  alt={app.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay badges */}
                <div className="absolute top-3 left-3 space-y-2">
                  {app.trending && (
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <TrendingUp size={12} />
                      <span>Trending</span>
                    </div>
                  )}
                  {app.new && (
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ✨ New
                    </div>
                  )}
                  {app.featured && (
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleQuickShare(app, e)}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white shadow-lg transition-all"
                  >
                    <Share2 size={16} className="text-gray-700" />
                  </button>
                </div>
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

                {/* App Insights */}
                {insights.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {insights.slice(0, 2).map((insight, index) => (
                      <span key={index} className={`text-xs ${insight.color} bg-gray-50 px-2 py-1 rounded`}>
                        {insight.text}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-500 fill-current" size={16} />
                      <span className="text-sm font-medium">{app.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Download size={14} />
                      <span className="text-xs">{app.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Viral indicators */}
                  <div className="flex items-center space-x-2">
                    {app.viralFactors.shares > 100 && (
                      <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        🔥 {app.viralFactors.shares}
                      </span>
                    )}
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
          );
        })}
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
window.Discovery = Discovery;