// ✅ فایل Login.tsx (نسخه نهایی)
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../components/Logo";

export default function Login() {
  const [step, setStep] = useState<"phone" | "login" | "reset" | "register">(
    "phone"
  );
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  const navigate = useNavigate();

  const handleCheckPhone = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post(API_ENDPOINTS.auth.checkPhone, {
        phone,
      });

      if (!data.exists) {
        setStep("register");
        setMessage("📩 شماره جدید است، لطفاً ثبت‌نام کنید.");
        await handleSendOtp();
      } else if (!data.verified) {
        setMessage("⚠️ حساب شما فعال نشده است.");
      } else {
        setStep("login");
        setMessage("👋 خوش اومدی! رمز عبورتو وارد کن.");
      }
    } catch (err) {
      setMessage("❌ خطا در بررسی شماره");
    }

    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post(API_ENDPOINTS.auth.login, {
        phone,
        password,
      });

      localStorage.setItem("token", data.token);

      const payload = JSON.parse(atob(data.token.split(".")[1]));
      const role = payload.role;
      localStorage.setItem("role", role);

      setMessage("✅ ورود موفقیت‌آمیز بود!");

      if (role === "coach") {
        window.location.href = "/coach/dashboard";
      } else if (role === "student") {
        window.location.href = "/student/dashboard";
      } else if (role === "admin") {
        window.location.href = "/admin/dashboard";
      }
    } catch {
      setMessage("❌ شماره یا رمز عبور اشتباه است");
    }
    setLoading(false);
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      toast.error("⚠️ لطفاً شماره موبایل را وارد کنید");

      return;
    }

    try {
      await axios.post(API_ENDPOINTS.auth.sendOtp, { phone });

      toast.success("✅ کد تایید ارسال شد");
      startOtpCooldown();
    } catch (err) {
      toast.error("❌ خطا در ارسال کد تایید");
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      toast.error("⚠️ لطفاً کد تایید و رمز عبور جدید را وارد کنید");
      return;
    }

    try {
      await axios.post(API_ENDPOINTS.auth.resetPassword, {
        phone,
        code: otp,
        newPassword,
      });
      toast.success("✅ رمز عبور با موفقیت تغییر کرد");
      setStep("login");
      setOtp("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "❌ خطا در تغییر رمز عبور");
    }
  };
  const handleForgotPassword = async () => {
    setLoading(true);
    setStep("reset");
    handleSendOtp();
    setLoading(false);
  };
  const handleRegister = async () => {
    if (!otp || !password) {
      toast.error("⚠️ لطفاً کد تایید و رمز عبور را وارد کنید");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const { data } = await axios.post(API_ENDPOINTS.auth.verifyOtp, {
        phone,
        code: otp,
        password,
      });
      localStorage.setItem("token", data.token);
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      const role = payload.role;
      localStorage.setItem("role", role);
      setMessage("✅ ثبت‌نام با موفقیت انجام شد!");
      if (role === "coach") {
        window.location.href = "/coach/dashboard";
      } else if (role === "student") {
        window.location.href = "/student/dashboard";
      } else if (role === "admin") {
        window.location.href = "/admin/dashboard";
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "❌ خطا در ثبت‌نام");
    }
    setLoading(false);
  };

  const startOtpCooldown = async () => {
    setResendDisabled(true);
    setCooldown(60);

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBack = () => {
    if (step === "phone") {
      navigate("/");
    } else {
      setStep("phone");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 relative"
        dir="rtl"
      >
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 p-2 rounded-full hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </motion.button>

        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {step === "phone" && "ورود به "}
            {step === "login" && "ورود به "}
            {step === "register" && "ثبت نام در "}
            {step === "reset" && "بازیابی رمز عبور "}
            <span className="text-blue-600">Fitlo</span>
          </h2>
          <p className="text-gray-500 text-sm">
            {step === "phone" && "برای ورود یا ثبت نام، شماره موبایل خود را وارد کنید"}
            {step === "login" && "رمز عبور خود را وارد کنید"}
            {step === "register" && "اطلاعات ثبت نام را وارد کنید"}
            {step === "reset" && "رمز عبور جدید خود را تنظیم کنید"}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "phone" && (
            <motion.div
              key="phone"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-right">
                  شماره تلفن
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="phone"
                  type="text"
                  placeholder="شماره تلفن"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-gray-50 transition-all duration-200"
                  dir="rtl"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckPhone}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  "بررسی شماره"
                )}
              </motion.button>
            </motion.div>
          )}

          {step === "login" && (
            <motion.div
              key="login"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-right">
                  رمز عبور
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="password"
                  type="password"
                  placeholder="رمز عبور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-gray-50 transition-all duration-200"
                  dir="rtl"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  "ورود"
                )}
              </motion.button>
              <motion.p
                whileHover={{ scale: 1.02 }}
                className="text-sm text-blue-500 text-center mt-2 cursor-pointer hover:underline"
                onClick={handleForgotPassword}
              >
                فراموشی رمز عبور
              </motion.p>
            </motion.div>
          )}

          {step === "reset" && (
            <motion.div
              key="reset"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-right">
                  کد تایید
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="otp"
                  type="text"
                  placeholder="کد ارسال شده"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right bg-gray-50 transition-all duration-200"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 text-right">
                  رمز عبور جدید
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="newPassword"
                  type="password"
                  placeholder="رمز عبور جدید"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right bg-gray-50 transition-all duration-200"
                  dir="rtl"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  "تغییر رمز عبور"
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendOtp}
                disabled={resendDisabled}
                className={`w-full ${
                  resendDisabled ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"
                } text-white py-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed`}
              >
                {resendDisabled ? `ارسال مجدد تا ${cooldown} ثانیه` : "ارسال مجدد کد"}
              </motion.button>
            </motion.div>
          )}

          {step === "register" && (
            <motion.div
              key="register"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-right">
                  کد تایید
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="otp"
                  type="text"
                  placeholder="کد ارسال شده"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right bg-gray-50 transition-all duration-200"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-right">
                  رمز عبور جدید
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="password"
                  type="password"
                  placeholder="رمز عبور جدید"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right bg-gray-50 transition-all duration-200"
                  dir="rtl"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  "ثبت‌نام / فعال‌سازی"
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendOtp}
                disabled={resendDisabled}
                className={`w-full ${
                  resendDisabled ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"
                } text-white py-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed`}
              >
                {resendDisabled ? `ارسال مجدد تا ${cooldown} ثانیه` : "ارسال مجدد کد"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-center text-gray-600 mt-2 p-2 rounded-lg bg-gray-50"
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
