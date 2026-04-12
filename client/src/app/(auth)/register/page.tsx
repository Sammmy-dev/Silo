"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRight, CheckCircle2, CircleAlert, Globe, ShieldCheck } from "lucide-react";

import FormField from "@/components/ui/form-field";
import api from "@/lib/api";

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72),
  confirmPassword: z.string().min(8).max(72),
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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
        const message = axios.isAxiosError(error)
          ? (error.response?.data as { message?: string } | undefined)?.message ?? "Unable to create your account."
          : "Unable to create your account.";

        setSubmitError(message);
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-[0.72rem] font-semibold tracking-[0.18em] text-silo-muted uppercase">New organization access</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-silo-ink">Create your account</h1>
          <p className="max-w-md text-sm leading-6 text-silo-muted">
            Start your Silo workspace and set up secure access for your first inventory organization.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          disabled
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-silo-panel px-4 py-3.5 text-sm font-medium text-silo-muted transition disabled:cursor-not-allowed"
        >
          <Globe className="h-4.5 w-4.5 text-silo-primary" />
          Continue with Google
        </button>
        <p className="text-center text-xs text-silo-muted">Google account setup is available when the identity client is configured.</p>
      </div>

      <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-silo-muted uppercase">
        <span className="h-px flex-1 bg-silo-nested" />
        or continue with email
        <span className="h-px flex-1 bg-silo-nested" />
      </div>

      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField id="email" type="email" label="Work email" autoComplete="email" placeholder="team@company.com" error={form.formState.errors.email?.message} {...form.register("email")} />
        <FormField id="password" type="password" label="Password" autoComplete="new-password" placeholder="Minimum 8 characters" error={form.formState.errors.password?.message} {...form.register("password")} />
        <FormField id="confirmPassword" type="password" label="Confirm password" autoComplete="new-password" placeholder="Repeat your password" error={form.formState.errors.confirmPassword?.message} {...form.register("confirmPassword")} />

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

        <button type="submit" disabled={isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--silo-primary)_0%,var(--silo-primary-strong)_100%)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_24px_48px_-28px_rgba(0,84,64,0.6)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60">
          {isPending ? "Creating account..." : "Create account"}
          {!isPending ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </form>

      <div className="grid gap-3 rounded-3xl bg-silo-panel p-4 text-sm text-silo-muted">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-silo-primary" />
          <p>Your first account is created as an organization admin and must verify email before login.</p>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-silo-primary" />
          <p>After sign-up, you can create your organization, locations, and invite staff from the app.</p>
        </div>
      </div>

      <p className="text-center text-sm text-silo-muted">
        Already registered? <Link href="/login" className="font-semibold text-silo-primary underline-offset-4 hover:underline">Log in</Link>
      </p>
    </div>
  );
}