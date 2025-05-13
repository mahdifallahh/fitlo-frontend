import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import SmartList from "../../components/SmartList";
import { Eye, EyeOff } from "lucide-react";
import { API_ENDPOINTS } from "../../config/api";
import Modal from "../../components/Modal";

interface Student {
  _id: string;
  name: string;
  phone: string;
}

export default function Students() {
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [programData, setProgramData] = useState<any>(null);
  const [programLoading, setProgramLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.phone || (!editingId && !form.password)) {
      return toast.warn("لطفاً تمام فیلدها را پر کنید");
    }
    try {
      if (editingId) {
        await axios.put(
          `${API_ENDPOINTS.users.students}/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("✅ دانش‌آموز با موفقیت ویرایش شد");
      } else {
        await axios.post(API_ENDPOINTS.users.students, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ دانش‌آموز با موفقیت اضافه شد");
      }
      setForm({ name: "", phone: "", password: "" });
      setEditingId(null);
      setRefreshFlag((f) => f + 1);
    } catch (err: any) {
      const msg = err.response?.data?.message || "خطا در ثبت اطلاعات";
      toast.error("❌ " + msg);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student._id);
    setForm({ name: student.name, phone: student.phone, password: "" });
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_ENDPOINTS.users.students}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ دانش‌آموز حذف شد");
      setRefreshFlag((f) => f + 1);
    } catch {
      toast.error("❌ خطا در حذف دانش‌آموز");
    } finally {
      setConfirmId(null);
    }
  };

  const handleViewProgram = async (student: Student) => {
    setProgramLoading(true);
    setProgramModalOpen(true);
    try {
      const { data } = await axios.get(`${API_ENDPOINTS.programs}?studentId=${student._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // فرض: فقط یک برنامه فعال برای هر شاگرد
      setProgramData(data.items?.[0] || null);
    } catch (err) {
      toast.error("خطا در دریافت برنامه شاگرد");
      setProgramData(null);
    } finally {
      setProgramLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* فرم افزودن شاگرد */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          📋 مدیریت شاگردها
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            className="border p-3 rounded-xl bg-gray-100 text-black"
            placeholder="نام کامل"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            className="border p-3 rounded-xl bg-gray-100 text-black"
            placeholder="شماره تلفن"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-3 rounded-xl bg-gray-100 text-black w-full pr-12"
                placeholder="رمز عبور اولیه"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none border-none shadow-none bg-transparent"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
       
        </div>

        <div className="text-right mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-bold"
          >
            {editingId ? "💾 ذخیره تغییرات" : "➕ افزودن شاگرد"}
          </button>
        </div>
      </div>

      {/* لیست شاگردها */}
      <SmartList<Student>
        key={refreshFlag.toString()}
        url={API_ENDPOINTS.users.students}
        title="📋 لیست دانش‌آموزان"
        token={token || ""}
        searchPlaceholder="جستجوی نام یا شماره..."
        columns={[
          {
            label: "نام",
            render: (item) => item.name,
          },
          {
            label: "شماره",
            render: (item) => item.phone,
          },
          {
            label: "برنامه",
            render: (item) => (
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                onClick={() => handleViewProgram(item)}
              >
                مشاهده برنامه
              </button>
            ),
          },
        ]}
        onEdit={handleEdit}
        onDelete={(id) => setConfirmId(id)}
      />

      <ConfirmModal
        open={!!confirmId}
        message="آیا از حذف این شاگرد مطمئن هستید؟"
        onConfirm={() => handleDelete(confirmId || "")}
        onCancel={() => setConfirmId(null)}
        confirmText="حذف"
        cancelText="انصراف"
      />

      <Modal open={programModalOpen} onClose={() => setProgramModalOpen(false)}>
        {programLoading ? (
          <div className="p-8 text-center">در حال دریافت برنامه...</div>
        ) : programData ? (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto text-black">
            <h2 className="text-xl font-bold text-blue-700 text-center mb-4">
              برنامه شاگرد: {programData.studentId?.name}
            </h2>
            {programData.days?.map((d: any, idx: number) => (
              <div key={d.day || idx} className="border border-gray-300 rounded-xl p-4 space-y-3 bg-gray-50">
                <h3 className="font-bold text-blue-600 text-right">{d.day}</h3>
                {d.exercises.length === 0 && (
                  <p className="text-sm text-gray-500">تمرینی برای این روز ثبت نشده</p>
                )}
                {d.exercises.map((ex: any, i: number) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-3">
                    <div className="flex-1">
                      <p className="font-semibold">{ex.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>ست: {ex.sets || 0}</span>
                        <span>تکرار: {ex.reps || 0}</span>
                        {ex.categoryName && <span>دسته‌بندی: {ex.categoryName}</span>}
                      </div>
                    </div>
                    {ex.gifUrl && (
                      <img src={ex.gifUrl} alt={ex.name} className="w-20 h-20 object-cover rounded" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">برنامه‌ای برای این شاگرد ثبت نشده است.</div>
        )}
      </Modal>
    </div>
  );
}
