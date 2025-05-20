import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from 'react-select';
import ConfirmModal from "../../components/ConfirmModal";
import SmartList from "../../components/SmartList";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";

// Add custom styles for select dropdown
const selectStyles = `
  select {
    height: 48px;
  }
  select:not([size]):not([multiple]) {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  select option {
    padding: 8px;
  }
  select:focus {
    outline: none;
  }
`;

interface Category {
  _id: string;
  name: string;
}

interface CategoryOption {
  value: string;
  label: string;
}

interface Exercise {
  _id: string;
  name: string;
  gifUrl?: string;
  videoLink?: string;
  categoryId?: {
    _id: string;
    name: string;
  };
}

export default function Exercises() {
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryOption, setCategoryOption] = useState<CategoryOption | null>(null);
  const [name, setName] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [gifFile, setGifFile] = useState<File | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${API_ENDPOINTS.categories}?type=exercise&limit=1000`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(data.items || []);
      } catch {
        setCategories([]);
      }
    };

    const fetchUser = async () => {
      try {
        const { data } = await axios.get(API_ENDPOINTS.users.me, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsPremium(data.isPremium);
      } catch {
        toast.error("❌ خطا در دریافت اطلاعات کاربر");
      }
    };

    fetchCategories();
    fetchUser();
  }, []);

  const categoryOptions = categories.map(cat => ({
    value: cat._id,
    label: cat.name
  }));

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("⚠️ لطفاً نام تمرین را وارد کنید");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (categoryOption) formData.append("categoryId", categoryOption.value);
    if (videoLink) formData.append("videoLink", videoLink);
    if (gifFile) formData.append("gif", gifFile);

    try {
      await axios.post(API_ENDPOINTS.exercises, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ تمرین با موفقیت ثبت شد");
      setName("");
      setCategoryOption(null);
      setVideoLink("");
      setGifFile(null);
      setRefreshFlag((f) => f + 1);
    } catch (err) {
      toast.error("❌ خطا در ثبت تمرین");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_ENDPOINTS.exercises}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ تمرین حذف شد");
      setRefreshFlag((f) => f + 1);
    } catch {
      toast.error("❌ خطا در حذف تمرین");
    } finally {
      setConfirmId(null);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 text-black">
      <style>{selectStyles}</style>
      {/* فرم افزودن تمرین */}
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">🏋️‍♂️ افزودن تمرین</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-black">
              نام تمرین *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-blue-300 text-blue-900 bg-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="مثلاً اسکوات"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-black">
              دسته‌بندی
            </label>
            <Select
              value={categoryOption}
              onChange={(option) => setCategoryOption(option)}
              options={categoryOptions}
              placeholder="-- انتخاب کنید --"
              className="text-right"
              maxMenuHeight={200}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '48px',
                  borderRadius: '0.75rem',
                  borderColor: '#93C5FD',
                  '&:hover': {
                    borderColor: '#93C5FD'
                  }
                }),
                menu: (base) => ({
                  ...base,
                  textAlign: 'right'
                }),
                option: (base) => ({
                  ...base,
                  textAlign: 'right',
                  padding: '8px 12px'
                })
              }}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: '#3B82F6',
                  primary25: '#EFF6FF',
                  primary50: '#DBEAFE',
                }
              })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1 text-black">
              فایل گیف (حداکثر ۵MB)
              {!isPremium && (
                <span className="text-sm text-red-600 mr-2">
                  (فقط برای کاربران پرمیوم)
                </span>
              )}
            </label>
            <input
              type="file"
              accept="image/gif"
              onChange={(e) => setGifFile(e.target.files?.[0] || null)}
              className={`w-full border p-2 rounded-xl ${
                isPremium 
                  ? 'border-blue-300 text-blue-900' 
                  : 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
              }`}
              disabled={!isPremium}
            />
            {gifFile && (
              <p className="text-sm text-gray-700 mt-1">
                فایل انتخاب‌شده: {gifFile.name}
              </p>
            )}
            {!isPremium && (
              <p className="text-sm text-red-600 mt-1">
                برای آپلود گیف، ابتدا باید به نسخه پرمیوم ارتقا پیدا کنید.
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1 text-black">
              لینک ویدیو
            </label>
            <input
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="w-full  p-3 rounded-xl border border-blue-300 text-blue-900 bg-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="لینک آپارات یا یوتیوب"
            />
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-bold transition"
          >
            ذخیره تمرین
          </button>
        </div>
      </div>

      {/* لیست تمرینات */}
      <SmartList<Exercise>
        key={refreshFlag.toString()}
        url={API_ENDPOINTS.exercises}
        title="📋 لیست تمرینات"
        token={token || ""}
        searchPlaceholder="جستجوی نام تمرین..."
        filters={[
          {
            field: "categoryId",
            label: "دسته‌بندی",
            options: categories.map((cat) => ({
              label: cat.name,
              value: cat._id,
            })),
          },
        ]}
        columns={[
          {
            label: "نام",
            render: (item) => item.name,
          },
          {
            label: "دسته‌بندی",
            render: (item) => item.categoryId?.name || "--",
          },
          {
            label: "ویدیو",
            render: (item) =>
              item.videoLink ? (
                <a
                  href={item.videoLink}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  مشاهده
                </a>
              ) : (
                "--"
              ),
          },
          {
            label: "گیف",
            render: (item) =>
              item.gifUrl ? (
                <img
                  src={getImageUrl(item.gifUrl)}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded"
                />
              ) : (
                "--"
              ),
          },
        ]}
        onDelete={(id) => setConfirmId(id)}
      />

      <ConfirmModal
        open={!!confirmId}
        message="آیا از حذف این تمرین مطمئن هستید؟"
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
