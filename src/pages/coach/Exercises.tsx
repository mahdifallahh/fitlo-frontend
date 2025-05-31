import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import {
  Form,
  FormField,
  FormLabel,
  FormInput,
  FormButton,
} from "../../components/ui/form";
import { DataTable } from "../../components/ui/data-table";
import { Button } from "../../components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

interface Category {
  _id: string;
  name: string;
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

interface ApiResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Exercises() {
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [gifFile, setGifFile] = useState<File | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const itemsPerPage = 10;

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

  const fetchExercises = async (page: number = currentPage, limit: number = itemsPerPage, query: string = searchQuery) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<ApiResponse<Exercise>>(`${API_ENDPOINTS.exercises}?page=${page}&limit=${limit}&search=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises(data.items);
      setTotalPages(data.totalPages); 
      setCurrentPage(data.page); 
    } catch {
      toast.error("❌ خطا در بارگذاری تمرینات");
      setExercises([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchUser();
  }, []);

  useEffect(() => {
    fetchExercises(currentPage, itemsPerPage, searchQuery);
  }, [currentPage, searchQuery, refreshFlag]);

  const categoryItems = categories.map(cat => ({
    value: cat._id,
    label: cat.name
  }));

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("⚠️ لطفاً نام تمرین را وارد کنید");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    if (selectedCategoryId) formData.append("categoryId", selectedCategoryId);
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
      setSelectedCategoryId(null);
      setVideoLink("");
      setGifFile(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
      setRefreshFlag((f) => f + 1);
    } catch (err) {
      toast.error("❌ خطا در ثبت تمرین");
    } finally {
      setIsLoading(false);
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

  const columns = [
    {
      header: "نام",
      accessorKey: "name" as keyof Exercise,
    },
    {
      header: "دسته‌بندی",
      accessorKey: "categoryId" as keyof Exercise,
      cell: (exercise: Exercise) => (
        <span>{exercise.categoryId?.name || "بدون دسته‌بندی"}</span>
      ),
    },
    {
      header: "لینک ویدیو",
      accessorKey: "videoLink" as keyof Exercise,
      cell: (exercise: Exercise) => (
        exercise.videoLink ? <a href={exercise.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">لینک</a> : <span>ندارد</span>
      ),
    },
    {
      header: "گیف",
      accessorKey: "gifUrl" as keyof Exercise,
      cell: (exercise: Exercise) => (
        exercise.gifUrl ? <a href={getImageUrl(exercise.gifUrl)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">نمایش</a> : <span>ندارد</span>
      ),
    },
    {
      header: "عملیات",
      accessorKey: "_id" as keyof Exercise,
      cell: (exercise: Exercise) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            ویرایش
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmId(exercise._id)}
            className="w-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🏋️‍♂️ افزودن تمرین جدید</CardTitle>
        </CardHeader>
        <CardContent>
          <Form>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 md:col-span-2">
                <FormField className="flex-1 !mt-0">
                  <FormLabel>نام تمرین *</FormLabel>
                  <FormInput
                    type="text"
                    placeholder="مثلاً اسکوات"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormField>

                <FormField className="flex-1">
                  <FormLabel>دسته‌بندی</FormLabel>
                  <Select
                    value={selectedCategoryId === null ? undefined : selectedCategoryId}
                    onValueChange={(value) => {
                      setSelectedCategoryId(value === "none" ? null : value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="-- انتخاب کنید --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- انتخاب کنید --</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <FormField className="md:col-span-2">
                <FormLabel>
                  فایل گیف (حداکثر ۵MB)
                  {!isPremium && (
                    <span className="text-sm text-red-600 mr-2">
                      (فقط برای کاربران پرمیوم)
                    </span>
                  )}
                </FormLabel>
                <FormInput
                  type="file"
                  accept="image/gif"
                  onChange={(e) => setGifFile(e.target.files?.[0] || null)}
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
              </FormField>

              <FormField className="md:col-span-2">
                <FormLabel>لینک ویدیو</FormLabel>
                <FormInput
                  type="text"
                  placeholder="لینک مستقیم ویدیو"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                />
              </FormField>
            </div>
          </Form>
        </CardContent>
        <CardFooter className="justify-end">
           <FormButton onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال ثبت...
              </div>
            ) : (
              "افزودن تمرین"
            )}
          </FormButton>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>لیست تمرینات</CardTitle>
        </CardHeader>
        <CardContent>
           <DataTable
            data={exercises}
            columns={columns}
            searchable
            searchPlaceholder="جستجو در تمرینات..."
             onSearch={(query) => {
              setSearchQuery(query);
              setCurrentPage(1);
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            isLoading={isLoading}
            emptyMessage={searchQuery ? "هیچ تمرینی با این نام یافت نشد" : "هنوز هیچ تمرینی ثبت نشده است"}
          />
        </CardContent>
      </Card>

      {confirmId && (
        <ConfirmModal
          open={!!confirmId}
          message="آیا از حذف این تمرین مطمئن هستید؟"
          onConfirm={() => handleDelete(confirmId as string)}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
