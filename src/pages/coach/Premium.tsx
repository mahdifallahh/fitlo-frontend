import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../config/api";
import { PremiumStatusEnum } from "../../types/user";

export default function Premium() {
  const token = localStorage.getItem("token");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<PremiumStatusEnum | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(API_ENDPOINTS.users.me, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
        setStatus(data.premiumStatus || null);
        setReceiptUrl(data.receiptUrl || null);
      } catch {
        toast.error("❌ خطا در دریافت اطلاعات پروفایل");
      }
    };

    fetchProfile();
  }, []);

  const handleUpload = async () => {
    if (!file) return toast.error("لطفاً فایل رسید را انتخاب کن!");

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        API_ENDPOINTS.users.requestPremium,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStatus(PremiumStatusEnum.PENDING);
      setReceiptUrl(response.data.receiptUrl);
      toast.success("درخواست با موفقیت ارسال شد");
      setFile(null); // Clear the file input
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در ارسال فایل. فقط تصویر یا PDF تا ۵ مگابایت مجاز است");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExpiryDate = (premiumAt: string) => {
    const date = new Date(premiumAt);
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString('fa-IR');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8 mt-8">
      <h1 className="text-2xl font-bold text-center text-blue-700">
        ✨ درخواست ارتقا به نسخه پرمیوم
      </h1>

      {status === PremiumStatusEnum.ACCEPTED ? (
        <div className="bg-green-50 p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-center text-green-600 text-lg">
            <span className="text-2xl mr-2">✅</span>
            <span>شما کاربر پرمیوم هستید</span>
          </div>
          <div className="text-center space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">تاریخ فعال‌سازی:</span>{" "}
              {new Date(profile.premiumAt).toLocaleDateString('fa-IR')}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">تاریخ انقضا:</span>{" "}
              {profile.premiumExpiresAt ? new Date(profile.premiumExpiresAt).toLocaleDateString('fa-IR') : getExpiryDate(profile.premiumAt)}
            </p>
          </div>
        </div>
      ) : (
        <>
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
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? 'در حال ارسال...' : '🚀 ارسال درخواست'}
          </button>
        </>
      )}

      {status === PremiumStatusEnum.PENDING && (
        <div className="bg-yellow-50 p-4 rounded-xl shadow-inner border space-y-2">
          <p className="text-sm text-yellow-700">
            <strong>وضعیت درخواست:</strong>{" "}
            <span className="text-yellow-600">در انتظار تایید ⏳</span>
          </p>

          {receiptUrl && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                می‌توانید با آپلود رسید جدید، رسید قبلی را جایگزین کنید.
              </p>
              <a
                href={receiptUrl}
                target="_blank"
                className="text-blue-600 hover:underline text-sm"
              >
                مشاهده رسید فعلی
              </a>
            </div>
          )}
        </div>
      )}

      {status === PremiumStatusEnum.REJECTED && (
        <div className="bg-red-50 p-4 rounded-xl shadow-inner border">
          <p className="text-sm text-red-700">
            <strong>وضعیت درخواست:</strong>{" "}
            <span className="text-red-600">رد شده ❌</span>
          </p>
          <p className="text-sm text-red-600 mt-2">
            درخواست شما رد شده است. می‌توانید مجدداً درخواست ارسال کنید.
          </p>
        </div>
      )}
    </div>
  );
}
