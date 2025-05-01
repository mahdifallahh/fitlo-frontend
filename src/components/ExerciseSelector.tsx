import { useEffect, useState } from "react";
import axios from "axios";
import { Exercise, SelectedExercise } from "../types/exercise";

interface Props {
  allExercises: Exercise[];
  defaultSelected: SelectedExercise[];
  onSave: (selected: SelectedExercise[]) => void;
}

export default function ExerciseSelector({
  allExercises,
  defaultSelected,
  onSave,
}: Props) {
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selected, setSelected] = useState<SelectedExercise[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const { data } = await axios.get(
          "http://localhost:3000/categories?type=exercise",
          { headers }
        );

        // پشتیبانی از ساختار مختلف پاسخ
        if (Array.isArray(data.items)) {
          setCategories(data.items);
        } else if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }

        setSelected(defaultSelected || []);
      } catch {
        setCategories([]);
      }
    };

    fetchData();
  }, [defaultSelected]);

  const toggleExercise = (exercise: Exercise) => {
    const exists = selected.find((e) => e._id === exercise._id);
    if (exists) {
      setSelected((prev) => prev.filter((e) => e._id !== exercise._id));
    } else {
      setSelected((prev) => [
        ...prev,
        {
          ...exercise,
          sets: 3,
          reps: 10,
        },
      ]);
    }
  };

  const handleChange = (id: string, field: "sets" | "reps", value: number) => {
    setSelected((prev) =>
      prev.map((ex) => (ex._id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const filtered = allExercises.filter((e) => {
    const matchCategory =
      selectedCategory && typeof e.categoryId === "object"
        ? e.categoryId?._id === selectedCategory
        : true;

    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* فیلترها */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* دسته‌بندی */}
        <div>
          <label className="block font-bold mb-1 text-black">
            فیلتر دسته‌بندی
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border p-3 rounded-xl border border-blue-300 text-blue-900 bg-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="">همه دسته‌ها</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* جستجو */}
        <div>
          <label className="block font-bold mb-1 text-black">جستجو</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="مثلاً اسکوات"
            className="w-full border p-3 rounded-xl  border-blue-300 text-blue-900 bg-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* لیست تمرینات */}
      <div className="max-h-[300px] overflow-y-auto space-y-3">
        {filtered.map((ex) => {
          const isSelected = selected.find((e) => e._id === ex._id);
          return (
            <div
              key={ex._id}
              className={`p-4 border rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 ${
                isSelected ? "bg-blue-50 border-blue-400" : "bg-gray-50"
              }`}
            >
              <label className="flex items-center gap-2 cursor-pointer select-none group" tabIndex={0}>
                <input
                  type="checkbox"
                  checked={!!isSelected}
                  onChange={() => toggleExercise(ex)}
                  className="hidden peer"
                />
                <span
                  className="w-5 h-5 flex items-center justify-center rounded border-2 border-blue-400 bg-white transition-all duration-200
                  peer-checked:bg-blue-600 peer-checked:border-blue-600 relative"
                >
                  <svg
                    className="opacity-0 scale-75 peer-checked:opacity-100 peer-checked:scale-100 transition-all duration-200 text-white"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 8.5L7 11.5L12 5.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="font-semibold group-hover:text-blue-700 transition-colors duration-200">{ex.name}</span>
              </label>

              {isSelected && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col items-center">
                    <label className="text-xs font-semibold text-gray-700 mb-1">
                      تعداد ست
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={isSelected.sets}
                      onChange={(e) =>
                        handleChange(ex._id, "sets", Number(e.target.value))
                      }
                      className="border rounded-xl p-2 w-24 text-center bg-gray-400"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-xs font-semibold text-gray-700 mb-1">
                      تعداد تکرار
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={isSelected.reps}
                      onChange={(e) =>
                        handleChange(ex._id, "reps", Number(e.target.value))
                      }
                      className="border rounded-xl p-2 w-24 text-center bg-gray-400"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-500">تمرینی پیدا نشد</p>
        )}
      </div>

      {/* دکمه ذخیره */}
      <div className="text-center pt-2">
        <button
          onClick={() => onSave(selected)}
          className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 font-bold"
        >
          ذخیره تمرینات
        </button>
      </div>
    </div>
  );
}
