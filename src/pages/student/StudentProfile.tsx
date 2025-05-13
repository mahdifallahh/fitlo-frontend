import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/user';
import Dashboard from '../../components/Dashboard';
import { toast } from 'react-toastify';

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
      .get('http://localhost:3000/users/me', {
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
          const response = await axios.get(`http://localhost:3000/users/coach/${user.coachId}`, {
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
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await axios.put('http://localhost:3000/users/upload-profile', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        profileImageUrl = uploadRes.data.profileImage;
      }
      await axios.put(
        'http://localhost:3000/users/me',
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
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">پروفایل من</h2>
        <div className="flex flex-col items-center gap-4">
          <img
            src={form.profileImage || '/default-avatar.png'}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">نام</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1">نام خانوادگی</label>
            <input
              name="family"
              value={form.family}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1">سن</label>
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-100"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full py-3 bg-blue-600 text-white rounded-lg mt-4"
          disabled={loading}
        >
          {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </button>
        <div className="mt-8 bg-gray-50 p-4 rounded-xl">
          <h3 className="font-bold mb-2">مربی من</h3>
          {coach ? (
            <div>
              <div>نام مربی: {coach.name}</div>
              <div>شماره تماس: {coach.phone}</div>
            </div>
          ) : (
            <div className="text-gray-500">مربی انتخاب نشده است.</div>
          )}
        </div>
      </div>
    </Dashboard>
  );
} 