import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from "../components/Logo";
// Import shadcn/ui components
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { cn } from "@/lib/utils"; // Assuming cn utility is available

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto w-full">{children}</div>
);

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden" dir="rtl">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 lg:py-40 bg-gradient-to-br from-primary-800 to-blue-900 text-white dark:from-primary-900 dark:to-blue-950">
        {/* Subtle background pattern or graphic can go here */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD02MCBoZWlnaHQ9NjAgdmlld0JveD0wIDAgNjAgNjAnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNyI+PHBhdGggZD0iTTM2IDEzYy0xLjE0OS02LjA2My02LjI2Mi0xMC41MDctMTIuMzc5LTEwLjUwN0M5LjMzOCAyLjQ5MyA0LjI0NSA2Ljk0IDMuMDk2IDEzSDAtLjk4NGMtLjEzMy0uNDI5LS4zMy0uODMyLS41OTItMS4yMDEtLjY2LTkuOTYxIDcuMTcxLTE4LjI0OSAxNi45NTktMTguMjQ5IDkuNzg2IDAgMTcuNjE5IDguMzM5IDE2Ljk1OSA3Ljk3MS0uMjYyLjM2OS0uNDU5Ljc3Mi0uNTkyIDEuMjAxSDM2em0tMTggMzZjLTYuMDYzIDEuMTQ5LTEwLjUwNyA2LjI2Mi0xMC41MDcgMTIuMzc5IDAgOS4zMzcgNC40OTQgMTQuNDMgMTAuNTA3IDE1LjU3OUMyNC4wNjMgNjAuMDYgMjguNTA3IDU0Ljk0IDE1LjU3OSA0OCAzLjk0IDQ2Ljg1MS0uNTA3IDQxLjc0OC0uNTA3IDM1LjYzMWMwLTkuMzg3IDUuMDktMTQuNDggMTEuMTc5LTE1LjU3OWwxLjMwNyA2LjkwNHpNNTIuOTEgMzcuOTc2Yy0uOTIzIDQuODY2LTYuNjk2IDkuMjUxLTExLjU2MiA5LjI1MS00Ljg2NSAwLTEwLjYzOS00LjM4NS0xMS41NjItOS4yNTFDNDYuMTQ3IDQyLjg0IDUwLjA0IDQ2LjY2MyA1Mi45MSAzNy45NzZ6TTYwIDQ5Ljk1OGMwLTkuOTYxLTcuMTcxLTE4LjI0OS0xNi45NTktMTguMjQ5LTkuNzg2IDAtMTcuNjE5IDguMzM5LTE2LjkwOSA3Ljk3MS0uMjYyLjM2OS0uNDU5Ljc3Mi0uNTkyIDEuMjAxIDkuOTYxLjY2IDE4LjI0OSA3LjE3MSAxOC4yNDkgMTYuOTU5IDAgOS43ODYtOC4zMzkgMTcuNjE5LTcuOTcxIDE2LjkwOS4zNjkuMjYyLjc3Mi40NTkgMS4yMDEuNTkyIDkuOTYxLS42NiAxOC4yNDktNy4xNzEgMTguMjQ5LTE2Ljk1OXoiIG9wYWNpdHk9Ii4xMiIvPjxwYXRoIGQ9Ik0zNiAxM2MtMS4xNDktNi4wNjMtNi4yNjItMTAuNTA3LTEyLjM3OS0xMC41MDdDOS4zMzggMi40OTMgNC4yNDUgNi45NCAzLjA5NiAxM0gwLS45ODRjLS4xMzMtLjQyOS0uMzMtLjgzMi0uNTkyLTEuMjAxLS42Ni05Ljk2MSA3LjE3MS0xOC4yNDkgMTYuOTU5LTE4LjI0OSA5Ljc4NiAwIDE3LjYxOSA4LjMzOSAxNi45NTkgNy45NzEtLjI2Mi4zNjktLjQ1OS43NzItLjU5MiAxLjIwMUg1Ny4wOThjLS4xMzMtLjQyOS0uMzMtLjgzMi0uNTkyLTEuMjAxLS42Ni05Ljk2MSA3LjE3MS0xOC4yNDkgMTYuOTU5LTE4LjI0OSA5Ljc4NiAwIDE3LjYxOSA4LjMzOSAxNi45NTkgNy45NzEtLjI2Mi4zNjktLjQ1OS43NzItLjU5MiAxLjIwMUg2MHoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTQ4KSIvPjwvZz48L3N2Zz4=')`, backgroundSize: '60px 60px' }}></div>

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center relative z-10"
          >
            <div className="flex justify-center mb-8 lg:mb-10">
              <Logo size="lg" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 lg:mb-8 drop-shadow-lg">
              <span className="block">مدیریت هوشمند تمرینات</span>
              <span className="block text-blue-300">و ارتباط موثر با مربی</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-10 lg:mb-12 leading-relaxed max-w-4xl mx-auto text-blue-200 opacity-90 drop-shadow">
              با فیتلو، تجربه‌ی تمرینات ورزشی خود را متحول کنید و به اهداف تناسب اندام خود برسید.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center gap-4 sm:gap-6 flex-wrap"
            >
              <Button asChild size="lg" className="px-8 py-4 text-lg font-semibold bg-white text-primary-600 hover:bg-gray-100 shadow-lg transform transition-transform duration-200">
                <Link to="/login">
                  شروع رایگان
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-primary-600 shadow-lg transform transition-transform duration-200">
                <Link to="/login">
                  ورود
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="bg-card/70 backdrop-blur-lg supports-[backdrop-filter]:bg-card/70 text-foreground py-24 sm:py-32 lg:py-40 shadow-inner">
        <Container>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-16 lg:mb-20 text-primary-800 dark:text-primary-200">ویژگی‌های برتر فیتلو</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {[
              { title: "مدیریت تمرینات", desc: "برنامه‌ریزی و پیگیری تمرینات روزانه با قابلیت شخصی‌سازی و تنوع بالا." },
              { title: "ارتباط با مربی", desc: "ارتباط مستقیم و دوسویه با مربی، دریافت بازخورد سریع و راهنمایی تخصصی." },
              { title: "گزارش‌گیری پیشرفته", desc: "تحلیل دقیق پیشرفت، مشاهده آمار و نمودارهای شخصی‌سازی شده." },
              { title: "کتابخانه جامع تمرین", desc: "دسترسی به مجموعه‌ای بزرگ از تمرینات با توضیحات و ویدیو." },
              { title: "برنامه‌های شخصی‌سازی شده", desc: "دریافت برنامه‌های تمرینی متناسب با نیازها و اهداف شما." },
              { title: "نظارت لحظه‌ای مربی", desc: "امکان نظارت مربی بر فعالیت‌های شما و ارائه راهکار به‌موقع." },
            ].map(({ title, desc }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full"
              >
                <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border/40 bg-card/80 dark:bg-card/60">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl sm:text-2xl font-semibold text-primary-800 dark:text-primary-200">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center flex-grow px-6 py-4">
                    <CardDescription className="text-base text-muted-foreground leading-relaxed">{desc}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 text-foreground py-24 sm:py-32 lg:py-40">
        <Container>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-16 lg:mb-20 text-primary-800 dark:text-primary-200">چرا فیتلو انتخاب شماست؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 lg:gap-16">
            {[{
              title: "برای ورزشکاران",
              items: [
                "برنامه تمرینی کاملا شخصی‌سازی شده بر اساس اهداف شما",
                "پیگیری دقیق و آسان پیشرفت روزانه و هفتگی",
                "ارتباط مستقیم و موثر با مربی برای راهنمایی بهتر",
                "دسترسی نامحدود به کتابخانه غنی ویدیوهای آموزشی"
              ]
            }, {
              title: "برای مربیان",
              items: [
                "مدیریت آسان و کارآمد تمامی شاگردان در یک بستر",
                "طراحی و ارسال برنامه‌های تمرینی متنوع و حرفه‌ای",
                "نظارت لحظه‌ای بر فعالیت و پیشرفت هر شاگرد",
                "فرصت‌های جدید برای درآمدزایی آنلاین و توسعه کسب و کار"
              ]
            }].map(({ title, items }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.2 }}
                className="space-y-6 h-full"
              >
                 <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border/40 bg-card/80 dark:bg-card/60">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl sm:text-2xl font-semibold text-primary-800 dark:text-primary-200">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-base text-muted-foreground flex-grow px-6 py-4">
                    <ul className="space-y-3 sm:space-y-4 list-inside list-none">
                      {items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-900 text-white py-24 sm:py-32 lg:py-40">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 lg:mb-10 text-white dark:text-primary-200">آماده‌اید شروع کنید؟</h2>
            <p className="text-lg sm:text-xl lg:text-2xl mb-10 lg:mb-12 leading-relaxed max-w-4xl mx-auto text-blue-200 opacity-90">
              همین امروز به فیتلو بپیوندید و آینده تناسب اندام و مربیگری خود را بسازید!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <Button asChild size="lg" className="px-10 py-5 text-xl font-semibold bg-white text-primary-700 hover:bg-gray-100 shadow-lg transform transition-transform duration-200">
                <Link to="/login">
                  ثبت نام رایگان
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

       {/* Footer */}
       <footer className="bg-primary-950 text-white py-8 text-center">
        <Container>
          <p className="text-sm text-gray-400">&copy; 2023 Fitlo. کلیه حقوق محفوظ است.</p>
        </Container>
      </footer>

    </div>
  );
};

export default Landing;
