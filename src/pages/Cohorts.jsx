import React, { useState } from 'react';
import { Users, Calendar, Target, Crown, Plus, UserPlus } from 'lucide-react';

const Cohorts = ({ cohorts }) => {
  const [joinedCohorts, setJoinedCohorts] = useState(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCohort, setNewCohort] = useState({
    name: '',
    description: '',
    category: 'DeFi',
    maxMembers: 10
  });

  const joinCohort = (cohortId) => {
    setJoinedCohorts(new Set([...joinedCohorts, cohortId]));
  };

  const createCohort = () => {
    // In a real app, this would call an API
    console.log('Creating cohort:', newCohort);
    setShowCreateForm(false);
    setNewCohort({ name: '', description: '', category: 'DeFi', maxMembers: 10 });
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getProgressPercentage = (members, maxMembers) => {
    return (members / maxMembers) * 100;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
          <Users className="text-purple-600" size={40} />
          <span>Launch Cohorts</span>
        </h1>
        <p className="text-xl text-gray-600">
          Team up with other developers for coordinated app launches
        </p>
      </div>

      {/* Stats & Create Button */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{cohorts.length}</div>
            <div className="text-gray-600">Active Cohorts</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{joinedCohorts.size}</div>
            <div className="text-gray-600">Joined</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {cohorts.reduce((sum, cohort) => sum + cohort.members, 0)}
            </div>
            <div className="text-gray-600">Total Members</div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Cohort</span>
        </button>
      </div>

      {/* Create Cohort Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Cohort</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Cohort name"
              value={newCohort.name}
              onChange={(e) => setNewCohort({ ...newCohort, name: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <select
              value={newCohort.category}
              onChange={(e) => setNewCohort({ ...newCohort, category: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="DeFi">DeFi</option>
              <option value="Gaming">Gaming</option>
              <option value="Social">Social</option>
              <option value="AI">AI</option>
            </select>
            <textarea
              placeholder="Description"
              value={newCohort.description}
              onChange={(e) => setNewCohort({ ...newCohort, description: e.target.value })}
              className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              rows="3"
            />
            <input
              type="number"
              placeholder="Max members"
              value={newCohort.maxMembers}
              onChange={(e) => setNewCohort({ ...newCohort, maxMembers: parseInt(e.target.value) })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              min="5"
              max="50"
            />
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={createCohort}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cohorts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {cohorts.map(cohort => {
          const isJoined = joinedCohorts.has(cohort.id);
          const isFull = cohort.members >= cohort.maxMembers;
          const progressPercentage = getProgressPercentage(cohort.members, cohort.maxMembers);

          return (
            <div
              key={cohort.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{cohort.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Crown size={14} className="text-yellow-500" />
                      <span>Led by {cohort.leader}</span>
                    </div>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {cohort.category}
                  </span>
                </div>

                <p className="text-gray-600 mb-6">{cohort.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users size={18} className="text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">
                        {cohort.members}/{cohort.maxMembers} members
                      </div>
                      <div className="text-xs">
                        {cohort.maxMembers - cohort.members} spots left
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Target size={18} className="text-green-600" />
                    <div>
                      <div className="text-sm font-medium">{formatDate(cohort.launchTarget)}</div>
                      <div className="text-xs">target launch</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Team Formation</span>
                    <span>{progressPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isFull 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-purple-500 to-blue-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="space-y-3">
                  {isFull && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                      <span className="text-yellow-700 font-medium">🔥 Team Complete</span>
                    </div>
                  )}
                  
                  {!isJoined && !isFull ? (
                    <button
                      onClick={() => joinCohort(cohort.id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <UserPlus size={18} />
                      <span>Join Cohort</span>
                    </button>
                  ) : isJoined ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <span className="text-green-700 font-medium">✅ You're part of this cohort!</span>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-lg cursor-not-allowed"
                    >
                      Team Full
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cohorts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No active cohorts</h3>
          <p className="text-gray-600">Be the first to create a launch cohort!</p>
        </div>
      )}
    </div>
  );
};

export default Cohorts;
window.Cohorts = Cohorts;