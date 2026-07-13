import React from 'react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            CS
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CyberShield Pro</h1>
        </div>
        <nav className="flex gap-6">
          <a href="#" className="text-gray-600 hover:text-gray-900">Learn</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Labs</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Community</a>
        </nav>
      </div>
    </header>
  );
};
