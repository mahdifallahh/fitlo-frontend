// ✅ فایل Login.tsx (نسخه نهایی)
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../components/Logo";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Icons } from "../components/ui/icons";
import { cn } from "../lib/utils";

// Utility function to convert Persian/Arabic numbers to English
const convertToEnglishNumbers = (str: string): string => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  return str.split('').map(char => {
    const persianIndex = persianNumbers.indexOf(char);
    const arabicIndex = arabicNumbers.indexOf(char);
    
    if (persianIndex !== -1) return persianIndex.toString();
    if (arabicIndex !== -1) return arabicIndex.toString();
    return char;
  }).join('');
};

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
      const englishPhone = convertToEnglishNumbers(phone);
      const { data } = await axios.post(API_ENDPOINTS.auth.checkPhone, {
        phone: englishPhone,
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
      const englishPhone = convertToEnglishNumbers(phone);
      const { data } = await axios.post(API_ENDPOINTS.auth.login, {
        phone: englishPhone,
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
      const englishPhone = convertToEnglishNumbers(phone);
      await axios.post(API_ENDPOINTS.auth.sendOtp, { phone: englishPhone });

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
      const englishPhone = convertToEnglishNumbers(phone);
      await axios.post(API_ENDPOINTS.auth.resetPassword, {
        phone: englishPhone,
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
      const englishPhone = convertToEnglishNumbers(phone);
      const { data } = await axios.post(API_ENDPOINTS.auth.verifyOtp, {
        phone: englishPhone,
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <motion.div 
              className="flex justify-center mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Logo className="h-16 w-auto" />
            </motion.div>
            <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              {step === "phone" && "ورود به حساب کاربری"}
              {step === "login" && "رمز عبور را وارد کنید"}
              {step === "reset" && "بازیابی رمز عبور"}
              {step === "register" && "ثبت نام"}
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-600 dark:text-gray-400">
              {step === "phone" && "شماره موبایل خود را وارد کنید"}
              {step === "login" && "رمز عبور حساب کاربری خود را وارد کنید"}
              {step === "reset" && "کد تایید ارسال شده را وارد کنید"}
              {step === "register" && "اطلاعات حساب کاربری خود را وارد کنید"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {step === "phone" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base text-gray-700 dark:text-gray-300">شماره موبایل</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="09xxxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="text-left h-12 text-lg border-primary-200  focus:ring-primary-500 bg-white"
                      />
                    </div>
                    <Button
                      className="w-full h-12 text-lg bg-primary-600 hover:bg-primary-700 text-white transition-all duration-300"
                      onClick={handleCheckPhone}
                      disabled={loading || !phone.trim()}
                    >
                      {loading ? (
                        <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        "ادامه"
                      )}
                    </Button>
                  </div>
                )}

                {step === "login" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-base text-gray-700 dark:text-gray-300">رمز عبور</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 text-lg border-primary-200 focus:border-primary-500 focus:ring-primary-500 bg-white"
                      />
                    </div>
                    <Button
                      className="w-full h-12 text-lg bg-primary-600 hover:bg-primary-700 text-white transition-all duration-300"
                      onClick={handleLogin}
                      disabled={loading || !password.trim()}
                    >
                      {loading ? (
                        <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        "ورود"
                      )}
                    </Button>
                    <Button
                      variant="link"
                      className="w-full text-base text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      onClick={handleForgotPassword}
                    >
                      فراموشی رمز عبور
                    </Button>
                  </div>
                )}

                {step === "reset" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-base text-gray-700 dark:text-gray-300">کد تایید</Label>
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-left h-12 text-lg border-primary-200 focus:border-primary-500 focus:ring-primary-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-base text-gray-700 dark:text-gray-300">رمز عبور جدید</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-12 text-lg border-primary-200 focus:border-primary-500 focus:ring-primary-500 bg-white"
                      />
                    </div>
                    <Button
                      className="w-full h-12 text-lg bg-primary-600 hover:bg-primary-700 text-white transition-all duration-300"
                      onClick={handleResetPassword}
                      disabled={loading || !otp.trim() || !newPassword.trim()}
                    >
                      {loading ? (
                        <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        "تغییر رمز عبور"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12 text-lg border-2 border-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300"
                      onClick={handleSendOtp}
                      disabled={resendDisabled}
                    >
                      {resendDisabled
                        ? `ارسال مجدد (${cooldown})`
                        : "ارسال مجدد کد"}
                    </Button>
                  </div>
                )}

                {step === "register" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-base text-gray-700 dark:text-gray-300">کد تایید</Label>
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-left h-12 text-lg border-primary-200 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-base text-gray-700 dark:text-gray-300">رمز عبور</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 text-lg border-primary-200 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <Button
                      className="w-full h-12 text-lg bg-primary-600 hover:bg-primary-700 text-white transition-all duration-300"
                      onClick={handleRegister}
                      disabled={loading || !otp.trim() || !password.trim()}
                    >
                      {loading ? (
                        <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        "ثبت نام"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12 text-lg border-2 border-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300"
                      onClick={handleSendOtp}
                      disabled={resendDisabled}
                    >
                      {resendDisabled
                        ? `ارسال مجدد (${cooldown})`
                        : "ارسال مجدد کد"}
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "w-full p-4 rounded-lg text-base font-medium",
                  message.includes("✅")
                    ? "bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                    : message.includes("❌")
                    ? "bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                    : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400"
                )}
              >
                {message}
              </motion.div>
            )}
            <Button
              variant="ghost"
              className="w-full h-12 text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300"
              onClick={handleBack}
            >
              {step === "phone" ? "بازگشت به صفحه اصلی" : "بازگشت"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
