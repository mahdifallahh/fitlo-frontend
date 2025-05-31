import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';
import StudentProgramModal from '../../components/StudentProgramModal';

interface Program {
  _id: string;
  title: string;
  coach: {
    name: string;
    phone: string;
  };
  createdAt: string;
  days: {
    day: string;
    exercises: {
      name: string;
      sets?: number;
      reps?: number;
    }[];
  }[];
  studentId?: {
    name: string;
  };
}

export default function StudentPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const res = await axios.get(`${API_ENDPOINTS.programs}/student/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrograms(res.data.items);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'خطا در دریافت برنامه‌ها');
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!programs.length) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
        <img src="/empty-state.svg" alt="empty" className="mx-auto w-32 mb-4" />
        هنوز برنامه‌ای برای شما ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="space-y-4 rtl">
      {programs.map((program) => (
        <div
          key={program._id}
          className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex-1">
            <div className="font-bold text-blue-700 text-lg mb-1">مربی: {program.coach?.name || '-'}</div>
            <div className="text-sm text-gray-600 mb-1">
              شماره تماس: {program.coach?.phone || '-'}
            </div>
            <div className="text-xs text-gray-400">
              تاریخ ثبت: {new Date(program.createdAt).toLocaleDateString('fa-IR')}
            </div>
          </div>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors w-full md:w-auto"
            onClick={() => {
              setSelectedProgram(program);
              setIsModalOpen(true);
            }}
          >
            مشاهده برنامه
          </button>
        </div>
      ))}

      {selectedProgram && (
        <StudentProgramModal
          open={isModalOpen}
          programTitle={selectedProgram.title}
          coach={selectedProgram.coach}
          days={selectedProgram.days.map((d) => ({
            ...d,
            exercises: d.exercises.map((ex) => ({
              ...ex,
              sets: String(ex.sets ?? ""),
              reps: String(ex.reps ?? ""),
            })),
          }))}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProgram(null);
          }}
        />
      )}
    </div>
  );
}
