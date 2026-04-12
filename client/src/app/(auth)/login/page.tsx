"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CircleAlert, Globe } from "lucide-react";

import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginValues) => {
    setSubmitError(null);

    startTransition(async () => {
      try {
        const response = await api.post("/auth/login", values);
        const { accessToken, user } = response.data as {
          accessToken: string;
          user: Record<string, unknown>;
        };

        setAuth(user, accessToken);
        router.push("/dashboard");
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { message?: string } | undefined)?.message ?? "Unable to sign in."
          : "Unable to sign in.";

        setSubmitError(message);
      }
    });
  };

  return (
    <div className="space-y-9">
      <div className="space-y-4">
        <h1 className="text-[2.15rem] font-semibold tracking-[-0.05em] text-silo-ink sm:text-[2.55rem]">Log in to Silo</h1>
        <p className="text-base leading-7 text-silo-muted">Enter your credentials to access your dashboard.</p>
      </div>

      <div className="space-y-8">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#efede4] px-4 py-3.5 text-base font-medium text-silo-ink transition hover:bg-[#e9e6da]"
        >
          <Globe className="h-4.5 w-4.5 text-silo-primary" />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.24em] text-silo-muted uppercase">
          <span className="h-px flex-1 bg-[#ece8dc]" />
          or email
          <span className="h-px flex-1 bg-[#ece8dc]" />
        </div>

        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2.5">
            <label htmlFor="email" className="block text-[0.72rem] font-semibold tracking-[0.18em] text-silo-ink uppercase">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              className={cn(
                "w-full rounded-lg bg-[#efede4] px-4 py-3.5 text-base text-silo-ink outline-none ring-1 ring-transparent placeholder:text-[#b5b1a3] focus:ring-2 focus:ring-silo-primary-strong/35",
                form.formState.errors.email && "bg-rose-50 text-rose-900 focus:ring-rose-400/40",
              )}
              {...form.register("email")}
            />
            {form.formState.errors.email?.message ? <p className="text-sm text-rose-700">{form.formState.errors.email.message}</p> : null}
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="password" className="block text-[0.72rem] font-semibold tracking-[0.18em] text-silo-ink uppercase">
                Password
              </label>
              <Link href="/forgot-password" className="text-[0.72rem] font-semibold text-silo-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="........"
              className={cn(
                "w-full rounded-lg bg-[#efede4] px-4 py-3.5 text-base text-silo-ink outline-none ring-1 ring-transparent placeholder:text-[#8e8a7f] focus:ring-2 focus:ring-silo-primary-strong/35",
                form.formState.errors.password && "bg-rose-50 text-rose-900 focus:ring-rose-400/40",
              )}
              {...form.register("password")}
            />
            {form.formState.errors.password?.message ? <p className="text-sm text-rose-700">{form.formState.errors.password.message}</p> : null}
          </div>

          {submitError ? (
            <div className="flex items-start gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-100">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{submitError}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-[#04553f] px-4 py-3.5 text-base font-semibold text-white shadow-[0_10px_20px_-12px_rgba(4,85,63,0.7)] transition hover:bg-[#056049] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Log in"}
          </button>
        </form>
      </div>

      <div className="space-y-7 pt-1">
        <div className="h-px w-full bg-[#ece8dc]" />
        <p className="text-center text-base text-silo-ink/85">
          Don&apos;t have an account? <Link href="/register" className="font-semibold text-silo-primary hover:underline">Contact administration</Link>
        </p>
      </div>
    </div>
  );
}