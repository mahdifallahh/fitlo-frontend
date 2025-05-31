import * as React from "react";

export const ThemeSwitcher: React.FC = () => {
  const [isDark, setIsDark] = React.useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <button
      aria-label="تغییر تم"
      className="rounded-full p-2 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-100 transition"
      onClick={() => setIsDark((d) => !d)}
    >
      {isDark ? (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>
      ) : (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/><path stroke="currentColor" strokeWidth="2" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>
      )}
    </button>
  );
};
export default ThemeSwitcher; 