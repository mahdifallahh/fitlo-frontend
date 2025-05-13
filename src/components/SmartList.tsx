import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Search } from "lucide-react"; // آیکون جستجو
import debounce from "lodash/debounce";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async (searchTerm: string = search) => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        search: searchTerm,
        page,
        limit,
        ...filterValues,
      };

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (response.data && Array.isArray(response.data.items)) {
        setData(response.data.items);
        setTotal(response.data.total || response.data.items.length);
      } else if (Array.isArray(response.data)) {
        setData(response.data);
        setTotal(response.data.length);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || "خطا در بارگذاری داده‌ها");
      toast.error("❌ خطا در بارگذاری داده‌ها");
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Create a debounced version of fetchData
  const debouncedFetchData = useCallback(
    debounce((searchTerm: string) => {
      fetchData(searchTerm);
    }, 500),
    [page, filterValues, url, token]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1); // Reset to first page on search
    debouncedFetchData(value);
  };

  // Keep focus on search input after data updates
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [data]);

  useEffect(() => {
    fetchData();
  }, [page, filterValues, url, token]);

  const pageCount = Math.ceil(total / limit);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">{title}</h2>
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      </div>
    );
  }

  // Show empty state
  if (!data || data.length === 0) {
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
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-blue-300 text-blue-900 bg-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* فیلترها */}
          <div className="flex flex-wrap gap-2 md:gap-4 w-full">
            {filters.map((filter) => (
              <select
                key={filter.field}
                value={filterValues[filter.field] || ""}
                onChange={(e) => {
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

        <div className="text-center text-gray-500 py-8">
          هیچ داده‌ای یافت نشد
        </div>
      </div>
    );
  }

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
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-blue-300 text-blue-900 bg-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* فیلترها */}
        <div className="flex flex-wrap gap-2 md:gap-4 w-full">
          {filters.map((filter) => (
            <select
              key={filter.field}
              value={filterValues[filter.field] || ""}
              onChange={(e) => {
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
      <div className="overflow-x-auto border border-gray-200 w-full rounded-lg">
        <table className="w-full text-right">
          <colgroup>
            {columns.map((col, idx) => (
              <col key={idx} className={idx === 0 ? "w-[120px]" : "w-auto"} />
            ))}
            {(onEdit || onDelete) && (
              <col className="w-[90px]" />
            )}
          </colgroup>
          <thead>
            <tr className="bg-blue-50 text-blue-700 text-xs md:text-sm">
              {columns.map((col, index) => (
                <th key={index} className="p-2 md:p-3 font-bold whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="p-2 md:p-3 text-center font-bold whitespace-nowrap">
                  عملیات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-2 md:p-3 text-sm">
                    {col.render
                      ? col.render(item)
                      : col.dataIndex
                      ? (item as any)[col.dataIndex]
                      : null}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="p-2 md:p-3 text-center">
                    <div className="flex justify-center gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✏️
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete((item as any)._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 disabled:opacity-50"
          >
            قبلی
          </button>
          <span className="px-4 py-2">
            صفحه {page} از {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 disabled:opacity-50"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
