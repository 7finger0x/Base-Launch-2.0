import React, { useState } from 'react';
import { User, Trophy, Share2, Settings, Star, TrendingUp, Users, Rocket } from 'lucide-react';

const Profile = ({ user, setUser, userStats, myStack, onShare }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const badges = {
    EARLY_ADOPTER: { name: 'Early Adopter', icon: '🌟', description: 'Joined within first 1000 users' },
    APP_HUNTER: { name: 'App Hunter', icon: '🏹', description: 'Discovered 10+ apps' },
    VIRAL_CONTRIBUTOR: { name: 'Viral Contributor', icon: '💥', description: 'Generated 5+ referrals' },
    EARLY_BIRD: { name: 'Early Bird', icon: '🐦', description: 'Joined 3+ waitlists before launch' },
    INFLUENCER: { name: 'Influencer', icon: '📢', description: '50+ shares across social platforms' },
    COHORT_LEADER: { name: 'Cohort Leader', icon: '👑', description: 'Led a successful launch cohort' }
  };

  const shareProfile = () => {
    const shareData = {
      title: `${user.name}'s Base Launch Profile`,
      text: `Check out my achievements on Base Launch! I've discovered ${userStats.appsDiscovered} apps and earned ${user.badges.length} badges.`,
      url: `${window.location.origin}/profile/${user.id}`
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
    }
    
    onShare({ name: 'My Profile', description: shareData.text });
  };

  const getNextBadgeGoal = () => {
    if (!user.badges.includes('APP_HUNTER') && userStats.appsDiscovered < 10) {
      return { badge: 'APP_HUNTER', current: userStats.appsDiscovered, target: 10, type: 'apps' };
    }
    if (!user.badges.includes('VIRAL_CONTRIBUTOR') && userStats.referralCount < 5) {
      return { badge: 'VIRAL_CONTRIBUTOR', current: userStats.referralCount, target: 5, type: 'referrals' };
    }
    return null;
  };

  const nextBadge = getNextBadgeGoal();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white/20"
          />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <p className="text-purple-100 mb-4">@{user.username} • FID: {user.fid}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {user.badges.map(badge => (
                <span
                  key={badge}
                  className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                  title={badges[badge]?.description}
                >
                  <span>{badges[badge]?.icon}</span>
                  <span>{badges[badge]?.name}</span>
                </span>
              ))}
            </div>
            
            <button
              onClick={shareProfile}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
            >
              <Share2 size={16} />
              <span>Share Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{userStats.appsDiscovered}</div>
          <div className="text-sm text-gray-600">Apps Discovered</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{userStats.referralCount}</div>
          <div className="text-sm text-gray-600">Referrals Made</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <Rocket className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{userStats.launchesJoined}</div>
          <div className="text-sm text-gray-600">Launches Joined</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{userStats.cohortsJoined}</div>
          <div className="text-sm text-gray-600">Cohorts Joined</div>
        </div>
      </div>

      {/* Next Badge Goal */}
      {nextBadge && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Trophy className="text-yellow-500" size={20} />
            <span>Next Badge Goal</span>
          </h3>
          
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{badges[nextBadge.badge]?.icon}</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 mb-1">
                {badges[nextBadge.badge]?.name}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {badges[nextBadge.badge]?.description}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(nextBadge.current / nextBadge.target) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {nextBadge.current} / {nextBadge.target} {nextBadge.type}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'badges', label: 'Badges', icon: Trophy },
              { id: 'activity', label: 'Recent Activity', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-all ${
                  activeTab === id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={16} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Favorite Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {user.preferences?.categories?.map(category => (
                    <span
                      key={category}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Discoveries</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myStack.slice(0, 6).map(app => (
                    <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <img src={app.image} alt={app.name} className="w-full h-32 object-cover rounded mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">{app.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{app.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Badges Tab */}
          {activeTab === 'badges' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Earned Badges ({user.badges.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.badges.map(badge => (
                    <div key={badge} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{badges[badge]?.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{badges[badge]?.name}</h4>
                          <p className="text-sm text-gray-600">{badges[badge]?.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Available Badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(badges)
                    .filter(([badge]) => !user.badges.includes(badge))
                    .map(([badge, info]) => (
                      <div key={badge} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl grayscale">{info.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-700">{info.name}</h4>
                            <p className="text-sm text-gray-500">{info.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favorite Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['DeFi', 'Gaming', 'Social', 'AI', 'Productivity', 'NFT'].map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            const currentCategories = user.preferences?.categories || [];
                            const newCategories = currentCategories.includes(category)
                              ? currentCategories.filter(c => c !== category)
                              : [...currentCategories, category];
                            
                            setUser({
                              ...user,
                              preferences: {
                                ...user.preferences,
                                categories: newCategories
                              }
                            });
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            user.preferences?.categories?.includes(category)
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified about new apps and launches</p>
                    </div>
                    <button
                      onClick={() => {
                        setUser({
                          ...user,
                          preferences: {
                            ...user.preferences,
                            notificationsEnabled: !user.preferences?.notificationsEnabled
                          }
                        });
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        user.preferences?.notificationsEnabled ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          user.preferences?.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
window.Profile = Profile;
window.Profile = Profile;