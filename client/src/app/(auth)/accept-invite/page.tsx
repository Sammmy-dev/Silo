"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRight, CheckCircle2, CircleAlert, Clock3, LockKeyhole } from "lucide-react";

import FormField from "@/components/ui/form-field";
import api from "@/lib/api";

const acceptInviteSchema = z.object({
  password: z.string().min(8).max(72),
  confirmPassword: z.string().min(8).max(72),
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AcceptInviteValues = z.infer<typeof acceptInviteSchema>;

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<AcceptInviteValues>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: AcceptInviteValues) => {
    if (!token) {
      setSubmitError("Invitation token is missing.");
      return;
    }

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
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-[0.72rem] font-semibold tracking-[0.18em] text-silo-muted uppercase">Team invitation</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-silo-ink">Accept your invitation</h1>
          <p className="max-w-md text-sm leading-6 text-silo-muted">Create a password to activate your invited account and join the organization workspace.</p>
        </div>
      </div>

      <div className="rounded-3xl bg-silo-panel p-4 text-sm text-silo-muted">
        <div className="flex items-start gap-3">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-silo-primary" />
          <p>{token ? "Invitation token detected. Set your password below to activate access." : "Invitation token missing. Open the invitation link from your email to continue."}</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField id="password" type="password" label="Password" autoComplete="new-password" placeholder="Create your password" error={form.formState.errors.password?.message} {...form.register("password")} />
        <FormField id="confirmPassword" type="password" label="Confirm password" autoComplete="new-password" placeholder="Repeat your password" error={form.formState.errors.confirmPassword?.message} {...form.register("confirmPassword")} />

        {submitError ? (
          <div className="flex items-start gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-100">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{submitError}</p>
          </div>
        ) : null}

        <button type="submit" disabled={isPending || !token} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--silo-primary)_0%,var(--silo-primary-strong)_100%)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_24px_48px_-28px_rgba(0,84,64,0.6)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60">
          {isPending ? "Accepting invite..." : "Accept invitation"}
          {!isPending ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </form>

      <div className="grid gap-3 rounded-3xl bg-white p-4 text-sm text-silo-muted ring-1 ring-(--silo-outline)">
        <div className="flex items-start gap-3">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-silo-primary" />
          <p>Your password activates the invited user account linked to this email and organization.</p>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-silo-primary" />
          <p>After accepting, you&apos;ll be redirected to sign in with your new credentials.</p>
        </div>
      </div>

      <p className="text-center text-sm text-silo-muted">
        Already have access? <Link href="/login" className="font-semibold text-silo-primary underline-offset-4 hover:underline">Go to login</Link>
      </p>
    </div>
  );
}