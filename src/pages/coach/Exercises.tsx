import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import SmartList from "../../components/SmartList";

interface Category {
  _id: string;
  name: string;
}

interface Exercise {
  _id: string;
  name: string;
  gifUrl?: string;
  videoLink?: string;
  categoryId?: {
    _id: string;
    name: string;
  };
}

export default function Exercises() {
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [gifFile, setGifFile] = useState<File | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/categories?type=exercise",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(data.items || []);
      } catch {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("⚠️ لطفاً نام تمرین را وارد کنید");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (categoryId) formData.append("categoryId", categoryId);
    if (videoLink) formData.append("videoLink", videoLink);
    if (gifFile) formData.append("gif", gifFile);

    try {
      await axios.post("http://localhost:3000/exercises", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ تمرین با موفقیت ثبت شد");
      setName("");
      setCategoryId("");
      setVideoLink("");
      setGifFile(null);
      setRefreshFlag((f) => f + 1);
    } catch (err) {
      toast.error("❌ خطا در ثبت تمرین");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/exercises/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ تمرین حذف شد");
      setRefreshFlag((f) => f + 1);
    } catch {
      toast.error("❌ خطا در حذف تمرین");
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 text-black">
      {/* فرم افزودن تمرین */}
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">🏋️‍♂️ افزودن تمرین</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-black">
              نام تمرین *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full  p-3 rounded-xl border border-blue-300 text-blue-900 bg-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="مثلاً اسکوات"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-black">
              دسته‌بندی
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full  p-3 rounded-xl border border-blue-300 text-blue-900 bg-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="">-- انتخاب کنید --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1 text-black">
              فایل گیف (حداکثر ۵MB)
            </label>
            <input
              type="file"
              accept="image/gif"
              onChange={(e) => setGifFile(e.target.files?.[0] || null)}
              className="w-full border p-2 rounded-xl border-blue-300 text-blue-900"
            />
            {gifFile && (
              <p className="text-sm text-gray-700 mt-1">
                فایل انتخاب‌شده: {gifFile.name}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1 text-black">
              لینک ویدیو
            </label>
            <input
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="w-full  p-3 rounded-xl border border-blue-300 text-blue-900 bg-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="لینک آپارات یا یوتیوب"
            />
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-bold transition"
          >
            ذخیره تمرین
          </button>
        </div>
      </div>

      {/* لیست تمرینات */}
      <SmartList<Exercise>
        key={refreshFlag.toString()}
        url="http://localhost:3000/exercises"
        title="📋 لیست تمرینات"
        token={token || ""}
        searchPlaceholder="جستجوی نام تمرین..."
        filters={[
          {
            field: "categoryId",
            label: "دسته‌بندی",
            options:
              categories.map((cat) => ({
                label: cat.name,
                value: cat._id,
              }))
            ,
          },
        ]}
        columns={[
          {
            label: "نام",
            render: (item) => item.name,
          },
          {
            label: "دسته‌بندی",
            render: (item) => item.categoryId?.name || "--",
          },
          {
            label: "ویدیو",
            render: (item) =>
              item.videoLink ? (
                <a
                  href={item.videoLink}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  مشاهده
                </a>
              ) : (
                "--"
              ),
          },
          {
            label: "گیف",
            render: (item) =>
              item.gifUrl ? (
                <img
                  src={item.gifUrl}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded"
                />
              ) : (
                "--"
              ),
          },
        ]}
        onDelete={(id) => setConfirmId(id)}
      />

      <ConfirmModal
        open={!!confirmId}
        message="آیا از حذف این تمرین مطمئن هستید؟"
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
