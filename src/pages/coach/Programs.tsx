import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ExerciseSelector from "../../components/ExerciseSelector";
import { Exercise, SelectedExercise } from "../../types/exercise";
import SmartList from "../../components/SmartList";
import ConfirmModal from "../../components/ConfirmModal";
import ProgramDetailsModal from "../../components/ProgramDetailsModal";
import { API_ENDPOINTS } from "../../config/api";

const daysOfWeek = [
  "روز اول",
  "روز دوم",
  "روز سوم",
  "روز چهارم",
  "روز پنجم",
  "روز ششم",
  "روز هفتم",
];

interface Program {
  _id: string;
  name: string;
  studentId: {
    name: string;
    phone: string;
  };
  exercises: any[];
  days: {
    day: string;
    exercises: {
      name: string;
      sets: number;
      reps: number;
      gifUrl?: string;
      videoLink?: string;
      categoryName?: string;
    }[];
  }[];
}

export default function Programs() {
  const token = localStorage.getItem("token");
  const [students, setStudents] = useState<any[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedDay, setSelectedDay] = useState("روز اول");
  const [programDays, setProgramDays] = useState<
    { day: string; exercises: SelectedExercise[] }[]
  >([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(Date.now());
  const [name, setName] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, exercisesRes] = await Promise.all([
          axios.get(API_ENDPOINTS.users.students, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(API_ENDPOINTS.exercises, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStudents(studentsRes.data.items || []);
        setExercises(exercisesRes.data.items || []);
      } catch {
        toast.error("❌ خطا در دریافت اطلاعات");
      }
    };

    fetchData();
  }, []);

  const handleSaveDay = (dayExercises: SelectedExercise[]) => {
    setProgramDays((prev) => {
      const newDays = prev.filter((d) => d.day !== selectedDay);
      return [...newDays, { day: selectedDay, exercises: dayExercises }];
    });

    const currentIndex = daysOfWeek.indexOf(selectedDay);
    if (currentIndex < daysOfWeek.length - 1) {
      setSelectedDay(daysOfWeek[currentIndex + 1]);
    }
  };

  const handleSubmitFullProgram = async () => {
    if (!selectedStudent) return;

    try {
      await axios.post(
        API_ENDPOINTS.programs,
        {
          studentId: selectedStudent,
          days: programDays,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ برنامه ذخیره شد");
      setProgramDays([]);
      setSelectedDay("روز اول");
      setRefreshFlag((f) => f + 1);
    } catch {
      toast.error("❌ خطا در ذخیره برنامه");
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("⚠️ لطفاً نام برنامه را وارد کنید");
      return;
    }

    if (!selectedStudent) {
      toast.error("⚠️ لطفاً دانش‌آموز را انتخاب کنید");
      return;
    }

    if (selectedExercises.length === 0) {
      toast.error("⚠️ لطفاً حداقل یک تمرین انتخاب کنید");
      return;
    }

    try {
      await axios.post(
        API_ENDPOINTS.programs,
        {
          name,
          studentId: selectedStudent,
          exerciseIds: selectedExercises,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ برنامه با موفقیت ثبت شد");
      setName("");
      setSelectedStudent("");
      setSelectedExercises([]);
      setRefreshFlag((f) => f + 1);
    } catch {
      toast.error("❌ خطا در ثبت برنامه");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_ENDPOINTS.programs}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("✅ برنامه حذف شد");
      setRefreshFlag((f) => f + 1);
    } catch {
      toast.error("❌ خطا در حذف برنامه");
    } finally {
      setConfirmId(null);
    }
  };

  const handleEdit = async (program: Program) => {
    try {
      const { data } = await axios.get(`${API_ENDPOINTS.programs}/${program._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName(data.name);
      setSelectedStudent(data.studentId);
      setSelectedExercises(data.exerciseIds);
      setEditingId(program._id);
    } catch {
      toast.error("❌ خطا در دریافت اطلاعات برنامه");
    }
  };

  const handleView = async (id: string) => {
    try {
      const { data } = await axios.get(`${API_ENDPOINTS.programs}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedProgram(data);
    } catch {
      toast.error("❌ خطا در دریافت اطلاعات برنامه");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10 text-black">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        📆 ساخت برنامه تمرینی هفتگی
      </h1>

      {/* فرم ساخت برنامه */}
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        {/* شاگرد */}
        <div>
          <label className="block font-bold mb-1 text-black ">
            👤 انتخاب شاگرد
          </label>
          <select
            className="w-full border p-3 rounded-xl border border-blue-300 text-blue-900 bg-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">-- انتخاب شاگرد --</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name || "---"} - {s.phone}
              </option>
            ))}
          </select>
        </div>

        {/* روز */}
        <div>
          <label className="block font-bold mb-1 text-black">
            🗓️ انتخاب روز
          </label>
          <select
            className="w-full border p-3 rounded-xl border border-blue-300 text-blue-900 bg-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {daysOfWeek.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* انتخاب تمرین */}
        <ExerciseSelector
          allExercises={exercises}
          defaultSelected={(
            programDays.find((d) => d.day === selectedDay)?.exercises || []
          ).map((ex) => ({
            _id: ex._id,
            name: ex.name,
            gifUrl: ex.gifUrl,
            videoLink: ex.videoLink,
            sets: ex.sets ?? 0,
            reps: ex.reps ?? 0,
            categoryId: ex.categoryId,
          }))}
          onSave={handleSaveDay}
        />

        {/* ذخیره نهایی */}
        <div className="text-left pt-4">
          <button
            onClick={handleSubmitFullProgram}
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition font-bold"
          >
            💾 ذخیره برنامه تمرینی
          </button>
        </div>
      </div>

      {/* لیست برنامه‌های ذخیره شده */}
      <SmartList<Program>
        key={refreshFlag.toString()}
        url={API_ENDPOINTS.programs}
        title="📋 لیست برنامه‌ها"
        token={token || ""}
        searchPlaceholder="جستجوی نام برنامه..."
        columns={[
          {
            label: "نام",
            render: (item) => item.name,
          },
          {
            label: "دانش‌آموز",
            render: (item) => item.studentId?.name || "--",
          },
          {
            label: "تعداد تمرین",
            render: (item) => item.exercises?.length || 0,
          },
        ]}
        onEdit={handleEdit}
        onDelete={(id) => setConfirmId(id)}
      />

      <ConfirmModal
        open={!!confirmId}
        message="آیا از حذف این برنامه مطمئن هستید؟"
        onConfirm={() => handleDelete(confirmId || "")}
        onCancel={() => setConfirmId(null)}
        confirmText="حذف"
        cancelText="انصراف"
      />

      {selectedProgram && (
        <ProgramDetailsModal
          open={!!selectedProgram}
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  );
}
