import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';
import { User } from '../../types/user';
import { DataTable } from '../../components/ui/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface ApiResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CoachesList() {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      header: 'نام',
      accessorKey: 'name' as keyof User,
    },
    {
      header: 'شماره تماس',
      accessorKey: 'phone' as keyof User,
    },
    {
      header: 'وضعیت پرمیوم',
      accessorKey: 'premiumStatus' as keyof User,
      cell: (item: User) => {
        switch (item.premiumStatus) {
          case 'accepted':
            return <span className="text-green-600">✅ فعال</span>;
          case 'pending':
            return <span className="text-yellow-600">⏳ در انتظار</span>;
          case 'rejected':
            return <span className="text-red-600">❌ رد شده</span>;
          default:
            return <span className="text-gray-600">-</span>;
        }
      },
    },
    {
      header: 'تعداد شاگرد',
      accessorKey: 'studentCount' as keyof User,
      cell: (item: User) => (
        <span className="text-blue-600 font-semibold">{item.studentCount || 0}</span>
      ),
    },
    {
      header: 'تاریخ عضویت',
      accessorKey: 'createdAt' as keyof User,
      cell: (item: User) => new Date(item.createdAt).toLocaleDateString('fa-IR'),
    },
  ];

  const fetchData = async (page: number = currentPage, search: string = searchQuery) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<ApiResponse>(
        `${API_ENDPOINTS.admin.coaches}?page=${page}&search=${search}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setData(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('خطا در دریافت لیست مربی‌ها');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center text-primary">
            👥 لیست مربی‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data}
            columns={columns}
            searchable={true}
            searchPlaceholder="جستجو در نام یا شماره تماس..."
            onSearch={setSearchQuery}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
            emptyMessage="هیچ مربی یافت نشد"
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}