import { useEffect, useState } from "react";
import CoachProfile from "./Profile";
import Students from "./Students";
import Exercises from "./Exercises";
import Categories from "./Categories";
import Premium from "./Premium";
import PublicPage from "./PublicPage";
import axios from "axios";
import Programs from "./Programs";

export default function CoachDashboard() {
  const token = localStorage.getItem("token");
  const [active, setActive] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>({});

  const menu = [
    { key: "profile", label: "پروفایل من" },
    { key: "students", label: "شاگردهای من" },
    { key: "exercises", label: "تمرینات" },
    { key: "programs", label: "برنامه‌های من" },
    { key: "categories", label: "دسته‌بندی‌ها" },
    { key: "public-page", label: "صفحه عمومی من" },
    { key: "upgrade", label: "ارتقا به نسخه پرمیوم" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch (err) {
      console.log("خطا در گرفتن پروفایل");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [active]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* سایدبار - موبایل */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-blue-700 text-white flex justify-between items-center px-4 py-3 shadow z-20">
        <h2 className="text-lg font-bold">پنل مربی</h2>
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
        {active === "profile" && <CoachProfile />}
        {active === "students" && <Students />}
        {active === "exercises" && <Exercises />}
        {active === "programs" && <Programs />}
        {active === "categories" && <Categories />}
        {active === "public-page" && <PublicPage />}
        {active === "upgrade" && <Premium />}
      </div>
    </div>
  );
}
