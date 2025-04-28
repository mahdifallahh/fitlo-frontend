// ✅ فایل Login.tsx (نسخه نهایی)
import { useEffect, useState } from "react";
import axios from "axios";

export default function Login() {
  const [step, setStep] = useState<"phone" | "login" | "register">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  const handleCheckPhone = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post(
        "http://localhost:3000/auth/check-phone",
        { phone }
      );

      if (!data.exists || !data.verified) {
        setStep("register");
        setMessage(
          data.exists
            ? "⚠️ حساب شما فعال نشده است."
            : "📩 شماره جدید است، لطفاً ثبت‌نام کنید."
        );
        await startOtpCooldown();
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
      const { data } = await axios.post("http://localhost:3000/auth/login", {
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

  const handleVerifyAndRegister = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post(
        "http://localhost:3000/auth/verify-otp",
        {
          phone,
          code: otp,
          password,
        }
      );

      const token = data.token;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
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
    } catch (err) {
      console.error(err);
      setMessage("❌ کد اشتباه است یا منقضی شده");
    }

    setLoading(false);
  };

  const startOtpCooldown = async () => {
    try {
      await axios.post("http://localhost:3000/auth/send-otp", { phone });
      setMessage("📨 کد ارسال شد");
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
    } catch {
      setMessage("❌ خطا در ارسال کد");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          ورود به <span className="text-blue-600">Fitlo</span>
        </h2>

        {step === "phone" && (
          <>
            <input
              type="text"
              placeholder="شماره تلفن"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            />
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
            <input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-right"
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-semibold transition disabled:opacity-50"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
            <p
              className="text-sm text-blue-500 text-center mt-2 cursor-pointer hover:underline"
              onClick={() => setStep("register")}
            >
              فعال نیستی؟ ثبت‌نام کن
            </p>
          </>
        )}

        {step === "register" && (
          <>
            <input
              type="text"
              placeholder="کد ارسال شده"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right"
            />
            <input
              type="password"
              placeholder="رمز عبور جدید"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right"
            />
            <button
              onClick={handleVerifyAndRegister}
              disabled={loading}
              className="w-full bg-yellow-500 text-white py-3 rounded-xl hover:bg-yellow-600 font-semibold transition disabled:opacity-50"
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام / فعال‌سازی"}
            </button>
            <button
              onClick={startOtpCooldown}
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

        {message && (
          <div className="text-sm text-center text-gray-600 mt-2">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
