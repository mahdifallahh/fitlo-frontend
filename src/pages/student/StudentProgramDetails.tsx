import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Exercise {
  _id: string;
  name: string;
  videoLink?: string;
  categoryName?: string;
  sets: number;
  reps: number;
}

interface Day {
  _id: string;
  day: string;
  exercises: Exercise[];
}

interface ProgramDetails {
  _id: string;
  days: Day[];
  createdAt: string;
  coach?: {
    name: string;
    phone: string;
  };
}

export default function StudentProgramDetails() {
  const { programId } = useParams();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProgram = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/student/programs/${programId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProgram(res.data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در دریافت برنامه');
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [programId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
        برنامه پیدا نشد.
      </div>
    );
  }

  const days = program.days || [];
  const currentDay = days[selectedDay];

  return (
    <div className="flex flex-col md:flex-row max-w-4xl mx-auto bg-white rounded-xl shadow overflow-hidden mt-4">
      {/* Sidebar for days */}
      <aside className="md:w-56 bg-blue-50 border-b md:border-b-0 md:border-l-0 md:border-r border-blue-100 flex md:flex-col md:items-stretch items-center md:justify-start justify-between md:py-8 py-2 px-2 md:px-0">
        {/* Mobile hamburger */}
        <div className="md:hidden flex w-full justify-between items-center mb-2">
          <span className="font-bold text-blue-700">روزهای برنامه</span>
          <button onClick={() => setSidebarOpen((v) => !v)} className="text-blue-600 p-2 focus:outline-none">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Days list */}
        <nav
          className={`flex-1 flex md:flex-col gap-2 w-full overflow-x-auto md:overflow-x-visible transition-all duration-200 ${sidebarOpen ? 'max-h-96' : 'max-h-12 md:max-h-full'} md:max-h-full`}
        >
          {days.map((day, idx) => (
            <button
              key={day._id}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-bold text-sm transition-colors flex-shrink-0 ${
                selectedDay === idx
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-blue-700 hover:bg-blue-100 border border-blue-100'
              }`}
              onClick={() => {
                setSelectedDay(idx);
                setSidebarOpen(false);
              }}
            >
              {day.day}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
          <div>
            <div className="font-bold text-blue-700 text-lg mb-1">برنامه تمرینی</div>
            {program.coach && (
              <div className="text-sm text-gray-600">
                مربی: {program.coach.name} ({program.coach.phone})
              </div>
            )}
            <div className="text-xs text-gray-400">
              تاریخ ثبت: {new Date(program.createdAt).toLocaleDateString('fa-IR')}
            </div>
          </div>
        </div>

        {/* Exercises List */}
        <div>
          {currentDay && currentDay.exercises.length > 0 ? (
            <div className="space-y-4">
              {currentDay.exercises.map((ex, i) => (
                <div
                  key={ex._id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 rounded-lg p-3 shadow-sm"
                >
                  <div>
                    <div className="font-bold text-blue-800">{i + 1}. {ex.name}</div>
                    <div className="text-xs text-gray-500">
                      {ex.categoryName && <>دسته‌بندی: {ex.categoryName} | </>}
                      ست: {ex.sets} | تکرار: {ex.reps}
                    </div>
                  </div>
                  {ex.videoLink && (
                    <a
                      href={ex.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 md:mt-0 px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors"
                    >
                      مشاهده ویدیو
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">تمرینی برای این روز ثبت نشده است.</div>
          )}
        </div>
      </main>
    </div>
  );
} 