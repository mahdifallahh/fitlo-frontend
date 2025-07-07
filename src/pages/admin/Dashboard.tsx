import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../config/api";
import CoachesList from "./CoachesList";
import PremiumRequests from "./PremiumRequests";
import { Users, Star, LogOut } from "lucide-react";
import { Sidebar } from "../../components/ui/Sidebar";
import { ThemeSwitcher } from "../../components/ui/ThemeSwitcher";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const [active, setActive] = useState("coaches");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>({});
  const navigate = useNavigate();

  const menu = [
    { key: "coaches", label: "لیست مربیان", icon: <Users className="w-5 h-5 ml-2" /> },
    { key: "premium-requests", label: "درخواست‌های پریمیوم", icon: <Star className="w-5 h-5 ml-2" /> },
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

      if (data.role !== "admin") {
        toast.error("⛔️ شما دسترسی به این بخش را ندارید");
        navigate("/");
        return;
      }

      setUser(data);
    } catch {
      toast.error("❌ خطا در دریافت اطلاعات پروفایل");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  if (!user.role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary-700 dark:text-primary-300 text-lg">در حال بارگذاری...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-primary-700 text-white flex justify-between items-center px-4 py-3 shadow z-30">
        <h2 className="text-lg font-bold">پنل ادمین</h2>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-white p-2 hover:bg-primary-600 rounded-lg transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>

      {/* Sidebar Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="absolute top-0 right-0 h-full w-64 bg-primary-700">
            <Sidebar
              menu={menu}
              active={active}
              onSelect={(key) => {
                setActive(key);
                setIsMobileMenuOpen(false);
              }}
              user={user}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          menu={menu}
          active={active}
          onSelect={setActive}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 lg:p-8 overflow-y-auto mt-14 lg:mt-0 lg:mr-64 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-6">
            <ThemeSwitcher />
          </div>

          <div className="space-y-6">
            {active === "coaches" && <CoachesList />}
            {active === "premium-requests" && <PremiumRequests />}
          </div>
        </div>
      </div>
    </div>
  );
}
