import * as React from "react";
import { cn } from "../../lib/utils";
import { getUploadUrl } from "../../config/api";

interface SidebarProps {
  menu: { key: string; label: string; icon?: React.ReactNode }[];
  active: string;
  onSelect: (key: string) => void;
  user?: { name?: string; profileImage?: string };
  className?: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ menu, active, onSelect, user, className, onLogout }) => {
  return (
    <aside
      className={cn(
        "hidden xl:flex w-64 min-h-screen bg-primary-700 text-white flex-col fixed top-0 right-0 bottom-0 z-40 rtl",
        className
      )}
      dir="rtl"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-col items-center space-y-2 mb-6">
            {user?.profileImage ? (
              <img
                src={getUploadUrl(user.profileImage)}
                alt="profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white text-primary-700 flex items-center justify-center text-xl font-bold">
                👤
              </div>
            )}
            <p className="text-sm font-bold text-center">{user?.name || "بدون نام"}</p>
          </div>
          <div className="flex flex-col space-y-2">
            {menu.map((item) => (
              <button
                key={item.key}
                onClick={() => onSelect(item.key)}
                className={cn(
                  "w-full flex flex-row-reverse items-center justify-end text-right py-2 px-3 rounded-xl transition font-medium",
                  active === item.key
                    ? "bg-white text-primary-700 font-bold shadow"
                    : "hover:bg-primary-600 hover:scale-105"
                )}
              >
                {item.label}
                {item.icon}
              </button>
            ))}
          </div>
        </div>
        {onLogout && (
          <div className="p-4">
            <button
              onClick={onLogout}
              className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
            >
              خروج
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar; 