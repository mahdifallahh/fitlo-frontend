import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentProfile from './StudentProfile';
import StudentPrograms from './StudentPrograms';

export default function StudentDashboard() {
  const [tab, setTab] = useState<'profile' | 'programs'>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed md:static z-30 top-0 right-0 h-full md:h-auto w-64 md:w-56 bg-white shadow-lg flex flex-col py-8 px-4 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        {/* Mobile close button */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setSidebarOpen(false)} className="text-blue-600 p-2 focus:outline-none">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h2 className="text-xl font-bold text-blue-700 text-center mb-8">پنل شاگرد</h2>
        <nav className="flex-1 space-y-2">
          <button
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${tab === 'profile' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-700 hover:bg-blue-50'}`}
            onClick={() => { setTab('profile'); setSidebarOpen(false); }}
          >
            <span>👤</span> پروفایل
          </button>
          <button
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${tab === 'programs' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-700 hover:bg-blue-50'}`}
            onClick={() => { setTab('programs'); setSidebarOpen(false); }}
          >
            <span>📋</span> برنامه‌های من
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 w-full py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
        >
          خروج
        </button>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header for mobile */}
        <header className="bg-white shadow md:hidden sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setSidebarOpen(true)} className="text-blue-600 p-2 focus:outline-none">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-lg font-bold text-blue-700">پنل شاگرد</span>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">خروج</button>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-8 w-full">
          {tab === 'profile' && <StudentProfile />}
          {tab === 'programs' && <StudentPrograms />}
        </main>
      </div>
    </div>
  );
} 