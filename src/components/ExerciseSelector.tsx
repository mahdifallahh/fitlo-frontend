import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";
import { Exercise, SelectedExercise } from "../types/exercise";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { SearchIcon, FilterIcon } from "lucide-react";

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
      setSelected((prev) => [
        ...prev,
        {
          ...exercise,
          sets: "",
          reps: "",
        },
      ]);
    }
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
              className="h-10 text-right"
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
                      </div>

                      {isSelected && (
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
                      )}
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
          className="bg-primary hover:bg-primary/90"
          disabled={selected.length === 0}
        >
          ذخیره تمرینات
        </Button>
      </div>
    </div>
  );
}
