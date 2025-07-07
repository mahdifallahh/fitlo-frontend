import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DataTable } from '../components/ui/data-table';
import { toast } from 'react-toastify';

interface Exercise {
  name: string;
  categoryId?: { name: string };
  videoLink?: string;
  gifUrl?: string;
}

const SharedExercises = () => {
  const { shareId } = useParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/shared-exercises/${shareId}`, {
          params: { search: searchQuery },
        });
        setExercises(data);
      } catch (error) {
        toast.error('❌ خطا در بارگذاری تمرینات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [shareId, searchQuery]);

  const columns = [
    { header: 'نام', accessorKey: 'name' as keyof Exercise },
    { header: 'دسته‌بندی', accessorKey: 'categoryId.name' as keyof Exercise },
    { header: 'لینک ویدیو', accessorKey: 'videoLink' as keyof Exercise, cell: (row: Exercise) => row.videoLink ? <a href={row.videoLink} target="_blank" rel="noopener noreferrer">مشاهده</a> : 'ندارد' },
    { header: 'گیف', accessorKey: 'gifUrl' as keyof Exercise, cell: (row: Exercise) => row.gifUrl ? <a href={row.gifUrl} target="_blank" rel="noopener noreferrer">مشاهده</a> : 'ندارد' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">تمرینات اشتراک‌گذاری‌شده</h1>
      <DataTable
        data={exercises}
        columns={columns}
        searchable
        searchPlaceholder="جستجو در تمرینات..."
        onSearch={(query) => setSearchQuery(query)}
        isLoading={isLoading}
        emptyMessage="هیچ تمرینی یافت نشد"
      />
    </div>
  );
};

export default SharedExercises;