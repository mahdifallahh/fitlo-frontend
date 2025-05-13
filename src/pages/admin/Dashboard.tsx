import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../config/api";
import CoachesList from "./CoachesList";
import PremiumRequests from "./PremiumRequests";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const [active, setActive] = useState("coaches");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>({});
  const [profile, setProfile] = useState<any>({});
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(API_ENDPOINTS.users.me, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
      } catch {
        toast.error("❌ خطا در دریافت اطلاعات پروفایل");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* سایدبار - موبایل */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-blue-700 text-white flex justify-between items-center px-4 py-3 shadow z-20">
        <h2 className="text-lg font-bold">پنل ادمین</h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 md:static h-full w-64 bg-blue-700 text-white flex flex-col p-4 space-y-4 z-30 transition-transform duration-300 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* پروفایل کاربر */}
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
        </div>

        {/* منو */}
        {menu.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActive(item.key);
              setIsMobileMenuOpen(false);
            }}
            className={`text-right py-2 px-3 rounded-xl transition ${
              active === item.key
                ? "bg-white text-blue-700 font-bold"
                : "hover:bg-blue-600"
            }`}
          >
            {item.label}
          </button>
        ))}

        {/* دکمه خروج */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
        >
          خروج
        </button>
      </div>

      {/* محتوا */}
      <div className="flex-1 bg-gray-50 p-8 overflow-y-auto mt-14 md:mt-0">
        {active === "coaches" && <CoachesList />}
        {active === "premium-requests" && <PremiumRequests />}
      </div>
    </div>
  );
}
  