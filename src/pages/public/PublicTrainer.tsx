import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PublicTrainer() {
  const { phone } = useParams();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/users/public/${phone}`
        );
        setProfile(data);
      } catch {
        setProfile(null);
      }
    };

    fetch();
  }, [phone]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
        <h1 className="text-xl text-gray-600">
          کاربری با این شماره پیدا نشد ❌
        </h1>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl overflow-hidden">
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
          <p className="text-sm opacity-80">{phone}</p>
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

        {/* Footer */}
        <div className="bg-gray-50 text-center py-3 text-sm text-gray-500">
          صفحه شخصی مربی در <strong>فیتلو</strong>
        </div>
      </div>
    </div>
  );
}
