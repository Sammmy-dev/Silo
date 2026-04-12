"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft, CheckCircle2, CircleAlert, Mail } from "lucide-react";

import FormField from "@/components/ui/form-field";
import api from "@/lib/api";

const forgotPasswordSchema = z.object({
  email: z.email(),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordValues) => {
    setSubmitError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await api.post("/auth/forgot-password", values);
        setSuccessMessage("Check your email for a password reset link.");
        form.reset();
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { message?: string } | undefined)?.message ?? "Unable to send reset link."
          : "Unable to send reset link.";

        setSubmitError(message);
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-[0.72rem] font-semibold tracking-[0.18em] text-silo-muted uppercase">Recovery flow</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-silo-ink">Forgot your password?</h1>
          <p className="max-w-md text-sm leading-6 text-silo-muted">
            Enter your work email and we&apos;ll send you a secure link to reset your password and regain access.
          </p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField id="email" type="email" label="Work email" autoComplete="email" placeholder="name@company.com" error={form.formState.errors.email?.message} {...form.register("email")} />

        {submitError ? (
          <div className="flex items-start gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-100">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{submitError}</p>
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-100">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="space-y-1.5">
                <h2 className="font-semibold">Reset link sent</h2>
                <p>{successMessage}</p>
                <p className="text-emerald-800/80">Check your spam folder if it doesn&apos;t arrive within a few minutes.</p>
              </div>
            </div>
          </div>
        ) : null}

        <button type="submit" disabled={isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--silo-primary)_0%,var(--silo-primary-strong)_100%)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_24px_48px_-28px_rgba(0,84,64,0.6)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60">
          {isPending ? "Sending link..." : "Send reset link"}
        </button>
      </form>

      <div className="rounded-3xl bg-silo-panel p-4 text-sm text-silo-muted">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-silo-primary" />
          <p>Password recovery emails are sent only when a matching account exists, to protect account privacy.</p>
        </div>
      </div>

      <p className="text-center text-sm text-silo-muted">
        <Link href="/login" className="inline-flex items-center gap-2 font-semibold text-silo-primary underline-offset-4 hover:underline"><ArrowLeft className="h-4 w-4" />Back to login</Link>
      </p>
    </div>
  );
}