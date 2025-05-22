import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../config/api";
import CoachesList from "./CoachesList";
import PremiumRequests from "./PremiumRequests";
import { Menu, X } from "lucide-react";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const [active, setActive] = useState("coaches");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>({});
  const navigate = useNavigate();

  const menu = [
    { key: "coaches", label: "لیست مربیان" },
    { key: "premium-requests", label: "درخواست‌های پریمیوم" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.users.me, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch {
      toast.error("❌ خطا در دریافت اطلاعات پروفایل");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [active]);

  // --- Responsive Layout ---
  return (
    <div className="flex min-h-screen w-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-blue-700 text-white flex justify-between items-center px-4 py-3 shadow z-30">
        <h2 className="text-lg font-bold">پنل ادمین</h2>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-white text-2xl"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar Mobile with Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 opacity-100 pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          {/* Sidebar */}
          <div
            className="absolute top-0 right-0 w-64 h-full bg-gradient-to-b from-blue-700 to-blue-500 text-white flex flex-col shadow-2xl transition-transform duration-300 translate-x-0 pointer-events-auto"
            style={{ direction: "rtl" }}
          >
            {/* Close button */}
            <button
              className="self-end text-3xl m-4 hover:text-blue-200 transition"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="بستن"
            >
              <X size={32} />
            </button>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto flex flex-col px-4 pb-4">
              {/* User Profile */}
              <div className="flex flex-col items-center space-y-2 mb-6">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white text-blue-700 flex items-center justify-center text-xl font-bold">
                    👤
                  </div>
                )}
                <p className="text-sm font-bold text-center">
                  {user.name || "بدون نام"}
                </p>
                <p className="text-xs text-blue-100">مدیر سیستم</p>
              </div>
              {/* Menu */}
              <div className="flex flex-col space-y-2">
                {menu.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActive(item.key);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex flex-row-reverse items-center justify-end text-right py-2 px-3 rounded-xl transition font-medium ${
                      active === item.key
                        ? "bg-white text-blue-700 font-bold shadow"
                        : "hover:bg-blue-600 hover:scale-105"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition m-4"
            >
              خروج
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Desktop */}
      <div className="hidden md:flex w-64 min-h-screen bg-blue-700 text-white flex-col fixed top-0 right-0 bottom-0 z-20">
        <div className="flex flex-col h-full">
          {/* Scrollable area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* User Profile */}
            <div className="flex flex-col items-center space-y-2 mb-6">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white text-blue-700 flex items-center justify-center text-xl font-bold">
                  👤
                </div>
              )}
              <p className="text-sm font-bold text-center">
                {user.name || "بدون نام"}
              </p>
              <p className="text-xs text-blue-100">مدیر سیستم</p>
            </div>
            {/* Menu */}
            <div className="flex flex-col space-y-2">
              {menu.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActive(item.key);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-right py-2 px-3 rounded-xl transition ${
                    active === item.key
                      ? "bg-white text-blue-700 font-bold"
                      : "hover:bg-blue-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {/* Sticky logout button */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
            >
              خروج
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto mt-14 md:mt-0 md:mr-64 w-full">
        <div className="w-full max-w-full">
          {active === "coaches" && <CoachesList />}
          {active === "premium-requests" && <PremiumRequests />}
        </div>
      </div>
    </div>
  );
}
  