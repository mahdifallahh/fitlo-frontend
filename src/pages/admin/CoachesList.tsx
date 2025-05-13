import React from 'react';
import SmartList from '../../components/SmartList';
import { API_ENDPOINTS } from '../../config/api';
import { User } from '../../types/user';

const CoachesList: React.FC = () => {
  const columns = [
    {
      label: 'نام',
      dataIndex: 'name' as keyof User,
    },
    {
      label: 'شماره تماس',
      dataIndex: 'phone' as keyof User,
    },
    {
      label: 'وضعیت پرمیوم',
      dataIndex: 'premiumStatus' as keyof User,
      render: (item: User) => {
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
      label: 'تعداد شاگرد',
      dataIndex: 'studentCount' as keyof User,
      render: (item: User) => (
        <span className="text-blue-600 font-semibold">{item.studentCount || 0}</span>
      ),
    },
    {
      label: 'تاریخ عضویت',
      dataIndex: 'createdAt' as keyof User,
      render: (item: User) => new Date(item.createdAt).toLocaleDateString('fa-IR'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        👥 لیست مربی‌ها
      </h1>
      
      <SmartList<User>
        key="coaches-list"
        title="لیست مربی‌ها"
        url={API_ENDPOINTS.admin.coaches}
        token={localStorage.getItem('token') || ''}
        columns={columns}
        searchPlaceholder="جستجو در نام یا شماره تماس..."
      />
    </div>
  );
};

export default CoachesList; 