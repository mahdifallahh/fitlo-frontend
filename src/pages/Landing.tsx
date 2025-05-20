import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from "../components/Logo";

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-6xl px-4 mx-auto w-full">{children}</div>
);

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 text-white">
      {/* Hero Section */}
      <section className="py-32">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <Logo size="lg" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Fitlo</h1>
            <p className="text-3xl mb-12 leading-relaxed max-w-3xl mx-auto">
              مدیریت هوشمند تمرینات و ارتباط با مربی
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center gap-6 flex-wrap"
            >
              <Link
                to="/register"
                className="px-10 py-5 bg-white text-blue-500 rounded-xl font-semibold shadow-xl hover:bg-gray-100 transition text-lg"
              >
                شروع رایگان
              </Link>
              <Link
                to="/login"
                className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-500 transition text-lg"
              >
                ورود
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="bg-white text-gray-800 py-32">
        <Container>
          <h2 className="text-5xl font-bold text-center mb-20">ویژگی‌های برتر فیتلو</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "مدیریت تمرینات", desc: "برنامه‌ریزی و پیگیری تمرینات روزانه با قابلیت شخصی‌سازی" },
              { title: "ارتباط با مربی", desc: "ارتباط مستقیم با مربی و دریافت بازخورد فوری" },
              { title: "گزارش‌گیری پیشرفته", desc: "تحلیل و گزارش‌گیری از پیشرفت تمرینات" },
            ].map(({ title, desc }, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl shadow-xl bg-white text-center h-full hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-6">{title}</h3>
                <p className="text-lg leading-relaxed text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 text-gray-800 py-32">
        <Container>
          <h2 className="text-5xl font-bold text-center mb-20">چرا فیتلو؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {[{
              title: "برای ورزشکاران",
              items: [
                "برنامه تمرینی شخصی‌سازی شده",
                "پیگیری پیشرفت روزانه",
                "ارتباط مستقیم با مربی",
                "دسترسی به ویدیوهای آموزشی"
              ]
            }, {
              title: "برای مربیان",
              items: [
                "مدیریت شاگردان",
                "طراحی برنامه تمرینی",
                "نظارت بر پیشرفت",
                "درآمدزایی آنلاین"
              ]
            }].map(({ title, items }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6 text-center p-8 rounded-2xl bg-white shadow-xl"
              >
                <h3 className="text-3xl font-semibold">{title}</h3>
                <ul className="space-y-4 text-lg text-gray-600">
                  {items.map((item, j) => (
                    <li key={j} className="flex items-center justify-center gap-2">
                      <span className="text-blue-500 text-xl">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-32">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-5xl font-bold mb-8">همین حالا شروع کنید</h2>
            <p className="text-2xl mb-12 leading-relaxed max-w-3xl mx-auto">
              به جامعه فیتلو بپیوندید و مسیر موفقیت را با ما طی کنید
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <Link
                to="/register"
                className="px-12 py-6 bg-white text-blue-600 rounded-xl font-semibold shadow-xl hover:bg-gray-100 transition text-xl"
              >
                ثبت نام رایگان
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default Landing;
