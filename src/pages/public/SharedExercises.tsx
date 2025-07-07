import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../../config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Eye, EyeOff, Search, Lock } from 'lucide-react';
import { DataTable } from '../../components/ui/data-table';

export default function SharedExercises() {
  const { shareId } = useParams();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);

  const handleVerifyPassword = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${API_ENDPOINTS.exercises.share}/${shareId}/validate`, {
        shareId,
        password
      });
      setIsVerified(true);
      fetchExercises();
    } catch (error) {
      toast.error('❌ رمز عبور اشتباه است');
    }
    setIsLoading(false);
  };

  const fetchExercises = async () => {
    try {
      const { data } = await axios.get(`${API_ENDPOINTS.exercises.share}/${shareId}`);
      setExercises(data);
      setFilteredExercises(data);
    } catch (error) {
      toast.error('❌ خطا در دریافت تمرینات');
    }
  };

  useEffect(() => {
    if (exercises.length > 0) {
      setFilteredExercises(
        exercises.filter((exercise: any) =>
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, exercises]);

  const columns = [
    {
      header: "نام تمرین",
      accessorKey: "name",
    },
    {
      header: "توضیحات",
      accessorKey: "description",
    },
    {
      header: "گیف آموزشی",
      accessorKey: "gifUrl",
      cell: ({ row }: any) => (
        <div className="relative group">
          {row.original.gifUrl && (
            <img
              src={row.original.gifUrl}
              alt={row.original.name}
              className="w-16 h-16 object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-[2] group-hover:z-50"
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!isVerified ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
                    <Lock className="w-6 h-6" />
                    ورود به صفحه تمرینات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="رمز عبور را وارد کنید"
                        className="h-12 pl-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <Button
                      onClick={handleVerifyPassword}
                      disabled={isLoading || !password}
                      className="w-full h-12"
                    >
                      {isLoading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        "ورود"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">لیست تمرینات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-6">
                    <Input
                      type="text"
                      placeholder="جستجو در تمرینات..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                  
                  <DataTable
                    data={filteredExercises}
                    columns={columns}
                    searchable={false}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
