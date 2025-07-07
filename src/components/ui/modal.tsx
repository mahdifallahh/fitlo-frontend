import React from "react";
import { cn } from "../../lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50")}>
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:bg-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Modal;
