import React from 'react';
import { User } from '../types/user';

interface DashboardProps {
  user: User;
  children: React.ReactNode;
  title: string;
}

export default function Dashboard({ user, children, title }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user.name}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                className="text-red-600 hover:text-red-800"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 