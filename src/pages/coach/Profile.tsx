import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS, getUploadUrl } from "../../config/api";
import {
  Form,
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormButton,
} from "../../components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Icons } from "../../components/ui/icons";

export default function CoachProfile() {
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    name: "",
    bio: "",
    phone: "",
    signedProfilePictureUrl: "",
    whatsapp: "",
    instagram: "",
    telegram: "",
    youtube: "",
    email: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) return true; // اگر ایمیل خالی باشد، معتبر است
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
        whatsapp: data.whatsapp || "",
        instagram: data.instagram || "",
        telegram: data.telegram || "",
        youtube: data.youtube || "",
        email: data.email || "",
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

    if (!validateEmail(form.email)) {
      toast.error("⚠️ لطفاً یک ایمیل معتبر وارد کنید");
      return;
    }

    setIsLoading(true);
    try {
      let profileImageUrl = form.signedProfilePictureUrl;
      
      // If there's a new image file, upload it first
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await axios.post(API_ENDPOINTS.users.uploadProfile, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        profileImageUrl = data.url;
      }

      // Update user profile with the new image URL
      await axios.put(API_ENDPOINTS.users.me, {
        ...form,
        signedProfilePictureUrl: profileImageUrl,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("✅ پروفایل با موفقیت بروزرسانی شد");
      fetchProfile(); // Refresh profile data
    } catch {
      toast.error("❌ خطا در بروزرسانی پروفایل");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const getImageUrl = (url: string) => {
    return getUploadUrl(url);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <CardHeader className="border-b border-border/40">
          <CardTitle className="text-xl font-semibold">پروفایل من</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-200 dark:border-primary-800 transition-all duration-300 group-hover:border-primary-400 dark:group-hover:border-primary-600">
                {preview ? (
                  <img
                    src={preview}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-4xl">
                    {form.signedProfilePictureUrl ? (
                      <img
                        src={form.signedProfilePictureUrl}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "👤"
                    )}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <label htmlFor="profile-image" className="cursor-pointer text-white text-sm">
                  تغییر عکس
                </label>
              </div>
            </div>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {file && (
              <p className="text-sm text-primary-500 dark:text-primary-400">
                فایل انتخاب‌شده: {file.name}
              </p>
            )}
          </div>

          <Form className="space-y-6">
            <FormField>
              <FormLabel>نام و نام خانوادگی</FormLabel>
              <FormInput
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثلاً علی محمدی"
                className="h-12 text-lg"
              />
            </FormField>

            <FormField>
              <FormLabel>شماره موبایل</FormLabel>
              <FormInput
                value={form.phone}
                disabled
                className="h-12 text-lg bg-gray-50 dark:bg-gray-800"
              />
            </FormField>

            <FormField>
              <FormLabel>درباره من</FormLabel>
              <FormTextarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="توضیحات مختصری درباره خودتان..."
                rows={4}
                className="text-lg"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField>
                <FormLabel>واتساپ</FormLabel>
                <FormInput
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="لینک یا شماره واتساپ"
                  className="h-12 text-lg"
                />
              </FormField>

              <FormField>
                <FormLabel>اینستاگرام</FormLabel>
                <FormInput
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="نام کاربری اینستاگرام"
                  className="h-12 text-lg"
                />
              </FormField>

              <FormField>
                <FormLabel>تلگرام</FormLabel>
                <FormInput
                  value={form.telegram}
                  onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                  placeholder="نام کاربری تلگرام"
                  className="h-12 text-lg"
                />
              </FormField>

              <FormField>
                <FormLabel>یوتیوب</FormLabel>
                <FormInput
                  value={form.youtube}
                  onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                  placeholder="لینک کانال یوتیوب"
                  className="h-12 text-lg"
                />
              </FormField>

              <FormField>
                <FormLabel>ایمیل</FormLabel>
                <FormInput
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="آدرس ایمیل"
                  type="email"
                  className={`h-12 text-lg ${form.email && !validateEmail(form.email) ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {form.email && !validateEmail(form.email) && (
                  <p className="text-sm text-red-500 mt-1">لطفاً یک ایمیل معتبر وارد کنید</p>
                )}
              </FormField>
            </div>
          </Form>
        </CardContent>
        <CardFooter>
          <FormButton
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-12 text-lg bg-primary-600 hover:bg-primary-700 text-white transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              'ذخیره تغییرات'
            )}
          </FormButton>
        </CardFooter>
      </Card>
    </div>
  );
}
