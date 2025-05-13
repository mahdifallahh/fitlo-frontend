import { useEffect, useState } from "react";
import Modal from "./Modal";
import { Program } from "../types/program";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";


interface Props {
  open: boolean;
  program: Program;
  onClose: () => void;
}

export default function ProgramDetailsModal({ open, program, onClose }: Props) {
  const [dayState, setDayState] = useState([...program.days]);
  const token = localStorage.getItem("token");
  const [programDetails, setProgramDetails] = useState(program);

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
      <div className="space-y-6 max-h-[85vh] overflow-y-auto text-black">
        <h2 className="text-xl font-bold text-blue-700 text-center">
          ✏️ ویرایش برنامه شاگرد: {programDetails.studentId?.name}
        </h2>

        {dayState.map((d) => (
          <div
            key={d.day}
            className="border border-gray-300 rounded-xl p-4 space-y-3 bg-gray-50"
          >
            <h3 className="font-bold text-blue-600 text-right">{d.day}</h3>
            {d.exercises.length === 0 && (
              <p className="text-sm text-gray-500">
                تمرینی برای این روز ثبت نشده
              </p>
            )}
            {d.exercises.map((ex, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-3"
              >
                <div className="flex-1">
                  <p className="font-semibold">{ex.name}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="number"
                      min={0}
                      value={ex.sets || 0}
                      onChange={(e) =>
                        handleChangeSetRep(
                          d.day,
                          index,
                          "sets",
                          +e.target.value
                        )
                      }
                      className="w-24 border p-2 rounded-xl"
                      placeholder="ست"
                    />
                    <label>ست</label>

                    <input
                      type="number"
                      min={0}
                      value={ex.reps || 0}
                      onChange={(e) =>
                        handleChangeSetRep(
                          d.day,
                          index,
                          "reps",
                          +e.target.value
                        )
                      }
                      className="w-24 border p-2 rounded-xl"
                      placeholder="تکرار"
                    />
                    <label>تکرار</label>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteExercise(d.day, index)}
                  className="text-red-600 hover:underline"
                >
                  🗑 حذف تمرین
                </button>
              </div>
            ))}
          </div>
          
        ))}

        <div className="pt-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 font-bold"
          >
            💾 ذخیره نهایی ویرایش
          </button>
        </div>
      </div>
    </Modal>
  );
}
