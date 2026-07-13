import React from 'react';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white p-6 h-screen overflow-y-auto">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          CS
        </div>
        <h2 className="text-xl font-bold">CyberShield</h2>
      </div>
      
      <nav className="space-y-2">
        <Link to="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          Dashboard
        </Link>
        <Link to="/courses" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          Courses
        </Link>
        <Link to="/labs" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          Labs
        </Link>
        <Link to="/ai-assistant" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          AI Assistant
        </Link>
        <Link to="/scanner" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          Scanner
        </Link>
        <Link to="/profile" className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          Profile
        </Link>
      </nav>
    </aside>
  );
};
