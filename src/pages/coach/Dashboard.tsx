import { useEffect, useState } from "react";
import CoachProfile from "./Profile";
import Students from "./Students";
import Exercises from "./Exercises";
import Categories from "./Categories";
import Premium from "./Premium";
import PublicPage from "./PublicPage";
import axios from "axios";
import Programs from "./Programs";
import { FaUser, FaUsers, FaClipboardList, FaListAlt, FaTags, FaGlobe, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../config/api";
import { Sidebar } from "../../components/ui/Sidebar";
import { ThemeSwitcher } from "../../components/ui/ThemeSwitcher";
import { SampleForm } from "../../components/ui/SampleForm";
import { motion } from "framer-motion";

export default function CoachDashboard() {
  const token = localStorage.getItem("token");
  const [active, setActive] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>({});

  const menu = [
    { key: "profile", label: "پروفایل من", icon: <FaUser className="w-5 h-5 ml-2" /> },
    { key: "students", label: "شاگردهای من", icon: <FaUsers className="w-5 h-5 ml-2" /> },
    { key: "exercises", label: "تمرینات", icon: <FaClipboardList className="w-5 h-5 ml-2" /> },
    { key: "programs", label: "برنامه‌های من", icon: <FaListAlt className="w-5 h-5 ml-2" /> },
    { key: "categories", label: "دسته‌بندی‌ها", icon: <FaTags className="w-5 h-5 ml-2" /> },
    { key: "public-page", label: "صفحه عمومی من", icon: <FaGlobe className="w-5 h-5 ml-2" /> },
    { key: "upgrade", label: "ارتقا به نسخه پرمیوم", icon: <FaStar className="w-5 h-5 ml-2" /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
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

  return (
    <div className="flex min-h-screen w-screen">
      {/* سایدبار - موبایل */}
      <div className="xl:hidden fixed top-0 left-0 right-0 bg-primary-700 text-white flex justify-between items-center px-4 py-3 shadow z-20">
        <h2 className="text-lg font-bold">پنل مربی</h2>
        {/* Toggle button for mobile menu */}
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white text-2xl"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          aria-label="باز کردن منو"
        >
          ☰
        </motion.button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: isMobileMenuOpen ? "0%" : "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-64 h-full bg-primary-700 text-white flex flex-col shadow-2xl pointer-events-auto"
            style={{ direction: "rtl" }}
          >
            {/* Close button */}
            <motion.button
              className="self-end text-2xl mb-2 p-2 rounded-full text-white transition"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="بستن"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              ×
            </motion.button>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto flex flex-col">
              {/* پروفایل کاربر */}
              <div className="flex flex-col items-center space-y-2 mb-6">
                {user.signedProfilePictureUrl ? (
                  <img
                    src={user.signedProfilePictureUrl}
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
                        : "hover:bg-primary-600 hover:scale-105"
                    }`}
                  >
                    {item.label}
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>
            {/* دکمه خروج */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition m-2"
            >
              خروج
            </button>
          </motion.div>
        </div>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden xl:block">
        <Sidebar 
          menu={menu} 
          active={active} 
          onSelect={setActive} 
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* محتوا */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-8 overflow-y-auto mt-14 xl:mt-0 xl:mr-64 w-full">
        <div className="w-full max-w-full">
          <div className="flex justify-end mb-4">
            <ThemeSwitcher />
          </div>
          
          {active === "profile" && <CoachProfile />}
          {active === "students" && <Students />}
          {active === "exercises" && <Exercises />}
          {active === "programs" && <Programs />}
          {active === "categories" && <Categories />}
          {active === "public-page" && <PublicPage />}
          {active === "upgrade" && <Premium />}
        </div>
      </div>
    </div>
  );
}
