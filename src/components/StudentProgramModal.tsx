import Modal from "./Modal";

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  gifUrl?: string;
  videoLink?: string;
  categoryName?: string;
}

interface ProgramDay {
  day: string;
  exercises: Exercise[];
}

interface StudentProgramModalProps {
  open: boolean;
  programTitle: string;
  coach?: { name: string; phone: string };
  days: ProgramDay[];
  onClose: () => void;
}

export default function StudentProgramModal({
  open,
  programTitle,
  coach,
  days,
  onClose,
}: StudentProgramModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-6 max-h-[80vh] overflow-y-auto text-black">
        <h2 className="text-xl font-bold text-blue-700 text-center mb-2">
          برنامه تمرینی: {programTitle}
        </h2>
        {coach && (
          <div className="text-center text-gray-600 text-sm mb-4">
            مربی: {coach.name} ({coach.phone})
          </div>
        )}
        {days.map((d, idx) => (
          <div
            key={d.day || idx}
            className="border border-gray-300 rounded-xl p-4 space-y-3 bg-gray-50"
          >
            <h3 className="font-bold text-blue-600 text-right">{d.day}</h3>
            {d.exercises.length === 0 && (
              <p className="text-sm text-gray-500">
                تمرینی برای این روز ثبت نشده
              </p>
            )}
            {d.exercises.map((ex, i) => (
          
              <div
                key={i}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-3"
              >
                <div className="flex-1">
                  <p className="font-semibold">{ex.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span>ست: {ex.sets}</span>
                    <span>تکرار: {ex.reps}</span>
                  </div>
                  {ex.videoLink && (
                    <a
                      href={ex.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                    >
                      مشاهده ویدیو
                    </a>
                  )}
                </div>
                {ex.gifUrl && (
                  <img
                    src={ex.gifUrl}
                    alt={ex.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
}
