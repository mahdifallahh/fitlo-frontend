import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Premium() {
  const token = localStorage.getItem("token");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "pending" | "accepted" | "rejected" | null
  >(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const fetchProfile = async () => {
    const { data } = await axios.get("http://localhost:3000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStatus(data.premiumStatus || null);
    setReceiptUrl(data.receiptUrl || null);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpload = async () => {
    if (!file) return toast.error("لطفاً فایل رسید را انتخاب کن!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        "http://localhost:3000/users/request-premium",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("درخواست با موفقیت ارسال شد");
      fetchProfile();
    } catch {
      toast.error("خطا در ارسال فایل. فقط تصویر یا PDF تا ۵ مگابایت مجاز است");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8 mt-8">
      <h1 className="text-2xl font-bold text-center text-blue-700">
        ✨ درخواست ارتقا به نسخه پرمیوم
      </h1>

      <p className="text-gray-600 leading-7 text-center">
        برای فعال‌سازی نسخه پرمیوم، مبلغ{" "}
        <span className="font-bold text-black">۵۰۰ تومان</span> پرداخت کن و
        تصویر یا فایل رسید رو بارگذاری کن. ادمین بعد از بررسی نتیجه رو اعلام
        می‌کنه.
      </p>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          آپلود رسید (عکس یا PDF)
        </label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full border p-2 rounded-xl bg-gray-50 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
        {file && <p className="text-sm text-gray-500">📎 {file.name}</p>}
      </div>

      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition"
      >
        🚀 ارسال درخواست
      </button>

      {status && (
        <div className="bg-gray-50 p-4 rounded-xl shadow-inner border space-y-2">
          <p className="text-sm text-gray-700">
            <strong>وضعیت درخواست:</strong>{" "}
            <span
              className={
                status === "accepted"
                  ? "text-green-600"
                  : status === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }
            >
              {status === "accepted"
                ? "تایید شده ✅"
                : status === "pending"
                ? "در انتظار تایید ⏳"
                : "رد شده ❌"}
            </span>
          </p>

          {receiptUrl && (
            <a
              href={receiptUrl}
              target="_blank"
              className="text-blue-600 hover:underline text-sm"
            >
              مشاهده رسید آپلود شده
            </a>
          )}
        </div>
      )}
    </div>
  );
}
