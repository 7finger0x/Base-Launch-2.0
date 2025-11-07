import React, { useState } from 'react';
import { TrendingUp, Share2, Plus, Calendar, Star, Users, Zap } from 'lucide-react';

const TrendingDigest = ({ apps, launches, onAddToStack, user }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const getTrendingApps = (period) => {
    const now = new Date();
    let cutoff;
    
    switch (period) {
      case 'day':
        cutoff = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        cutoff = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoff = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoff = new Date(now - 7 * 24 * 60 * 60 * 1000);
    }

    return apps
      .filter(app => new Date(app.createdAt) > cutoff || app.weeklyGrowth > 20)
      .sort((a, b) => (b.trendingScore + b.weeklyGrowth) - (a.trendingScore + a.weeklyGrowth))
      .slice(0, 10);
  };

  const getViralMoments = () => {
    const viralApps = apps
      .filter(app => app.viralFactors.shares > 200 || app.viralFactors.referrals > 100)
      .sort((a, b) => (b.viralFactors.shares + b.viralFactors.referrals) - (a.viralFactors.shares + a.viralFactors.referrals))
      .slice(0, 5);

    return viralApps.map(app => ({
      ...app,
      viralScore: app.viralFactors.shares + app.viralFactors.referrals,
      reason: app.viralFactors.shares > app.viralFactors.referrals ? 'Most Shared' : 'Most Referred'
    }));
  };

  const getUpcomingLaunches = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return launches
      .filter(launch => {
        const launchDate = new Date(launch.launchDate);
        return launchDate >= now && launchDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.launchDate) - new Date(b.launchDate))
      .slice(0, 5);
  };

  const trendingApps = getTrendingApps(selectedPeriod);
  const viralMoments = getViralMoments();
  const upcomingLaunches = getUpcomingLaunches();

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const shareDigest = () => {
    const shareText = `📊 This week's trending apps on Base Launch:\n\n${trendingApps.slice(0, 3).map((app, i) => `${i + 1}. ${app.name} - ${app.category}`).join('\n')}\n\nDiscover more: ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Base Launch Weekly Digest',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
          <TrendingUp className="text-purple-600" size={40} />
          <span>Trending Digest</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your weekly dose of what's hot in the Base ecosystem
        </p>
        
        <div className="flex justify-center items-center space-x-4 mt-6">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          
          <button
            onClick={shareDigest}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2"
          >
            <Share2 size={16} />
            <span>Share Digest</span>
          </button>
        </div>
      </div>

      {/* Trending Apps */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Zap className="text-yellow-500" size={24} />
            <span>Trending Apps</span>
          </h2>
          <span className="text-sm text-gray-600">
            Based on growth, engagement, and user activity
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingApps.map((app, index) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={app.image}
                  alt={app.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-3 left-3">
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <span>#{index + 1}</span>
                    <TrendingUp size={14} />
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    +{app.weeklyGrowth.toFixed(0)}%
                  </span>
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

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-500 fill-current" size={16} />
                    <span className="text-sm font-medium">{app.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Users size={14} />
                    <span className="text-xs">{app.userCount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Viral Score</span>
                    <span>{(app.viralFactors.shares + app.viralFactors.referrals)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (app.viralFactors.shares + app.viralFactors.referrals) / 10)}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => onAddToStack(app)}
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add to Stack</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Viral Moments */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Share2 className="text-pink-500" size={24} />
            <span>Viral Moments</span>
          </h2>
          <span className="text-sm text-gray-600">
            Most shared and referred apps
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {viralMoments.map((app, index) => (
            <div
              key={app.id}
              className={`flex items-center space-x-4 p-6 ${index !== viralMoments.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50 transition-colors`}
            >
              <div className="text-2xl font-bold text-gray-400 w-8">
                #{index + 1}
              </div>
              
              <img
                src={app.image}
                alt={app.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{app.name}</h3>
                <p className="text-sm text-gray-600">{app.category}</p>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-pink-600">{app.viralScore}</div>
                <div className="text-xs text-gray-500">{app.reason}</div>
              </div>
              
              <button
                onClick={() => onAddToStack(app)}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
              >
                Add to Stack
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Launches */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Calendar className="text-blue-500" size={24} />
            <span>Launching This Week</span>
          </h2>
          <span className="text-sm text-gray-600">
            Don't miss these upcoming launches
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingLaunches.map(launch => (
            <div
              key={launch.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={launch.image}
                  alt={launch.name}
                  className="w-full h-40 object-cover"
                />
                
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Launching Soon
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{launch.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{launch.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    <Calendar size={14} className="inline mr-1" />
                    {formatDate(launch.launchDate)}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    {launch.waitlistCount.toLocaleString()} waiting
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                  Join Waitlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Insights */}
      {user && (
        <div className="mt-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Personalized for You
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Trending in Your Categories</h4>
              <div className="text-sm text-gray-600">
                {trendingApps
                  .filter(app => user.preferences?.categories?.includes(app.category))
                  .slice(0, 3)
                  .map(app => app.name)
                  .join(', ') || 'No apps in your preferred categories this week'}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Your Discovery Impact</h4>
              <div className="text-sm text-gray-600">
                You've helped {user.badges?.length * 10 || 0} people discover new apps through your activity
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingDigest;
window.TrendingDigest = TrendingDigest;
window.TrendingDigest = TrendingDigest;