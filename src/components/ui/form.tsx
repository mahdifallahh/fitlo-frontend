import * as React from "react";
import { cn } from "../../lib/utils";

const Form = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => {
  return (
    <form
      ref={ref}
      className={cn("space-y-6", className)}
      {...props}
    />
  );
});
Form.displayName = "Form";

const FormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    />
  );
});
FormField.displayName = "FormField";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-bold text-gray-900 dark:text-gray-100",
        className
      )}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full p-3 rounded-xl border border-primary-300 dark:border-primary-700",
        "text-primary-900 dark:text-primary-100 bg-white dark:bg-primary-800",
        "placeholder-primary-400 dark:placeholder-primary-500",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm",
        "disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400",
        className
      )}
      {...props}
    />
  );
});
FormInput.displayName = "FormInput";

const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full p-3 rounded-xl border border-primary-300 dark:border-primary-700",
        "text-primary-900 dark:text-primary-100 bg-white dark:bg-primary-800",
        "placeholder-primary-400 dark:placeholder-primary-500",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm",
        "disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400",
        className
      )}
      {...props}
    />
  );
});
FormTextarea.displayName = "FormTextarea";

const FormButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "bg-primary-600 hover:bg-primary-700 text-white",
        "px-6 py-2 rounded-xl font-bold transition",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
});
FormButton.displayName = "FormButton";

export {
  Form,
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormButton,
}; 