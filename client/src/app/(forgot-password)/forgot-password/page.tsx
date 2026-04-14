"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft, CheckCircle2, CircleAlert, Info, LogIn, Mail } from "lucide-react";

import SiloLogo from "@/components/ui/silo-logo";
import FormField from "@/components/ui/form-field";
import api from "@/lib/api";

const forgotPasswordSchema = z.object({
  email: z.email(),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordValues) => {
    setSubmitError(null);
    startTransition(async () => {
      try {
        await api.post("/auth/forgot-password", values);
        setSuccessEmail(values.email);
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
    <main className="min-h-screen bg-white text-silo-ink">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ── Left panel ─────────────────────────────────────────── */}
        <section className="hidden bg-[#1a4a35] text-white lg:flex">
          <div className="flex h-full w-full flex-col justify-between px-9 py-10 xl:px-14 xl:py-10">

            <SiloLogo
              variant="white"
              iconClassName="h-7 w-7"
              labelClassName="text-2xl leading-none tracking-[-0.03em] text-white"
            />

            <div className="max-w-120 space-y-6">
              <h1 className="max-w-104 text-[2.7rem] font-bold leading-[1.05] tracking-[-0.04em] text-white">
                Master your supply chain with clinical precision.
              </h1>
              <p className="max-w-88 text-base leading-7 text-white/70">
                A curated experience for modern logistics management and global warehouse operations.
              </p>
            </div>

            <div className="text-xs font-medium tracking-[0.28em] text-white/50 uppercase">
              Trusted by 2,000+ logistics teams worldwide
            </div>
          </div>
        </section>

        {/* ── Right panel ────────────────────────────────────────── */}
        <section className="flex flex-col items-center justify-center bg-[#fbf9f1] px-6 py-10 sm:px-10 lg:px-16 xl:px-20">
          <div className="w-full max-w-84 sm:max-w-96">

            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <SiloLogo variant="green" iconClassName="h-7 w-7" labelClassName="text-3xl text-silo-primary" />
            </div>

            {successEmail ? (
              /* ── Success state ── */
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-[2rem] font-bold tracking-[-0.03em] text-silo-ink">Reset link sent</h1>
                    <p className="text-sm leading-6 text-silo-muted">
                      If <span className="font-semibold text-silo-ink">{successEmail}</span> has an account, you&apos;ll receive a reset link shortly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-silo-panel px-4 py-4 text-sm text-silo-muted">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-silo-primary" />
                  <p>Can&apos;t find the email? Check your spam folder or contact your organization&apos;s administrator.</p>
                </div>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-silo-primary underline-offset-4 hover:underline"
                >
                  <LogIn className="h-4 w-4" />
                  Back to login
                </Link>

                <p className="text-center text-[0.72rem] text-silo-muted">
                  © 2024 Silo Global Ops · Privacy Policy · Support
                </p>
              </div>
            ) : (
              /* ── Form state ── */
              <div className="space-y-8">
                <div className="space-y-2">
                  <h1 className="text-[2rem] font-bold tracking-[-0.03em] text-silo-ink">
                    Forgot your password?
                  </h1>
                  <p className="text-sm leading-6 text-silo-muted">
                    Enter your work email and we&apos;ll send you a link to reset your password and regain access to your inventory dashboard.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    id="email"
                    type="email"
                    label="Work email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    error={form.formState.errors.email?.message}
                    {...form.register("email")}
                  />

                  {submitError ? (
                    <div className="flex items-start gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-100">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>{submitError}</p>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#04553f] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_24px_48px_-28px_rgba(0,84,64,0.6)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Mail className="h-4 w-4" />
                    {isPending ? "Sending link…" : "Send reset link"}
                  </button>
                </form>

                <p className="text-center text-sm">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 font-semibold text-silo-primary underline-offset-4 hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Link>
                </p>

                <p className="text-center text-[0.72rem] text-silo-muted">
                  © 2024 Silo Global Ops · Privacy Policy · Support
                </p>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
