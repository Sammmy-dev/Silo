"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft, CheckCircle2, Circle, CircleAlert, Eye, EyeOff } from "lucide-react";

import SiloLogo from "@/components/ui/silo-logo";
import api from "@/lib/api";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters").max(72),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function getStrength(pwd: string) {
  if (!pwd) return { label: "", score: 0, color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { label: "Weak", score: 1, color: "#ef4444" };
  if (score === 2) return { label: "Fair", score: 2, color: "#f97316" };
  if (score === 3) return { label: "Medium", score: 3, color: "#f59e0b" };
  return { label: "Strong", score: 4, color: "#22c55e" };
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = form.watch("password");
  const strength = getStrength(password);

  const requirements = [
    { label: "At least 8 characters long", met: password.length >= 8 },
    { label: "Must contain a number", met: /[0-9]/.test(password) },
    { label: "Include a special character", met: /[^A-Za-z0-9]/.test(password) },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
  ];

  const onSubmit = (values: ResetPasswordValues) => {
    if (!token) {
      setSubmitError("Reset token is missing.");
      return;
    }
    setSubmitError(null);
    startTransition(async () => {
      try {
        await api.post("/auth/reset-password", { token, password: values.password });
        setIsSuccess(true);
        form.reset();
        setTimeout(() => router.push("/login"), 2500);
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { message?: string } | undefined)?.message ?? "Unable to reset password."
          : "Unable to reset password.";
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
                Securing the backbone of global operations.
              </h1>
              <p className="max-w-88 text-base leading-7 text-white/70">
                Advanced inventory management meets editorial design precision. Your data, curated.
              </p>
            </div>

            <div className="text-xs font-medium tracking-[0.28em] text-white/50 uppercase">
              © 2024 Silo Logistics Systems • Proprietary Interface
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

            {isSuccess ? (
              /* ── Success state ── */
              <div className="space-y-8">
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-[2rem] font-bold tracking-[-0.03em] text-silo-ink">
                      Password reset successfully
                    </h1>
                    <p className="text-sm leading-6 text-silo-muted">
                      You can now log in with your new password.
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#04553f] px-6 py-3 text-sm font-semibold text-white shadow-[0_24px_48px_-28px_rgba(0,84,64,0.6)] transition hover:brightness-105"
                  >
                    Go to login
                  </Link>
                </div>
                <p className="text-center text-[0.72rem] text-silo-muted">
                  © 2024 Silo Logistics Systems • Proprietary Interface
                </p>
              </div>
            ) : (
              /* ── Form state ── */
              <div className="space-y-8">
                <div className="space-y-2">
                  <h1 className="text-[2rem] font-bold tracking-[-0.03em] text-silo-ink">
                    Set a new password
                  </h1>
                  <p className="text-sm leading-6 text-silo-muted">
                    Your new password must be different from previously used passwords to ensure your account remains secure.
                  </p>
                </div>

                {!token ? (
                  <div className="flex items-start gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-100">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>Reset token is missing. Use the password reset link from your email to continue.</p>
                  </div>
                ) : null}

                <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>

                  {/* New password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-[0.69rem] font-semibold tracking-[0.18em] text-silo-ink uppercase"
                    >
                      New password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Minimum 8 characters"
                        className="w-full rounded-xl bg-[#efede4] px-4 py-3.5 pr-12 text-sm text-silo-ink outline-none ring-1 ring-transparent transition placeholder:text-silo-muted/70 focus:ring-2 focus:ring-silo-primary-strong/45"
                        {...form.register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-silo-muted hover:text-silo-ink"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Strength bar + label */}
                    {password ? (
                      <>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-[#e4e3da]">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${(strength.score / 4) * 100}%`,
                              backgroundColor: strength.color,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[0.72rem] text-silo-muted">Password strength</span>
                          <span className="text-[0.72rem] font-semibold" style={{ color: strength.color }}>
                            {strength.label}
                          </span>
                        </div>
                      </>
                    ) : null}

                    {form.formState.errors.password ? (
                      <p className="text-sm text-rose-700">{form.formState.errors.password.message}</p>
                    ) : null}
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-[0.69rem] font-semibold tracking-[0.18em] text-silo-ink uppercase"
                    >
                      Confirm new password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Repeat your new password"
                        className="w-full rounded-xl bg-[#efede4] px-4 py-3.5 pr-12 text-sm text-silo-ink outline-none ring-1 ring-transparent transition placeholder:text-silo-muted/70 focus:ring-2 focus:ring-silo-primary-strong/45"
                        {...form.register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-silo-muted hover:text-silo-ink"
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {form.formState.errors.confirmPassword ? (
                      <p className="text-sm text-rose-700">{form.formState.errors.confirmPassword.message}</p>
                    ) : null}
                  </div>

                  {/* Requirements checklist */}
                  <div className="space-y-3 rounded-2xl bg-silo-panel px-4 py-4">
                    <p className="text-[0.69rem] font-semibold tracking-[0.18em] text-silo-ink uppercase">
                      Requirements
                    </p>
                    <ul className="space-y-2.5">
                      {requirements.map(({ label, met }) => (
                        <li key={label} className="flex items-center gap-3 text-sm">
                          {met ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-silo-muted/40" />
                          )}
                          <span className={met ? "text-silo-ink" : "text-silo-muted"}>{label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {submitError ? (
                    <div className="flex items-start gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-100">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>{submitError}</p>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isPending || !token}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#04553f] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_24px_48px_-28px_rgba(0,84,64,0.6)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending ? "Resetting password…" : "Reset password"}
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
                  © 2024 Silo Logistics Systems • Proprietary Interface
                </p>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
