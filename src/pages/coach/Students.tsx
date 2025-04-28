import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import SmartList from "../../components/SmartList";
import { Eye, EyeOff } from "lucide-react";
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

  const handleSubmit = async () => {
    if (!form.name || !form.phone || (!editingId && !form.password)) {
      return toast.warn("لطفاً تمام فیلدها را پر کنید");
    }
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:3000/users/students/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("✅ شاگرد با موفقیت ویرایش شد");
      } else {
        await axios.post("http://localhost:3000/users/students", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ شاگرد جدید افزوده شد");
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

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/users/students/${confirmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ شاگرد حذف شد");
      setRefreshFlag((f) => f + 1);
    } catch {
      toast.error("❌ خطا در حذف شاگرد");
    } finally {
      setConfirmId(null);
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
      <SmartList
        key={refreshFlag.toString()}
        url="http://localhost:3000/users/students"
        title="📋 لیست شاگردها"
        token={token || ""}
        searchPlaceholder="جستجو بر اساس نام یا شماره..."
        columns={[
          { label: "نام", dataIndex: "name" },
          { label: "شماره", dataIndex: "phone" },
        ]}
        onEdit={handleEdit}
        onDelete={(id) => setConfirmId(id)}
      />

      <ConfirmModal
        open={!!confirmId}
        message="آیا از حذف این شاگرد مطمئن هستید؟"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        confirmText="حذف"
        cancelText="انصراف"
      />
    </div>
  );
}
