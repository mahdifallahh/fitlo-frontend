import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CoachProfile() {
  const token = localStorage.getItem("token");
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm(data);
      if (data.profileImage) setPreview(data.profileImage);
    } catch {
      toast.error("❌ خطا در دریافت اطلاعات پروفایل");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.put("http://localhost:3000/users/me", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ اطلاعات ذخیره شد");
      fetchProfile(); // ✅ لود مجدد اطلاعات پس از ذخیره موفق
    } catch {
      toast.error("❌ خطا در ذخیره اطلاعات");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    const link = `${window.location.origin}/public/${form.phone}`;
    navigator.clipboard.writeText(link);
    toast.success("✅ لینک صفحه شما کپی شد!");
  };

  const handleUpload = async () => {
    if (!file) return toast.warning("⚠️ لطفاً یک عکس انتخاب کن");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.put(
        "http://localhost:3000/users/upload-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("✅ عکس با موفقیت آپلود شد");
      await fetchProfile();
      setPreview(data.profileImage);
    } catch {
      toast.error("❌ خطا در آپلود عکس");
    }
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
            👤
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800">
          {form.name || "پروفایل من"}
        </h2>
      </div>

      {/* فرم اطلاعات عمومی */}
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-black">
              شماره تلفن
            </label>
            <input
              disabled
              value={form.phone || ""}
              className="w-full border p-3 rounded-xl bg-gray-100 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-black">
              رمز عبور
            </label>
            <input
              disabled
              value={"********"}
              className="w-full border p-3 rounded-xl bg-gray-100 text-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1 text-black">
            نام کامل
          </label>
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl bg-gray-100 text-black"
            placeholder="نام خود را وارد کنید"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1  text-black">
            بیوگرافی
          </label>
          <textarea
            name="bio"
            value={form.bio || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl bg-gray-100 text-black"
            rows={4}
            placeholder="درباره خودت بنویس..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {["instagram", "whatsapp", "youtube", "telegram", "email"].map(
            (field) => (
              <div key={field}>
                <label className="block text-sm font-bold mb-1 text-black">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  name={field}
                  value={form[field] || ""}
                  onChange={handleChange}
                  className="w-full border p-3 bg-gray-100 rounded-xl text-black"
                  placeholder={`لینک ${field}`}
                />
              </div>
            )
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold mb-1 text-black">
            آپلود تصویر پروفایل
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFile(file);
              if (file) {
                const reader = new FileReader();
                reader.onload = () => setPreview(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
            className="w-full border p-2 rounded-xl bg-gray-100 text-black"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            آپلود تصویر
          </button>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition font-bold"
          >
            ذخیره اطلاعات
          </button>

          {form.isPremium && (
            <button
              onClick={handleCopy}
              className="bg-gray-200 text-blue-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition text-sm"
            >
              📋 کپی لینک صفحه عمومی من
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
