import React from 'react';
import { Heart, X, Star, Download, ExternalLink } from 'lucide-react';

const MyStack = ({ myStack, onRemoveFromStack }) => {
  if (myStack.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-purple-300 mb-4">
            <Heart size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Stack is Empty</h2>
          <p className="text-gray-600 mb-8">Start building your collection by adding apps from Discovery</p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            Browse Apps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
          <Heart className="text-purple-600 fill-current" size={40} />
          <span>My Stack</span>
        </h1>
        <p className="text-xl text-gray-600">
          Your personal collection of {myStack.length} amazing apps
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{myStack.length}</div>
          <div className="text-gray-600">Apps Saved</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {new Set(myStack.map(app => app.category)).size}
          </div>
          <div className="text-gray-600">Categories</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {(myStack.reduce((sum, app) => sum + app.rating, 0) / myStack.length).toFixed(1)}
          </div>
          <div className="text-gray-600">Avg Rating</div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myStack.map(app => (
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
              <button
                onClick={() => onRemoveFromStack(app.id)}
                className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={16} />
              </button>
              {app.trending && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  🔥 Trending
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

              <div className="flex space-x-2">
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                  <ExternalLink size={16} />
                  <span>Launch</span>
                </button>
                <button
                  onClick={() => onRemoveFromStack(app.id)}
                  className="bg-red-100 text-red-600 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories breakdown */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories in Your Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(
            myStack.reduce((acc, app) => {
              acc[app.category] = (acc[app.category] || 0) + 1;
              return acc;
            }, {})
          ).map(([category, count]) => (
            <div key={category} className="bg-white rounded-lg shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{count}</div>
              <div className="text-sm text-gray-600">{category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyStack;
window.MyStack = MyStack;