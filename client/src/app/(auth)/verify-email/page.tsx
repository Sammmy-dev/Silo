"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, CheckCircle2, CircleAlert, LoaderCircle, Mail } from "lucide-react";

import api from "@/lib/api";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        await api.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage("Your email has been verified. You can now sign in.");
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? (error.response?.data as { message?: string } | undefined)?.message ?? "Unable to verify email."
          : "Unable to verify email.";

        setStatus("error");
        setMessage(errorMessage);
      }
    };

    void verify();
  }, [token]);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-[0.72rem] font-semibold tracking-[0.18em] text-silo-muted uppercase">Email verification</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-silo-ink">Verify your email</h1>
          <p className="max-w-md text-sm leading-6 text-silo-muted">We&apos;re checking your verification link so you can start using your Silo workspace securely.</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] bg-silo-panel p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${status === "success" ? "bg-emerald-100 text-emerald-700" : status === "error" ? "bg-rose-100 text-rose-700" : "bg-white text-silo-primary"}`}>
            {status === "success" ? <CheckCircle2 className="h-6 w-6" /> : null}
            {status === "error" ? <CircleAlert className="h-6 w-6" /> : null}
            {status === "loading" ? <LoaderCircle className="h-6 w-6 animate-spin" /> : null}
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-silo-ink">
              {status === "success" ? "Verification complete" : status === "error" ? "Verification failed" : "Checking your link"}
            </h2>
            <p className={status === "success" ? "text-sm leading-6 text-emerald-800" : status === "error" ? "text-sm leading-6 text-rose-800" : "text-sm leading-6 text-silo-muted"}>{message}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-4 text-sm text-silo-muted ring-1 ring-(--silo-outline)">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-silo-primary" />
          <p>If the link has expired, request a fresh verification email by registering again or contacting your workspace administrator.</p>
        </div>
      </div>

      <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-silo-primary underline-offset-4 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>
    </div>
  );
}