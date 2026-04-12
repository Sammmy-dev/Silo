"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft, CheckCircle2, CircleAlert, LockKeyhole } from "lucide-react";

import FormField from "@/components/ui/form-field";
import api from "@/lib/api";

const resetPasswordSchema = z.object({
  password: z.string().min(8).max(72),
  confirmPassword: z.string().min(8).max(72),
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordValues) => {
    if (!token) {
      setSubmitError("Reset token is missing.");
      return;
    }

    setSubmitError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await api.post("/auth/reset-password", {
          token,
          password: values.password,
        });
        setSuccessMessage("Password reset complete. Redirecting to login...");
        form.reset();
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { message?: string } | undefined)?.message ?? "Unable to reset password."
          : "Unable to reset password.";

        setSubmitError(message);
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-[0.72rem] font-semibold tracking-[0.18em] text-silo-muted uppercase">Credential reset</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-silo-ink">Reset password</h1>
          <p className="max-w-md text-sm leading-6 text-silo-muted">Choose a strong new password for your account and restore access to your workspace.</p>
        </div>
      </div>

      {!token ? (
        <div className="flex items-start gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-100">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Reset token is missing. Use the password reset link from your email to continue.</p>
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField id="password" type="password" label="New password" autoComplete="new-password" placeholder="Minimum 8 characters" error={form.formState.errors.password?.message} {...form.register("password")} />
        <FormField id="confirmPassword" type="password" label="Confirm new password" autoComplete="new-password" placeholder="Repeat your new password" error={form.formState.errors.confirmPassword?.message} {...form.register("confirmPassword")} />

        {submitError ? (
          <div className="flex items-start gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-100">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{submitError}</p>
          </div>
        ) : null}

        {successMessage ? (
          <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-100">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{successMessage}</p>
          </div>
        ) : null}

        <button type="submit" disabled={isPending || !token} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--silo-primary)_0%,var(--silo-primary-strong)_100%)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_24px_48px_-28px_rgba(0,84,64,0.6)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60">
          {isPending ? "Resetting password..." : "Reset password"}
        </button>
      </form>

      <div className="rounded-3xl bg-silo-panel p-4 text-sm text-silo-muted">
        <div className="flex items-start gap-3">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-silo-primary" />
          <p>Your new password replaces the previous credential immediately once the reset token is validated.</p>
        </div>
      </div>

      <p className="text-center text-sm text-silo-muted">
        <Link href="/login" className="inline-flex items-center gap-2 font-semibold text-silo-primary underline-offset-4 hover:underline"><ArrowLeft className="h-4 w-4" />Back to login</Link>
      </p>
    </div>
  );
}