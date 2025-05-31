import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/user';
import Dashboard from '../../components/Dashboard';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../config/api';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Icons } from "../../components/ui/icons";

export default function StudentProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [coach, setCoach] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: '',
    family: '',
    age: '',
    profileImage: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios
      .get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setForm({
          name: res.data.name || '',
          family: res.data.family || '',
          age: res.data.age ? String(res.data.age) : '',
          profileImage: res.data.profileImage || '',
        });
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setForm({ ...form, profileImage: URL.createObjectURL(e.target.files[0]) });
    }
  };
  useEffect(() => {
    const fetchCoachDetails = async () => {
      if (user?.coachId) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_BASE_URL}/users/coach/${user.coachId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCoach(response.data);
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'خطا در دریافت اطلاعات مربی');
        }
      }
    };

    fetchCoachDetails();
  }, [user?.coachId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let profileImageUrl = form.profileImage;
      
      // If there's a new image file, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await axios.post(`${API_BASE_URL}/users/upload-profile`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        profileImageUrl = uploadRes.data.profileImage;
      }

      // Update user profile
      await axios.put(
        `${API_BASE_URL}/users/me`,
        {
          name: form.name,
          family: form.family,
          age: form.age,
          profileImage: profileImageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('پروفایل با موفقیت ذخیره شد');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'خطا در ذخیره پروفایل');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dashboard user={user} title="پروفایل شاگرد">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">پروفایل من</h2>
        
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <img
              src={form.profileImage || '/default-avatar.png'}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary-200 dark:border-primary-800 transition-all duration-300 group-hover:border-primary-400 dark:group-hover:border-primary-600"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Label htmlFor="profile-image" className="cursor-pointer text-white text-sm">
                تغییر عکس
              </Label>
            </div>
          </div>
          <Input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">نام</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="h-12 text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="family">نام خانوادگی</Label>
            <Input
              id="family"
              name="family"
              value={form.family}
              onChange={handleChange}
              className="h-12 text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">سن</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              className="h-12 text-lg"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full h-12 text-lg bg-primary-600 hover:bg-primary-700 text-white transition-all duration-300"
          disabled={loading}
        >
          {loading ? (
            <>
              <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
              در حال ذخیره...
            </>
          ) : (
            'ذخیره تغییرات'
          )}
        </Button>

        <div className="mt-8 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">مربی من</h3>
          {coach ? (
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div>نام مربی: {coach.name}</div>
              <div>شماره تماس: {coach.phone}</div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">مربی انتخاب نشده است.</div>
          )}
        </div>
      </div>
    </Dashboard>
  );
} 