import axios from "axios";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { DataTable } from "../../components/ui/data-table";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { API_ENDPOINTS } from "../../config/api";
import {
  Form,
  FormField,
  FormLabel,
  FormInput,
  FormButton,
} from "../../components/ui/form";
import { Plus } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  type: "exercise" | "food";
}

interface ApiResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Categories() {
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    type: "exercise",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Adjust as needed

  const fetchCategories = async (
    page: number = currentPage,
    limit: number = itemsPerPage,
    query: string = searchQuery
  ) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<ApiResponse<Category>>(
        `${API_ENDPOINTS.categories}?page=${page}&limit=${limit}&search=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(data.items);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
    } catch {
      toast.error("❌ خطا در بارگذاری دسته‌بندی‌ها");
      setCategories([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchQuery]);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("⚠️ لطفاً نام دسته‌بندی را وارد کنید");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`${API_ENDPOINTS.categories}/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ دسته‌بندی با موفقیت ویرایش شد");
      } else {
        await axios.post(API_ENDPOINTS.categories, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("✅ دسته‌بندی با موفقیت افزوده شد");
      }
      setForm({ name: "", type: "exercise" });
      setEditingId(null);
      fetchCategories(currentPage, itemsPerPage, searchQuery); // Refresh list
    } catch (err) {
      toast.error("❌ خطا در ثبت دسته‌بندی");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setForm({ name: category.name, type: category.type });
    setEditingId(category._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_ENDPOINTS.categories}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ دسته‌بندی حذف شد");
      fetchCategories(currentPage, itemsPerPage, searchQuery); // Refresh list
    } catch {
      toast.error("❌ خطا در حذف دسته‌بندی");
    } finally {
      setConfirmId(null);
    }
  };

  const columns = [
    {
      header: "نام",
      accessorKey: "name" as keyof Category,
    },
    {
      header: "نوع",
      accessorKey: "type" as keyof Category,
      cell: (category: Category) => (
        <span>{category.type === "exercise" ? "تمرین" : "تغذیه"}</span>
      ),
    },
    {
      header: "عملیات",
      accessorKey: "_id" as keyof Category,
      cell: (category: Category) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(category)}
            className="w-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            ویرایش
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmId(category._id)}
            className="w-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Add/Edit Form Section */}
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
            {editingId ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <FormField>
                <FormLabel
                  htmlFor="name"
                  className="text-gray-700 dark:text-gray-300 mb-2"
                >
                  نام دسته‌بندی
                </FormLabel>
                <FormInput
                  id="name"
                  placeholder="مثلاً پا"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={isSubmitting}
                  className="h-10 text-base bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-md px-3 py-2"
                />
              </FormField>
              <FormField>
                <FormLabel
                  htmlFor="type"
                  className="text-gray-700 dark:text-gray-300 mb-2"
                >
                  نوع
                </FormLabel>
                <Select
                  value={form.type}
                  onValueChange={(value) => setForm({ ...form, type: value })}
                  disabled={isSubmitting}
                  defaultValue="exercise"
                >
                  <SelectTrigger
                    id="type"
                    className="h-10 text-base bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-md px-3 py-2"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700">
                    <SelectItem value="exercise">تمرین</SelectItem>
                    <SelectItem value="food">تغذیه</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </Form>
        </CardContent>
        <CardFooter className="justify-end">
          {editingId && (
            <FormButton
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", type: "exercise" });
              }}
              disabled={isSubmitting}
              className="text-white dark:text-gray-300  dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 mr-2 px-4 py-2"
            >
              انصراف
            </FormButton>
          )}
          <FormButton
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال ثبت...
              </div>
            ) : editingId ? (
              "بروزرسانی"
            ) : (
              "افزودن"
            )}
          </FormButton>
        </CardFooter>
      </Card>

      {/* List Section */}
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
            لیست دسته‌بندی‌ها
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 px-6 py-4">
          <DataTable
            data={categories}
            columns={columns}
            searchable
            searchPlaceholder="جستجوی نام دسته‌بندی..."
            onSearch={setSearchQuery}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
            emptyMessage="هیچ دسته‌بندی یافت نشد"
          />
        </CardContent>
      </Card>

      <ConfirmModal
        open={!!confirmId}
        onConfirm={() => handleDelete(confirmId || "")}
        onCancel={() => setConfirmId(null)}
        message="آیا از حذف این دسته‌بندی مطمئن هستید؟"
        confirmText="حذف"
        cancelText="انصراف"
      />
    </div>
  );
}
