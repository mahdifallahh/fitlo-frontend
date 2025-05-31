import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS, getUploadUrl } from "../../config/api";
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
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

interface Student {
  _id: string;
  name: string;
  phone: string;
  signedProfilePictureUrl?: string;
  lastActive?: string;
  status?: "active" | "inactive";
}

interface ApiResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Students() {
  const token = localStorage.getItem("token");
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchStudents = async (page: number = currentPage, limit: number = itemsPerPage, query: string = searchQuery) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<ApiResponse<Student>>(API_ENDPOINTS.users.students, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page,
          limit: limit,
          search: query,
        }
      });
      setStudents(data.items);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
      setCurrentPage(data.page);
    } catch {
      toast.error("❌ خطا در دریافت لیست شاگردان");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage, itemsPerPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || (!editingId && !form.password.trim())) {
      toast.warn("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    setIsLoading(true);
    try {
      if (editingId) {
        await axios.put(
          `${API_ENDPOINTS.users.students}/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("✅ شاگرد با موفقیت ویرایش شد");
      } else {
        await axios.post(API_ENDPOINTS.users.students, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ شاگرد با موفقیت اضافه شد");
      }
      setForm({ name: "", phone: "", password: "" });
      setEditingId(null);
      fetchStudents();
    } catch (err: any) {
      const msg = err.response?.data?.message || "خطا در ثبت اطلاعات";
      toast.error("❌ " + msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student._id);
    setForm({ name: student.name, phone: student.phone, password: "" });
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setIsLoading(true);
    try {
      await axios.delete(`${API_ENDPOINTS.users.students}/${confirmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ شاگرد حذف شد");
      setConfirmId(null);
      fetchStudents();
    } catch {
      toast.error("❌ خطا در حذف شاگرد");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      header: "نام",
      accessorKey: "name" as keyof Student,
    },
    {
      header: "شماره تلفن",
      accessorKey: "phone" as keyof Student,
    },
    {
      header: "آخرین فعالیت",
      accessorKey: "lastActive" as keyof Student,
      cell: (student: Student) => (
        <span className="text-primary-500 dark:text-primary-400">
          {student.lastActive ? new Date(student.lastActive).toLocaleDateString("fa-IR") : "نامشخص"}
        </span>
      ),
    },
    {
      header: "وضعیت",
      accessorKey: "status" as keyof Student,
      cell: (student: Student) => (
        <span className={`font-medium ${student.status === "active" ? "text-green-500" : "text-red-500"}`}>
          {student.status === "active" ? "فعال" : "غیرفعال"}
        </span>
      ),
    },
    {
      header: "عملیات",
      accessorKey: "_id" as keyof Student,
      cell: (student: Student) => (
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(student)}
            className="w-full h-8 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            ویرایش
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmId(student._id)}
            className="w-full h-8 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* فرم افزودن/ویرایش شاگرد */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "ویرایش شاگرد" : "افزودن شاگرد جدید"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form>
            <FormField>
              <FormLabel>نام کامل</FormLabel>
              <FormInput
                type="text"
                placeholder="نام کامل"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>
            <FormField>
              <FormLabel>شماره تلفن</FormLabel>
              <FormInput
                type="text"
                placeholder="شماره تلفن"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </FormField>
            {!editingId && (
              <FormField>
                <FormLabel>رمز عبور اولیه</FormLabel>
                <div className="relative">
                  <FormInput
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز عبور اولیه"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 dark:text-primary-400"
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </FormField>
            )}
          </Form>
        </CardContent>
        <CardFooter className="justify-end">
          {editingId && (
            <FormButton onClick={() => setEditingId(null)} className="ml-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              انصراف از ویرایش
            </FormButton>
          )}
          <FormButton onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : "افزودن شاگرد"}
          </FormButton>
        </CardFooter>
      </Card>

      {/* لیست شاگردان */}
      <Card>
        <CardHeader>
          <CardTitle>لیست شاگردان</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={students}
            columns={columns}
            searchable
            searchPlaceholder="جستجو در شاگردان..."
            onSearch={(query) => {
              setSearchQuery(query);
              setCurrentPage(1);
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            isLoading={isLoading}
            emptyMessage={searchQuery ? "هیچ شاگردی با این نام یافت نشد" : "هنوز هیچ شاگردی ثبت نشده است"}
          />
        </CardContent>
      </Card>

      {/* Confirm Delete Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>تایید حذف</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">آیا از حذف این شاگرد مطمئن هستید؟</p>
            </CardContent>
            <CardFooter className="justify-center gap-4">
              <FormButton onClick={() => setConfirmId(null)} className="border border-primary-200 dark:border-primary-800 bg-transparent hover:bg-primary-100 dark:hover:bg-primary-800">
                انصراف
              </FormButton>
              <FormButton onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600" disabled={isLoading}>
                {isLoading ? "در حال حذف..." : "حذف"}
              </FormButton>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
