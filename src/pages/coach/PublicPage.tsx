import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function PublicPage() {
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        
      if (!data.isPremium) {
        toast.warning("⛔️ شما به نسخه پرمیوم دسترسی ندارید");
        setProfile(null);
        return;
      }
      setProfile(data);
      } catch {
        toast.error("❌ خطا در دریافت اطلاعات پروفایل");
      }
    };

    fetch();
  }, []);

  const handleCopy = () => {
    const link = `${window.location.origin}/public/${profile.phone}`;
    navigator.clipboard.writeText(link);
    toast.success("✅ لینک صفحه شما کپی شد!");
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
        <h1 className="text-xl text-gray-600">
          این بخش فقط برای کاربران پرمیوم فعال است.
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-3xl bg-white p-6 rounded-xl shadow space-y-6 w-full mx-4">
        {/* Header */}
        <div className="bg-blue-700 text-white py-8 px-6 text-center space-y-3">
          {profile.profileImage && (
            <img
              src={profile.profileImage}
              alt="profile"
              className="w-24 h-24 mx-auto rounded-full border-4 border-white object-cover"
            />
          )}
          <h1 className="text-3xl font-extrabold">
            {profile.name || "بدون نام"}
          </h1>
          <p className="text-sm opacity-80">{profile.phone}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-right">
          {profile.bio && (
            <p className="text-gray-700 text-lg whitespace-pre-line leading-relaxed">
              {profile.bio}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-center">
            {profile.whatsapp && (
              <a
                href={profile.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-100 hover:bg-green-200 text-green-700 py-3 rounded-xl font-semibold transition"
              >
                واتساپ
              </a>
            )}
            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-100 hover:bg-pink-200 text-pink-600 py-3 rounded-xl font-semibold transition"
              >
                اینستاگرام
              </a>
            )}
            {profile.telegram && (
              <a
                href={profile.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-100 hover:bg-blue-200 text-blue-600 py-3 rounded-xl font-semibold transition"
              >
                تلگرام
              </a>
            )}
            {profile.youtube && (
              <a
                href={profile.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-100 hover:bg-red-200 text-red-600 py-3 rounded-xl font-semibold transition"
              >
                یوتیوب
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition"
              >
                ایمیل
              </a>
            )}
          </div>
        </div>

        {/* Footer & Copy */}
        <div className="bg-gray-50 py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <span>
            صفحه شخصی مربی در <strong>فیتلو</strong>
          </span>
          <button
            onClick={handleCopy}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition text-sm"
          >
            📋 کپی لینک صفحه من
          </button>
        </div>
      </div>
    </div>
  );
}
