import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS, getUploadUrl } from "../../config/api";

export default function CoachProfile() {
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    name: "",
    bio: "",
    phone: "",
    signedProfilePictureUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.users.me, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        name: data.name || "",
        bio: data.bio || "",
        phone: data.phone || "",
        signedProfilePictureUrl: data.signedProfilePictureUrl || "",   
      });
      if (data.profileImage) {
        setPreview(getImageUrl(data.profileImage));
      }
    } catch {
      toast.error("❌ خطا در دریافت اطلاعات پروفایل");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("⚠️ لطفاً نام را وارد کنید");
      return;
    }

    try {
      await axios.put(API_ENDPOINTS.users.me, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ پروفایل با موفقیت بروزرسانی شد");
    } catch {
      toast.error("❌ خطا در بروزرسانی پروفایل");
    }
  };

  const handleUploadProfile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post(API_ENDPOINTS.users.uploadProfile, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setForm((prev) => ({ ...prev, profileUrl: data.url }));
      toast.success("✅ عکس پروفایل با موفقیت آپلود شد");
    } catch {
      toast.error("❌ خطا در آپلود عکس پروفایل");
    }
  };

  const getImageUrl = (url: string) => {
    return getUploadUrl(url);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10 text-black">
      {/* Header با نام و تصویر */}
      <div className="flex items-center gap-6">
        {preview ? (
          <img
            src={preview}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl">
          <img
            src={form.signedProfilePictureUrl}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
          />
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800">
          {form.name || "پروفایل من"}
        </h2>
      </div>

      {/* فرم اطلاعات عمومی */}
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <h3 className="text-xl font-bold text-gray-900">اطلاعات عمومی</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-black">
              نام و نام خانوادگی
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-blue-300 text-blue-900 bg-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="مثلاً علی محمدی"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-black">
              شماره موبایل
            </label>
            <input
              value={form.phone}
              disabled
              className="w-full p-3 rounded-xl border border-gray-300 text-gray-500 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-black">
              درباره من
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full p-3 rounded-xl border border-blue-300 text-blue-900 bg-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="توضیحات مختصری درباره خودتان..."
              rows={4}
            />
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-bold transition"
          >
            ذخیره تغییرات
          </button>
        </div>
      </div>

      {/* آپلود عکس پروفایل */}
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <h3 className="text-xl font-bold text-gray-900">عکس پروفایل</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-black">
              انتخاب عکس جدید
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadProfile}
              className="w-full border p-2 rounded-xl border-blue-300 text-blue-900"
            />
            {file && (
              <p className="text-sm text-gray-700 mt-1">
                فایل انتخاب‌شده: {file.name}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-bold transition"
          >
            آپلود عکس
          </button>
        </div>
      </div>
    </div>
  );
}
