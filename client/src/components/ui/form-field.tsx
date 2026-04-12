"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { className, error, id, label, ...props },
  ref,
) {
  return (
    <div className="space-y-2.5">
      <label htmlFor={id} className="block text-[0.72rem] font-semibold tracking-[0.18em] text-silo-muted uppercase">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full rounded-xl bg-silo-input px-4 py-3.5 text-sm text-silo-ink outline-none ring-1 ring-transparent transition placeholder:text-silo-muted/70 focus:ring-2 focus:ring-silo-primary-strong/45",
          error && "bg-rose-50 text-rose-900 focus:ring-rose-400/40",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </div>
  );
});

export default FormField;