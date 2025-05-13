// ✅ فایل Login.tsx (نسخه نهایی)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";

export default function Login() {
  const [step, setStep] = useState<"phone" | "login" | "reset" | "register">("phone");
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
      const { data } = await axios.post(API_ENDPOINTS.auth.checkPhone, { phone });

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
      setStep("reset");
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

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          ورود به <span className="text-blue-600">Fitlo</span>
        </h2>

        {step === "phone" && (
          <>
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 text-right">
                شماره تلفن
              </label>
              <input
                id="phone"
                type="text"
                placeholder="شماره تلفن"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-gray-100"
              />
            </div>
            <button
              onClick={handleCheckPhone}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition disabled:opacity-50"
            >
              {loading ? "در حال بررسی..." : "بررسی شماره"}
            </button>
          </>
        )}

        {step === "login" && (
          <>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-right">
                رمز عبور
              </label>
              <input
                id="password"
                type="password"
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-right bg-gray-100"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition disabled:opacity-50"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
            <p
              className="text-sm text-blue-500 text-center mt-2 cursor-pointer hover:underline"
              onClick={handleSendOtp}
            >
              فراموشی رمز عبور
            </p>
          </>
        )}

        {step === "reset" && (
          <>
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-right">
                کد تایید
              </label>
              <input
                id="otp"
                type="text"
                placeholder="کد ارسال شده"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 text-right">
                رمز عبور جدید
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="رمز عبور جدید"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right bg-gray-100"
              />
            </div>
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl bg-blue-700 font-semibold transition disabled:opacity-50"
            >
              {loading ? "در حال تغییر رمز..." : "تغییر رمز عبور"}
            </button>
            <button
              onClick={handleSendOtp}
              disabled={resendDisabled}
              className={`w-full ${
                resendDisabled ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-2 rounded-xl font-semibold transition`}
            >
              {resendDisabled
                ? `ارسال مجدد تا ${cooldown} ثانیه`
                : "ارسال مجدد کد"}
            </button>
          </>
        )}

        {step === "register" && (
          <>
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-right">
                کد تایید
              </label>
              <input
                id="otp"
                type="text"
                placeholder="کد ارسال شده"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-right">
                رمز عبور جدید
              </label>
              <input
                id="password"
                type="password"
                placeholder="رمز عبور جدید"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right bg-gray-100"
              />
            </div>
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl bg-blue-700 font-semibold transition disabled:opacity-50"
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام / فعال‌سازی"}
            </button>
            <button
              onClick={handleSendOtp}
              disabled={resendDisabled}
              className={`w-full ${resendDisabled ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 rounded-xl font-semibold transition`}
            >
              {resendDisabled ? `ارسال مجدد تا ${cooldown} ثانیه` : "ارسال مجدد کد"}
            </button>
          </>
        )}

        {message && (
          <div className="text-sm text-center text-gray-600 mt-2">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
