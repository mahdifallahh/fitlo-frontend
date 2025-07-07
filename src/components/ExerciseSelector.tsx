import axios from "axios";
import { FilterIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";
import { Exercise, SelectedExercise } from "../types/exercise";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Modal } from "./ui/modal";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selected, setSelected] = useState<SelectedExercise[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${API_ENDPOINTS.categories}?type=exercise`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(data.items || []);
      } catch {
        toast.error("❌ خطا در دریافت دسته‌بندی‌ها");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setSelected(defaultSelected || []);
  }, [defaultSelected]);

  const toggleExercise = (exercise: Exercise) => {
    const exists = selected.find((e) => e._id === exercise._id);
    if (exists) {
      setSelected((prev) => prev.filter((e) => e._id !== exercise._id));
    } else {
      setCurrentExercise({ ...exercise, sets: "", reps: "" });
      setModalOpen(true);
    }
  };

  const handleModalSave = (sets: string, reps: string, description?: string) => {
    setSelected((prev) => {
      if (!currentExercise || !currentExercise._id) return prev;
      const exists = prev.find((e) => e._id === currentExercise._id);
      if (exists) {
        return prev.map((e) =>
          e._id === currentExercise._id ? { ...e, sets, reps, description } : e
        );
      } else {
        return [
          ...prev,
          { ...currentExercise, sets, reps, description },
        ];
      }
    });
    setModalOpen(false);
    setCurrentExercise(null);
  };

  const handleChange = (id: string, field: "sets" | "reps", value: string) => {
    setSelected((prev) =>
      prev.map((ex) => (ex._id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const filtered = allExercises.filter((e) => {
    const matchCategory =
      selectedCategory === "all" || (selectedCategory && typeof e.categoryId === "object"
        ? e.categoryId?._id === selectedCategory
        : true);

    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6 rtl">
      <div className="flex flex-col gap-4 p-4 bg-muted/40 rounded-lg border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">فیلتر و جستجو</h3>
          <div className="text-sm text-muted-foreground">
            {filtered.length} تمرین یافت شد
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FilterIcon className="w-4 h-4" />
              فیلتر دسته‌بندی
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-10 text-right">
                <SelectValue placeholder="همه دسته‌ها" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-right">همه دسته‌ها</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id} className="text-right">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <SearchIcon className="w-4 h-4" />
              جستجو
            </Label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="مثلاً اسکوات"
              className="h-10 text-right  rounded-xl border border-[rgb(125,211,252)] bg-white focus:outline-none "
            />
          </div>
        </div>
      </div>

      <Card className="border">
        <CardContent className="p-0">
          <div className="p-4 border-b bg-muted/40">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">لیست تمرینات</h3>
              <div className="text-sm text-muted-foreground">
                {selected.length} تمرین انتخاب شده
              </div>
            </div>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-3">
              {filtered.map((ex) => {
                const isSelected = selected.find((e) => e._id === ex._id);
                return (
                  <div
                    key={ex._id}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      isSelected 
                        ? "bg-primary/5 border-primary/20 hover:bg-primary/10" 
                        : "bg-card hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={ex._id}
                          checked={!!isSelected}
                          onCheckedChange={() => toggleExercise(ex)}
                          className="h-5 w-5"
                        />
                        <div className="flex flex-col">
                          <Label
                            htmlFor={ex._id}
                            className="font-medium cursor-pointer text-base"
                          >
                            {ex.name}
                          </Label>
                          {ex.categoryId && typeof ex.categoryId === "object" && (
                            <span className="text-xs text-muted-foreground">
                              {ex.categoryId.name}
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="flex flex-col gap-1">
                            <div className="text-xs text-muted-foreground">
                              تعداد: {isSelected.sets || "-"} | تکرار: {isSelected.reps || "-"}
                            </div>
                            {isSelected.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                <span className="text-primary-600 font-medium ml-1">توضیحات:</span>
                                {isSelected.description.length > 50 
                                  ? `${isSelected.description.slice(0, 50)}...` 
                                  : isSelected.description
                                }
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* {isSelected && (
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <Label className="text-xs mb-1.5 text-muted-foreground">تعداد ست</Label>
                            <Input
                              type="text"
                              value={isSelected.sets}
                              onChange={(e) =>
                                handleChange(ex._id, "sets", e.target.value)
                              }
                              className="w-24 h-9 text-center"
                              placeholder="3"
                            />
                          </div>
                          <div className="flex flex-col items-center">
                            <Label className="text-xs mb-1.5 text-muted-foreground">تعداد تکرار</Label>
                            <Input
                              type="text"
                              value={isSelected.reps}
                              onChange={(e) =>
                                handleChange(ex._id, "reps", e.target.value)
                              }
                              className="w-24 h-9 text-center"
                              placeholder="12"
                            />
                          </div>
                        </div>
                      )} */}
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    تمرینی با این فیلترها پیدا نشد
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center p-4 bg-muted/40 rounded-lg border">
        <div className="text-sm text-muted-foreground">
          {selected.length > 0 ? (
            <span className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              {selected.length} تمرین انتخاب شده
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="text-yellow-600">⚠️</span>
              لطفاً حداقل یک تمرین انتخاب کنید
            </span>
          )}
        </div>
        <Button
          onClick={() => onSave(selected)}
          className="bg-primary-600 hover:bg-primary-700 text-white"
          disabled={selected.length === 0}
        >
          ذخیره تمرینات
        </Button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-4 space-y-4 dark:text-white dark:bg-gray-700" >
          <h3 className="text-lg font-semibold dark:text-white">تنظیم تعداد ست و تکرار</h3>
          <div className="flex flex-col gap-4">
            <Input
              type="number"
              placeholder="تعداد ست"
              value={currentExercise?.sets || ""}
              onChange={(e) =>
                setCurrentExercise((prev) => ({ ...prev!, sets: e.target.value }))
              }
              className="w-full bg-white dark:bg-gray-700"
            />
            <Input
              type="number"
              placeholder="تعداد تکرار"
              value={currentExercise?.reps || ""}
              onChange={(e) =>
                setCurrentExercise((prev) => ({ ...prev!, reps: e.target.value }))
              }
              className="w-full bg-white dark:bg-gray-700"
            />
            <div className="space-y-2">
              <Label className="text-sm font-medium">توضیحات تمرین</Label>
              <textarea
                placeholder="توضیحات مربوط به اجرای تمرین را وارد کنید..."
                value={currentExercise?.description || ""}
                onChange={(e) =>
                  setCurrentExercise((prev) => ({ ...prev!, description: e.target.value }))
                }
                className="w-full min-h-[100px] p-3 rounded-lg border border-[rgb(125,211,252)] bg-white dark:bg-gray-700 focus:outline-none text-right"
              />
            </div>
          </div>
          <Button 
            onClick={() => handleModalSave(
              currentExercise?.sets || "", 
              currentExercise?.reps || "",
              currentExercise?.description
            )} 
            className="bg-blue-900 text-white dark:bg-blue-300"
          >
            تمام
          </Button>
        </div>
      </Modal>
    </div>
  );
}
