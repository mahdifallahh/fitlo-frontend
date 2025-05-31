import * as React from "react";

export const SampleForm: React.FC = () => {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`نام: ${name}\nنوع: ${type}`);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white dark:bg-primary-900 rounded-xl shadow p-6 flex flex-col gap-4 rtl"
      dir="rtl"
    >
      <label className="font-bold text-primary-700 dark:text-primary-100">نام</label>
      <input
        className="input input-bordered rounded-lg p-2 border border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-800 text-primary-900 dark:text-primary-100 focus:ring-2 focus:ring-primary-400"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="نام را وارد کنید"
        required
      />
      <label className="font-bold text-primary-700 dark:text-primary-100">نوع</label>
      <select
        className="input input-bordered rounded-lg p-2 border border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-800 text-primary-900 dark:text-primary-100 focus:ring-2 focus:ring-primary-400"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      >
        <option value="">انتخاب کنید</option>
        <option value="coach">مربی</option>
        <option value="student">شاگرد</option>
      </select>
      <button
        type="submit"
        className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 rounded-lg transition"
      >
        ارسال
      </button>
    </form>
  );
};
export default SampleForm; 