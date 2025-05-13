interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  open,
  title = "تایید",
  message,
  onConfirm,
  onCancel,
  confirmText = "تایید",
  cancelText = "انصراف",
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4 text-center animate-fade-in-up">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">{message}</p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl transition"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
