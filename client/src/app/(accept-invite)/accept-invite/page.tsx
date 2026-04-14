"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRight, Clock3, Eye, EyeOff } from "lucide-react";

import SiloLogo from "@/components/ui/silo-logo";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

function getStrength(password: string): { label: string; score: number; color: string; hint?: string } {
  if (!password) return { label: "", score: 0, color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: "Weak", score: 1, color: "#ef4444", hint: "Add uppercase letters and numbers" };
  if (score === 2) return { label: "Fair", score: 2, color: "#f97316", hint: "Add a special character" };
  if (score === 3) return { label: "Medium", score: 3, color: "#f97316", hint: "Add a special character" };
  return { label: "Strong", score: 4, color: "#22c55e" };
}

const schema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    password: z.string().min(8, "Password must be at least 8 characters").max(72),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") ?? "";
  const orgName = searchParams.get("org") ?? "Your Organization";
  const orgInitial = orgName.charAt(0).toUpperCase();

  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", password: "", confirmPassword: "" },
  });

  const passwordValue = form.watch("password");
  const strength = getStrength(passwordValue);

  const onSubmit = (values: FormValues) => {
    if (!token) return;
    setSubmitError(null);

    startTransition(async () => {
      try {
        await api.post("/users/accept-invite", {
          token,
          password: values.password,
        });
        router.push("/login");
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { message?: string } | undefined)?.message ?? "Unable to accept invitation."
          : "Unable to accept invitation.";
        setSubmitError(message);
      }
    });
  };

  return (
    <main className="min-h-screen bg-white text-silo-ink">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ── Left panel ─────────────────────────────────────────────── */}
        <section className="hidden flex-col justify-between bg-[#1a4a35] px-9 py-10 text-white lg:flex xl:px-14 xl:py-12">
          <SiloLogo variant="white" iconClassName="h-7 w-7" labelClassName="text-2xl text-white" />

          <div className="max-w-sm space-y-4">
            <h1 className="text-[2.7rem] font-bold leading-[1.05] tracking-[-0.04em]">
              You&apos;ve been invited to join Silo
            </h1>
            <p className="text-base leading-6 text-white/70">
              {orgName} has invited you to manage inventory together.
            </p>
          </div>

          {/* Org card */}
          <div className="flex items-center gap-4 rounded-2xl bg-white/10 px-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-silo-primary text-base font-bold text-white">
              {orgInitial}
            </div>
            <div>
              <p className="font-semibold">{orgName}</p>
              <p className="text-sm text-white/55">Active Organization</p>
            </div>
          </div>
        </section>

        {/* ── Right panel ────────────────────────────────────────────── */}
        <section className="flex items-center justify-center overflow-y-auto px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-96 space-y-6 py-4">

            {/* Mobile logo */}
            <div className="lg:hidden">
              <SiloLogo variant="green" iconClassName="h-6 w-6" labelClassName="text-2xl text-silo-ink" />
            </div>

            {/* Org avatar */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-silo-nested text-2xl font-bold text-silo-muted ring-1 ring-[#e0ddd4]">
                {orgInitial}
              </div>
              <p className="text-[0.69rem] font-semibold tracking-[0.18em] text-silo-muted uppercase">
                {orgName}
              </p>
            </div>

            {/* Heading */}
            <div className="space-y-1.5 text-center">
              <h1 className="text-[2rem] font-bold tracking-[-0.03em] text-silo-ink">Accept your invitation</h1>
              <p className="text-base text-silo-muted">Create a password to activate your account.</p>
            </div>

            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Email — read-only */}
              <div className="space-y-2">
                <label className="block text-[0.69rem] font-semibold tracking-[0.18em] text-silo-ink uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  readOnly
                  value={email}
                  placeholder="alex.walker@example.com"
                  className="w-full cursor-default rounded-lg bg-[#efede4] px-4 py-3.5 text-base text-silo-muted outline-none opacity-70"
                />
              </div>

              {/* Full name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-[0.69rem] font-semibold tracking-[0.18em] text-silo-ink uppercase">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Alex Walker"
                  className={cn(
                    "w-full rounded-lg bg-[#efede4] px-4 py-3.5 text-base text-silo-ink outline-none ring-1 ring-transparent placeholder:text-[#b5b1a3] focus:ring-2 focus:ring-silo-primary-strong/35",
                    form.formState.errors.name && "bg-rose-50 ring-rose-300",
                  )}
                  {...form.register("name")}
                />
                {form.formState.errors.name?.message ? (
                  <p className="text-sm text-rose-700">{form.formState.errors.name.message}</p>
                ) : null}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-[0.69rem] font-semibold tracking-[0.18em] text-silo-ink uppercase">
                  Password
                </label>
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
                {passwordValue ? (
                  <p className="text-sm font-medium" style={{ color: strength.color }}>
                    Strength: {strength.label}{strength.hint ? ` — ${strength.hint}` : ""}
                  </p>
                ) : null}
                {form.formState.errors.password?.message ? (
                  <p className="text-sm text-rose-700">{form.formState.errors.password.message}</p>
                ) : null}
              </div>

              {/* Confirm password */}
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

              {/* Token missing notice */}
              {!token ? (
                <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-100">
                  Invitation token is missing. Please open the original invitation link from your email.
                </div>
              ) : null}

              {/* Submit error */}
              {submitError ? (
                <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-100">
                  {submitError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isPending || !token}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#04553f] px-4 py-3.5 text-base font-semibold text-white shadow-[0_10px_20px_-12px_rgba(4,85,63,0.7)] transition hover:bg-[#056049] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Accepting..." : "Accept invitation & join"}
                {!isPending ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </form>

            {/* Expiry notice */}
            <div className="flex items-center justify-center gap-2 text-sm text-amber-600">
              <Clock3 className="h-4 w-4 shrink-0" />
              Invitation expires in 48 hours.
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-silo-muted">
              © 2024 Silo Global Ops ·{" "}
              <Link href="#" className="hover:text-silo-ink">Privacy Policy</Link>
              {" "}·{" "}
              <Link href="#" className="hover:text-silo-ink">Help Center</Link>
            </p>

          </div>
        </section>

      </div>
    </main>
  );
}
