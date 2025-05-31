import { useEffect, useState } from "react";
import Modal from "./Modal";
import { Program } from "../types/program";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trash2, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import React from "react";

interface Props {
  open: boolean;
  program: Program;
  onClose: () => void;
}

export default function ProgramDetailsModal({ open, program, onClose }: Props) {
  const [dayState, setDayState] = useState([...program.days]);
  const token = localStorage.getItem("token");
  const [programDetails, setProgramDetails] = useState(program);
  const [isSaving, setIsSaving] = useState(false);
  const [largeGifUrl, setLargeGifUrl] = useState<string | null>(null);

  const handleChangeSetRep = (
    day: string,
    index: number,
    field: "sets" | "reps",
    value: number
  ) => {
    setDayState((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              exercises: d.exercises.map((ex, i) =>
                i === index ? { ...ex, [field]: value } : ex
              ),
            }
          : d
      )
    );
  };

  const handleDeleteExercise = (day: string, index: number) => {
    setDayState((prev) =>
      prev.map((d) =>
        d.day === day
          ? {
              ...d,
              exercises: d.exercises.filter((_, i) => i !== index),
            }
          : d
      )
    );
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await axios.put(
        `${API_ENDPOINTS.programs}/${programDetails._id}`,
        { days: dayState },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("✅ برنامه با موفقیت ویرایش شد");
      onClose();
    } catch {
      toast.error("❌ خطا در ذخیره ویرایش‌ها");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const { data } = await axios.get(
          `${API_ENDPOINTS.programs}/${program._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProgramDetails(data);
      } catch {
        toast.error("❌ خطا در دریافت اطلاعات برنامه");
      }
    };

    if (program) {
      fetchProgram();
    }
  }, [program]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-6 max-h-[85vh] overflow-y-auto bg-background text-foreground rounded-lg p-6 rtl">
        <h2 className="text-xl font-bold text-primary text-center">
          ✏️ ویرایش برنامه شاگرد: {programDetails.studentId?.name}
        </h2>

        {dayState.map((d) => (
          <div
            key={d.day}
            className="border border-border rounded-lg p-4 space-y-3 bg-muted/30"
          >
            <h3 className="font-bold text-primary-600 text-right mb-3">{d.day}</h3>
            {d.exercises.length === 0 && (
              <p className="text-sm text-muted-foreground text-right">
                تمرینی برای این روز ثبت نشده
              </p>
            )}
            <div className="space-y-4">
              {d.exercises.map((ex, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 pb-4 border-b border-border last:border-b-0 last:pb-0"
                >
                  {/* Exercise Name */}
                  <p className="font-semibold text-foreground text-right">نام: {ex.name}</p>

                  {/* Exercise Details (GIF, Category, Sets/Reps, Delete) */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 space-y-1 text-right">
                      {ex.gifUrl && (
                        <img
                          src={ex.gifUrl}
                          alt={`${ex.name} GIF`}
                          className="w-16 h-16 object-cover rounded-md cursor-pointer"
                          onClick={() => setLargeGifUrl(ex.gifUrl!)}
                        />
                      )}
                      <p className="text-sm text-muted-foreground">دسته بندی: {ex.categoryName || 'نامشخص'}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Label htmlFor={`sets-${d.day}-${index}`} className="text-right text-foreground">ست:</Label>
                        <Input
                          id={`sets-${d.day}-${index}`}
                          type="number"
                          min={0}
                          value={ex.sets || 0}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChangeSetRep(
                              d.day,
                              index,
                              "sets",
                              +e.target.value
                            )
                          }
                          className="w-16 text-center bg-white text-black"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Label htmlFor={`reps-${d.day}-${index}`} className="text-right text-foreground">تکرار:</Label>
                        <Input
                          id={`reps-${d.day}-${index}`}
                          type="number"
                          min={0}
                          value={ex.reps || 0}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChangeSetRep(
                              d.day,
                              index,
                              "reps",
                              +e.target.value
                            )
                          }
                          className="w-16 text-center bg-white text-black"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => handleDeleteExercise(d.day, index)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      حذف تمرین
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
          >
            {isSaving ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                در حال ذخیره...
              </span>
            ) : (
              "💾 ذخیره نهایی ویرایش"
            )}
          </Button>
        </div>
      </div>
      {/* Large GIF View Modal/Overlay */}
      {largeGifUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setLargeGifUrl(null)}
        >
          <img
            src={largeGifUrl}
            alt="Larger view of GIF"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Modal>
  );
}
