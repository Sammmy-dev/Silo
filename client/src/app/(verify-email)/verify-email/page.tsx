"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, CheckCircle2, CircleAlert, Clock, LoaderCircle, Mail, Pencil, RefreshCw, Warehouse } from "lucide-react";

import SiloLogo from "@/components/ui/silo-logo";
import api from "@/lib/api";

type VerifyStatus = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Token-based verification state
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("loading");
  const [verifyMessage, setVerifyMessage] = useState("");

  // Resend state (email-waiting mode)
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  // Auto-verify when token is present
  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        await api.post("/auth/verify-email", { token });
        setVerifyStatus("success");
        setVerifyMessage("Your email has been verified. You can now sign in.");
      } catch (error) {
        const msg = axios.isAxiosError(error)
          ? (error.response?.data as { message?: string } | undefined)?.message ?? "Unable to verify email."
          : "Unable to verify email.";
        setVerifyStatus("error");
        setVerifyMessage(msg);
      }
    };
    void verify();
  }, [token]);

  // Countdown timer for resend (email-waiting mode only)
  useEffect(() => {
    if (token) return;
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, token]);

  const handleResend = async () => {
    if (!email || isResending) return;
    setIsResending(true);
    setResendError(null);
    try {
      await api.post("/auth/resend-verification", { email });
      setResendDone(true);
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      const msg = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message ?? "Unable to resend email."
        : "Unable to resend email.";
      setResendError(msg);
    } finally {
      setIsResending(false);
    }
  };

  const formatCountdown = (c: number) => {
    const m = Math.floor(c / 60);
    const s = c % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
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

            <div className="max-w-120 space-y-10">
              <div className="space-y-5">
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.2em] text-white/80 uppercase">
                  Global Operations
                </span>
                <h1 className="max-w-96 text-[2.7rem] font-bold leading-[1.05] tracking-[-0.04em] text-white">
                  Precision in every shipment.
                </h1>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-white/10 px-5 py-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                  <Warehouse className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-semibold text-white">Real-time visibility</h2>
                  <p className="text-sm leading-5 text-white/65">
                    Track every SKU across multiple global warehouses from a single source of truth.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs font-medium tracking-[0.28em] text-white/50 uppercase">
              © 2024 Silo Logistics Inc. All rights reserved.
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

            {token ? (
              /* ── Token verification mode ── */
              <div className="space-y-8">
                <div className="flex flex-col items-center gap-6 text-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                      verifyStatus === "success"
                        ? "bg-emerald-100 text-emerald-700"
                        : verifyStatus === "error"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-silo-panel text-silo-primary"
                    }`}
                  >
                    {verifyStatus === "success" ? <CheckCircle2 className="h-8 w-8" /> : null}
                    {verifyStatus === "error" ? <CircleAlert className="h-8 w-8" /> : null}
                    {verifyStatus === "loading" ? <LoaderCircle className="h-8 w-8 animate-spin" /> : null}
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-[2rem] font-bold tracking-[-0.03em] text-silo-ink">
                      {verifyStatus === "success"
                        ? "Email verified!"
                        : verifyStatus === "error"
                          ? "Verification failed"
                          : "Verifying your email…"}
                    </h1>
                    <p className="text-sm leading-6 text-silo-muted">
                      {verifyMessage || "Checking your verification link…"}
                    </p>
                  </div>

                  {verifyStatus === "success" ? (
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#04553f] px-6 py-3 text-sm font-semibold text-white shadow-[0_24px_48px_-28px_rgba(0,84,64,0.6)] transition hover:brightness-105"
                    >
                      Go to sign in
                    </Link>
                  ) : null}

                  {verifyStatus === "error" ? (
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-silo-primary underline-offset-4 hover:underline"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to login
                    </Link>
                  ) : null}
                </div>

                <p className="text-center text-[0.72rem] text-silo-muted">
                  © 2024 Silo Logistics Inc. All rights reserved.
                </p>
              </div>
            ) : (
              /* ── Email-waiting mode ── */
              <div className="space-y-8">
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a4a35] text-white">
                    <Mail className="h-8 w-8" />
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-[2rem] font-bold tracking-[-0.03em] text-silo-ink">Check your inbox</h1>
                    <p className="text-sm leading-6 text-silo-muted">
                      We&apos;ve sent a verification link to{" "}
                      {email ? (
                        <span className="font-semibold text-silo-ink">{email}</span>
                      ) : (
                        "your email address"
                      )}
                      . Click the link to activate your account.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {resendDone ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      <CheckCircle2 className="h-4 w-4" />
                      Verification email resent!
                    </div>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={!canResend || isResending || !email}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-silo-panel px-4 py-3 text-sm font-semibold text-silo-ink ring-1 ring-[#e4e3da] transition hover:bg-silo-nested disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <RefreshCw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
                      {isResending
                        ? "Sending…"
                        : canResend
                          ? "Resend email"
                          : `Resend in ${formatCountdown(countdown)}`}
                    </button>
                  )}

                  {resendError ? (
                    <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>{resendError}</p>
                    </div>
                  ) : null}

                  <div className="flex justify-center">
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 text-sm text-silo-muted transition underline-offset-4 hover:text-silo-ink hover:underline"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Change email address
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[0.69rem] font-medium tracking-[0.14em] text-silo-muted uppercase">
                  <Clock className="h-3.5 w-3.5" />
                  The link expires in 24 hours.
                </div>

                <div className="flex justify-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-silo-primary underline-offset-4 hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                  </Link>
                </div>

                <p className="text-center text-[0.72rem] text-silo-muted">
                  © 2024 Silo Logistics Inc. All rights reserved.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
