import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import SmartList from "../../components/SmartList";

interface Category {
  _id: string;
  name: string;
  type: string;
}

export default function Categories() {
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({ name: "", type: "exercise" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState<number>(0);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.warn("نام دسته‌بندی را وارد کنید");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/categories/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ دسته‌بندی بروزرسانی شد");
      } else {
        await axios.post("http://localhost:3000/categories", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ دسته‌بندی اضافه شد");
      }

      setForm({ name: "", type: "exercise" });
      setEditingId(null);
      setRefreshFlag((prev) => prev + 1);
    } catch {
      toast.error("❌ خطا در ذخیره دسته‌بندی");
    }
  };

  const handleEdit = (item: Category) => {
    setForm({ name: item.name, type: item.type });
    setEditingId(item._id);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/categories/${confirmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ دسته‌بندی حذف شد");
      setRefreshFlag((prev) => prev + 1);
    } catch {
      toast.error("❌ خطا در حذف دسته‌بندی");
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-black">
      {/* فرم دسته‌بندی */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-bold text-gray-800 text-center">
          ➕ افزودن دسته‌بندی
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">نام دسته‌بندی</label>
            <input
              className="w-full p-3 border rounded-xl bg-gray-100"
              placeholder="مثلاً پا"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">نوع</label>
            <select
              className="w-full p-3 border rounded-xl bg-gray-100"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="exercise">تمرین</option>
              <option value="food">تغذیه</option>
            </select>
          </div>
        </div>
        <div className="text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-bold"
          >
            {editingId ? "💾 بروزرسانی" : "➕ افزودن"}
          </button>
        </div>
      </div>

      {/* لیست با SmartList */}
      <SmartList
        key={refreshFlag.toString()}
        url="http://localhost:3000/categories"
        title="📂 لیست دسته‌بندی‌ها"
        token={token || ""}
        searchPlaceholder="جستجو بر اساس نام..."
        columns={[
          {
            label: "نام دسته",
            render: (cat: Category) => cat.name,
          },
          {
            label: "نوع",
            render: (cat: Category) =>
              cat.type === "exercise" ? "تمرین" : "تغذیه",
          },
        ]}
        onEdit={handleEdit}
        onDelete={(id) => setConfirmId(id)}
      />

      <ConfirmModal
        open={!!confirmId}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        message="آیا از حذف این دسته‌بندی مطمئن هستید؟"
        confirmText="حذف"
        cancelText="انصراف"
      />
    </div>
  );
}
