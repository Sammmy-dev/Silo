"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Shield } from "lucide-react";

import SiloLogo from "@/components/ui/silo-logo";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Real-time stock tracking",
    description: "Never lose sight of a single SKU across multiple warehouse locations.",
  },
  {
    title: "Automated reordering",
    description: "AI-driven low stock alerts that predict demand before it peaks.",
  },
  {
    title: "Advanced reporting",
    description: "Deep insights into warehouse efficiency and supply chain health.",
  },
];

function getStrength(password: string): { label: string; score: number; color: string } {
  if (!password) return { label: "", score: 0, color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: "Weak", score: 1, color: "#ef4444" };
  if (score === 2) return { label: "Fair", score: 2, color: "#f97316" };
  if (score === 3) return { label: "Good", score: 3, color: "#f97316" };
  return { label: "Strong", score: 4, color: "#22c55e" };
}

const registerSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters").max(72),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((v) => v === true, { message: "You must accept the terms to continue." }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", terms: false },
  });

  const passwordValue = form.watch("password");
  const strength = getStrength(passwordValue);

  const onSubmit = (values: RegisterValues) => {
    setSubmitError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        await api.post("/auth/register", {
          email: values.email,
          password: values.password,
        });
        setSuccessMessage("Registration successful. Check your email to verify your account.");
        form.reset();
      } catch (error) {
        const message =
          axios.isAxiosError(error)
            ? (error.response?.data as { message?: string } | undefined)?.message ?? "Unable to create your account."
            : "Unable to create your account.";
        setSubmitError(message);
      }
    });
  };

  return (
    <main className="min-h-screen bg-white text-silo-ink">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">

        {/* ── Left panel ─────────────────────────────────────────── */}
        <section className="hidden bg-[#dce8d8] lg:flex">
          <div className="flex h-full w-full flex-col justify-between px-9 py-10 xl:px-12 xl:py-12">

            <SiloLogo variant="green" iconClassName="h-7 w-7" labelClassName="text-2xl text-silo-ink" />

            <div className="space-y-8">
              <div className="space-y-3">
                <h1 className="max-w-68 text-[2.7rem] font-bold leading-[1.05] tracking-[-0.04em] text-silo-ink">
                  Start managing your inventory smarter
                </h1>
                <p className="text-base leading-6 text-silo-muted">
                  Join 500+ retail shops and warehouses already using Silo.
                </p>
              </div>

              <div className="space-y-6">
                {features.map(({ description, title }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-silo-primary text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-silo-ink">{title}</p>
                      <p className="text-sm leading-5 text-silo-muted">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-base text-silo-ink">
              Already have an account?{" "}
              <Link
                href="/login"
                className="inline-flex items-center gap-1 font-semibold text-silo-primary hover:underline"
              >
                Log in <ArrowRight className="h-4 w-4" />
              </Link>
            </p>
          </div>
        </section>

        {/* ── Right panel ────────────────────────────────────────── */}
        <section className="flex items-start justify-center overflow-y-auto px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-104 py-4">

            {/* Mobile logo */}
            <div className="mb-8 lg:hidden">
              <SiloLogo variant="green" iconClassName="h-7 w-7" labelClassName="text-2xl text-silo-ink" />
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <h1 className="text-[2rem] font-bold tracking-[-0.03em] text-silo-ink">Create your account</h1>
                <p className="text-base text-silo-muted">Free forever. No credit card required.</p>
              </div>

              {/* Google button */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#efede4] px-4 py-3.5 text-base font-medium text-silo-ink transition hover:bg-[#e9e6da]"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 text-[0.78rem] text-silo-muted">
                <span className="h-px flex-1 bg-[#e0ddd4]" />
                — or continue with email —
                <span className="h-px flex-1 bg-[#e0ddd4]" />
              </div>

              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-[0.69rem] font-semibold tracking-[0.18em] text-silo-ink uppercase">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    className={cn(
                      "w-full rounded-lg bg-[#efede4] px-4 py-3.5 text-base text-silo-ink outline-none ring-1 ring-transparent placeholder:text-[#b5b1a3] focus:ring-2 focus:ring-silo-primary-strong/35",
                      form.formState.errors.name && "bg-rose-50 ring-rose-300",
                    )}
                    {...form.register("name")}
                  />
                  {form.formState.errors.name?.message ? <p className="text-sm text-rose-700">{form.formState.errors.name.message}</p> : null}
                </div>

                {/* Work Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[0.69rem] font-semibold tracking-[0.18em] text-silo-ink uppercase">
                    Work Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="john@company.com"
                    className={cn(
                      "w-full rounded-lg bg-[#efede4] px-4 py-3.5 text-base text-silo-ink outline-none ring-1 ring-transparent placeholder:text-[#b5b1a3] focus:ring-2 focus:ring-silo-primary-strong/35",
                      form.formState.errors.email && "bg-rose-50 ring-rose-300",
                    )}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email?.message ? <p className="text-sm text-rose-700">{form.formState.errors.email.message}</p> : null}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="password" className="block text-[0.69rem] font-semibold tracking-[0.18em] text-silo-ink uppercase">
                      Password
                    </label>
                    <span className="text-[0.65rem] font-semibold tracking-[0.12em] text-rose-500 uppercase">
                      Min. 8 characters
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••••••••"
                      className={cn(
                        "w-full rounded-lg bg-[#efede4] px-4 py-3.5 pr-12 text-base text-silo-ink outline-none ring-1 ring-transparent placeholder:text-[#8e8a7f] focus:ring-2 focus:ring-silo-primary-strong/35",
                        form.formState.errors.password && "bg-rose-50 ring-rose-300",
                      )}
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-silo-muted hover:text-silo-ink"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {passwordValue ? (
                    <div className="space-y-1.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{ backgroundColor: i <= strength.score ? strength.color : "#e0ddd4" }}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-medium" style={{ color: strength.color }}>
                        Password strength: {strength.label}
                      </p>
                    </div>
                  ) : null}
                  {form.formState.errors.password?.message ? (
                    <p className="text-sm text-rose-700">{form.formState.errors.password.message}</p>
                  ) : null}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-[0.69rem] font-semibold tracking-[0.18em] text-silo-ink uppercase">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••••••••"
                      className={cn(
                        "w-full rounded-lg bg-[#efede4] px-4 py-3.5 pr-12 text-base text-silo-ink outline-none ring-1 ring-transparent placeholder:text-[#8e8a7f] focus:ring-2 focus:ring-silo-primary-strong/35",
                        form.formState.errors.confirmPassword && "bg-rose-50 ring-rose-300",
                      )}
                      {...form.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-silo-muted hover:text-silo-ink"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword?.message ? (
                    <p className="text-sm text-rose-700">{form.formState.errors.confirmPassword.message}</p>
                  ) : null}
                </div>

                {/* Terms */}
                <div className="space-y-1">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-5 w-5 cursor-pointer rounded accent-silo-primary"
                      {...form.register("terms")}
                    />
                    <span className="text-base leading-6 text-silo-muted">
                      I agree to the{" "}
                      <Link href="#" className="font-semibold text-silo-ink underline underline-offset-2">
                        Terms of Service
                      </Link>
                      {" "}and{" "}
                      <Link href="#" className="font-semibold text-silo-ink underline underline-offset-2">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {form.formState.errors.terms?.message ? (
                    <p className="text-sm text-rose-700">{form.formState.errors.terms.message}</p>
                  ) : null}
                </div>

                {/* Messages */}
                {submitError ? (
                  <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-100">
                    {submitError}
                  </div>
                ) : null}
                {successMessage ? (
                  <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-100">
                    {successMessage}
                  </div>
                ) : null}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-lg bg-[#04553f] px-4 py-3.5 text-base font-semibold text-white shadow-[0_10px_20px_-12px_rgba(4,85,63,0.7)] transition hover:bg-[#056049] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Creating account..." : "Create account"}
                </button>
              </form>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 text-[0.69rem] font-semibold tracking-[0.12em] text-silo-muted uppercase">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  SOC2 Compliant
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  256-bit AES
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
