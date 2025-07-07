import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../config/api";
import { Card, CardHeader, CardContent, CardFooter } from "../../components/ui/card";
import { Typography } from "../../components/ui/typography";
import { Button } from "../../components/ui/button";

export default function PublicTrainer() {
  const { phone } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const { data } = await axios.get(
          API_ENDPOINTS.users.public(phone || ''),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(data);
      } catch {
        toast.error("❌ خطا در دریافت اطلاعات مربی");
      }
    };

    if (phone) {
      fetchTrainer();
    }
  }, [phone]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
        <Typography variant="h1" className="text-xl text-gray-600">
          کاربری با این شماره پیدا نشد ❌
        </Typography>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-white shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-blue-700 text-white py-8 px-6 text-center space-y-3">
          <div className="flex items-center justify-center">
            {profile.signedProfilePictureUrl && (
              <img
                src={profile.signedProfilePictureUrl}
                alt="profile"
                className="w-24 h-24 mx-auto rounded-full border-4 border-white object-cover"
              />
            )}
          </div>
          <Typography variant="h1" className="text-3xl font-extrabold">
            {profile.name || "بدون نام"}
          </Typography>
          <Typography variant="body2" className="text-sm opacity-80">
            {phone}
          </Typography>
        </CardHeader>

        <CardContent className="p-6 space-y-6 text-right">
          {profile.bio && (
            <Typography variant="body1" className="text-gray-700 text-lg whitespace-pre-line leading-relaxed">
              {profile.bio}
            </Typography>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-center">
            {profile.telegram && (
              <a
                href={profile.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-100 hover:bg-blue-200 text-blue-600 py-3 rounded-xl font-semibold transition inline-block px-4"
              >
                تلگرام
              </a>
            )}
            {profile.youtube && (
              <a
                href={profile.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-100 hover:bg-red-200 text-red-600 py-3 rounded-xl font-semibold transition inline-block px-4"
              >
                یوتیوب
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={profile.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-100 hover:bg-green-200 text-green-700 py-3 rounded-xl font-semibold transition inline-block px-4"
              >
                واتساپ
              </a>
            )}
            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-100 hover:bg-pink-200 text-pink-600 py-3 rounded-xl font-semibold transition inline-block px-4"
              >
                اینستاگرام
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition inline-block px-4"
              >
                ایمیل
              </a>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 text-center py-3 text-sm text-gray-500">
          <Typography variant="body2">
            صفحه شخصی مربی در <strong>فیتلو</strong>
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
}
