import React, { useState } from 'react';
import { Rocket, Calendar, Users, Share2, Clock, CheckCircle } from 'lucide-react';

const Launches = ({ launches }) => {
  const [joinedLaunches, setJoinedLaunches] = useState(new Set());
  const [referralCodes, setReferralCodes] = useState({});

  const joinWaitlist = (launchId) => {
    setJoinedLaunches(new Set([...joinedLaunches, launchId]));
  };

  const generateReferral = (launchId) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralCodes({ ...referralCodes, [launchId]: code });
  };

  const copyReferralCode = (code) => {
    navigator.clipboard.writeText(code);
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

  const getDaysUntilLaunch = (date) => {
    const now = new Date();
    const launchDate = new Date(date);
    const diffTime = launchDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
          <Rocket className="text-purple-600" size={40} />
          <span>App Launches</span>
        </h1>
        <p className="text-xl text-gray-600">
          Get early access to the hottest new apps before they go public
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{launches.length}</div>
          <div className="text-gray-600">Active Launches</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{joinedLaunches.size}</div>
          <div className="text-gray-600">Joined Waitlists</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {launches.reduce((sum, launch) => sum + launch.waitlistCount, 0).toLocaleString()}
          </div>
          <div className="text-gray-600">Total Waitlist</div>
        </div>
      </div>

      {/* Launches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {launches.map(launch => {
          const daysUntil = getDaysUntilLaunch(launch.launchDate);
          const isJoined = joinedLaunches.has(launch.id);
          const hasReferral = referralCodes[launch.id];

          return (
            <div
              key={launch.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={launch.image}
                  alt={launch.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {launch.category}
                  </span>
                </div>
                {daysUntil <= 7 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    🔥 Launching Soon
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{launch.name}</h3>
                <p className="text-gray-600 mb-4">{launch.description}</p>

                {/* Launch Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar size={18} className="text-purple-600" />
                    <div>
                      <div className="text-sm font-medium">{formatDate(launch.launchDate)}</div>
                      <div className="text-xs">
                        {daysUntil > 0 ? `${daysUntil} days to go` : 'Launched!'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users size={18} className="text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">{launch.waitlistCount.toLocaleString()}</div>
                      <div className="text-xs">on waitlist</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Waitlist Progress</span>
                    <span>{Math.min(100, (launch.waitlistCount / 10000) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (launch.waitlistCount / 10000) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {!isJoined ? (
                    <button
                      onClick={() => joinWaitlist(launch.id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <Rocket size={18} />
                      <span>Join Waitlist</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 py-3 rounded-lg">
                        <CheckCircle size={18} />
                        <span className="font-medium">You're on the waitlist!</span>
                      </div>
                      
                      {!hasReferral ? (
                        <button
                          onClick={() => generateReferral(launch.id)}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center space-x-2"
                        >
                          <Share2 size={16} />
                          <span>Get Referral Code</span>
                        </button>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-600 mb-2">Your referral code:</div>
                          <div className="flex items-center space-x-2">
                            <code className="flex-1 bg-white border rounded px-3 py-2 font-mono text-sm">
                              {hasReferral}
                            </code>
                            <button
                              onClick={() => copyReferralCode(hasReferral)}
                              className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {launches.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Rocket size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No active launches</h3>
          <p className="text-gray-600">Check back soon for exciting new app launches!</p>
        </div>
      )}
    </div>
  );
};

export default Launches;
window.Launches = Launches;