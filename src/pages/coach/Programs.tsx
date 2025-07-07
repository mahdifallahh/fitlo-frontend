import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from "axios";
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import ExerciseSelector from "../../components/ExerciseSelector";
import ProgramDetailsModal from "../../components/ProgramDetailsModal";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { DataTable } from "../../components/ui/data-table";
import { FormField, FormLabel } from "../../components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { API_ENDPOINTS } from "../../config/api";
import { Exercise, SelectedExercise } from "../../types/exercise";

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
  const [programs, setPrograms] = useState<Program[]>([]);
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
  const [isSubmittingProgram, setIsSubmittingProgram] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, exercisesRes, programsRes] = await Promise.all([
          axios.get(API_ENDPOINTS.users.students, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(API_ENDPOINTS.exercises, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(API_ENDPOINTS.programs, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStudents(studentsRes.data.items || []);
        setExercises(exercisesRes.data.items || []);
        setPrograms(programsRes.data.items || []);
      } catch {
        toast.error("❌ خطا در دریافت اطلاعات");
      }
    };

    fetchData();
  }, [refreshFlag]);

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
    if (!selectedStudent) {
      toast.error("⚠️ لطفاً شاگرد را انتخاب کنید");
      return;
    }

    if (programDays.length === 0) {
      toast.error("⚠️ لطفاً حداقل یک روز را با تمرینات آن ذخیره کنید");
      return;
    }

    setIsSubmittingProgram(true);
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
      setSelectedStudent("");
      setRefreshFlag((f) => f + 1);
    } catch {
      toast.error("❌ خطا در ذخیره برنامه");
    } finally {
      setIsSubmittingProgram(false);
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
      setSelectedProgram(data);
    } catch {
      toast.error("❌ خطا در دریافت اطلاعات برنامه");
    }
  };

  const columns = [
    {
      header: "شاگرد",
      accessorKey: "studentId" as const,
      cell: (program: Program) => program.studentId?.name || "-",
    },
    {
      header: "تعداد روزها",
      accessorKey: "days" as const,
      cell: (program: Program) => program.days?.length || 0,
    },
    {
      header: "عملیات",
      accessorKey: "_id" as const,
      cell: (program: Program) => (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(program)}
            className="h-8 w-24 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center justify-center"
          >
            ویرایش
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmId(program._id)}
            className="h-8 w-24 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 flex items-center justify-center gap-1"
          >
            <TrashIcon className="w-4 h-4" />
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 rtl">
      <div className="w-full max-w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="space-y-1 sm:space-y-1.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              برنامه‌های من
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
              مشاهده و مدیریت برنامه‌های تمرینی خود
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Create Program Form - First in mobile view */}
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 rtl w-full order-1">
            <CardHeader className="border-b border-border/40 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">ساخت برنامه تمرینی</CardTitle>
                  <CardDescription className="text-muted-foreground text-xs sm:text-sm mt-1">
                    برنامه تمرینی جدید را برای خود بسازید
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <form className="space-y-3 sm:space-y-4 md:space-y-6 rtl" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField>
                    <FormLabel className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block text-right">انتخاب شاگرد</FormLabel>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger className="h-9 sm:h-10 bg-background/50 text-right rtl text-xs sm:text-sm">
                        <SelectValue placeholder="-- انتخاب شاگرد --" />
                      </SelectTrigger>
                      <SelectContent className="text-right rtl">
                        {students.map((student) => (
                          <SelectItem key={student._id} value={student._id} className="text-right rtl text-xs sm:text-sm">
                            {student.name} ({student.phone})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField>
                    <FormLabel className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block text-right">انتخاب روز</FormLabel>
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger className="h-9 sm:h-10 bg-background/50 text-right rtl text-xs sm:text-sm">
                        <SelectValue placeholder="-- انتخاب روز --">
                          {selectedDay}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="text-right rtl">
                        {daysOfWeek.map((d) => (
                          <SelectItem key={d} value={d} className="text-right rtl text-xs sm:text-sm">
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="space-y-3 sm:space-y-4 rounded-lg border border-border/40 p-3 sm:p-4 bg-background/50 rtl">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs sm:text-sm font-medium text-right">تمرینات روز {selectedDay}</FormLabel>
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                      {programDays.find(d => d.day === selectedDay)?.exercises.length || 0} تمرین
                    </span>
                  </div>
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
                </div>

                <div className="space-y-3 sm:space-y-4 rtl">
                  <div className="text-xs sm:text-sm text-right">
                    {programDays.length > 0 ? (
                      <span className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/50 px-3 py-2 rounded-lg">
                        <span>✅</span>
                        {programDays.length} روز با موفقیت ذخیره شد
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/50 px-3 py-2 rounded-lg">
                        <span>⚠️</span>
                        لطفاً حداقل یک روز را با تمرینات آن ذخیره کنید
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={handleSubmitFullProgram}
                    disabled={programDays.length === 0 || isSubmittingProgram}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white dark:text-black h-9 sm:h-10 text-xs sm:text-sm "
                  >
                    {isSubmittingProgram ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        در حال ذخیره...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="ml-2">💾</span>
                        ذخیره برنامه تمرینی
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Program List - Second in mobile view */}
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 rtl w-full order-2">
            <CardHeader className="border-b border-border/40 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <div>
                  <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">لیست برنامه‌های تمرینی</CardTitle>
                  <CardDescription className="text-muted-foreground text-xs sm:text-sm mt-1">
                    برنامه‌های تمرینی ثبت شده را مشاهده و مدیریت کنید
                  </CardDescription>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                  {programs.length} برنامه
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <div className="rtl min-w-0">
                <DataTable
                  className="mt-10 p-4"
                  data={programs}
                  columns={columns}
                  searchable={true}
                  searchPlaceholder="جستجوی برنامه..."
                  emptyMessage="هیچ برنامه‌ای یافت نشد"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
