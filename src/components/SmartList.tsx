import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Search } from "lucide-react"; // آیکون جستجو

interface Column<T = any> {
  label: string;
  render?: (item: T) => React.ReactNode;
  dataIndex?: keyof T;
}

interface FilterOption {
  label: string;
  value: string;
}

interface Filter {
  field: string;
  label: string;
  options: FilterOption[];
}

interface Props<T = any> {
  key: string;
  title: string;
  url: string;
  token: string;
  searchPlaceholder?: string;
  filters?: Filter[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
}

export default function SmartList<T>({
  title,
  url,
  token,
  searchPlaceholder = "جستجو...",
  filters = [],
  columns,
  onEdit,
  onDelete,
}: Props<T>) {
  const [data, setData] = useState<T[]>([]);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // const fetchData = async () => {
  //   try {
  //     const params: any = {
  //       search,
  //       page,
  //       limit,
  //       ...filterValues, // فیلترهای انتخاب‌شده را به پارامترهای API ارسال می‌کنیم
  //     };

  //     const response = await axios.get(url, {
  //       headers: { Authorization: `Bearer ${token}` },
  //       params,
  //     });

  //     setData(response.data.items); // داده‌های فیلتر شده را از پاسخ API دریافت کنید
  //     setTotal(response.data.total); // تعداد کل داده‌ها را دریافت کنید
  //   } catch (err: any) {
  //     toast.error("❌ خطا در بارگذاری داده‌ها");
  //   }
  // };
  const fetchData = async () => {
    try {
      const params: any = {
        search,
        page,
        limit,
        ...filterValues,
      };
      console.log("Filter Values:", filterValues); // Debug filter values
      console.log("API Params:", params); // Debug API params

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setData(response.data.items);
      setTotal(response.data.total);
    } catch (err: any) {
      toast.error("❌ خطا در بارگذاری داده‌ها");
    }
  };
  useEffect(() => {
    fetchData();
  }, [search, page, filterValues]); // صفحه و فیلترها تغییر کنند، داده‌ها مجدداً بارگذاری شوند

  const pageCount = Math.ceil(total / limit);

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center">{title}</h2>

      {/* 🔍 سرچ و فیلترها */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* سرچ با آیکون */}
        <div className="relative w-full">
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400"
            size={20}
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // صفحه را به صفحه اول برمی‌گردانیم
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-blue-300 text-blue-900 bg-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* فیلترها */}
        <div className="flex flex-wrap gap-2 md:gap-4 w-full">
          {filters.map((filter) => (
            // <select
            //   key={filter.field}
            //   value={filterValues[filter.field] || ""}
            //   onChange={(e) => {
            //     setFilterValues((prev) => ({
            //       ...prev,
            //       [filter.field]: e.target.value,
            //     }));
            //     setPage(1); // هر بار که فیلتر تغییر می‌کند، صفحه را به اولین صفحه تغییر می‌دهیم
            //   }}
            //   className="w-full p-3 bg-white border border-blue-300 rounded-xl text-blue-900 focus:ring-2 focus:ring-blue-500"
            // >
            <select
              key={filter.field}
              value={filterValues[filter.field] || ""}
              onChange={(e) => {
                console.log("Selected Filter:", filter.field, e.target.value); // Debug selected value
                setFilterValues((prev) => ({
                  ...prev,
                  [filter.field]: e.target.value,
                }));
                setPage(1);
              }}
              className="w-full p-3 bg-white border border-blue-300 rounded-xl text-blue-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">همه</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* جدول */}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[500px] text-right">
          <thead>
            <tr className="bg-blue-50 text-blue-700 text-sm">
              {columns.map((col, index) => (
                <th key={index} className="p-3 whitespace-nowrap font-bold">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="p-3 whitespace-nowrap text-center font-bold">
                  عملیات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item: any) => (
              <tr
                key={item._id}
                className="border-b hover:bg-gray-50 text-gray-800"
              >
                {columns.map((col, index) => (
                  <td key={index} className="p-3 whitespace-nowrap">
                    {col.render ? col.render(item) : item[col.dataIndex || ""]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="p-3 whitespace-nowrap text-center space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-800 bg-gray-100 font-medium"
                      >
                        ✏️ ویرایش
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item._id)}
                        className="text-red-600 hover:text-red-800 bg-gray-100 font-medium"
                      >
                        🗑️ حذف
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* پیجینیشن */}
      <div className="flex justify-center items-center gap-3 pt-4 text-sm text-gray-700">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-1.5 rounded-xl bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 disabled:opacity-50"
        >
          ⬅️ قبلی
        </button>
        <span>
          صفحه <span className="font-bold text-blue-600">{page}</span> از{" "}
          <span className="font-bold text-blue-600">{pageCount}</span>
        </span>
        <button
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
          className="px-4 py-1.5 rounded-xl bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 disabled:opacity-50"
        >
          بعدی ➡️
        </button>
      </div>
    </div>
  );
}
