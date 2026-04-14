"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  BellRing,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronDown,
  MapPin,
  Package,
  SlidersHorizontal,
  Users,
} from "lucide-react";

import SiloLogo from "@/components/ui/silo-logo";

// ── Static data ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#" },
];

const TRUSTED_BY = ["VANGUARD", "L'Artisan", "NEXUS", "MODERNA", "KULTUR"];

const FEATURES = [
  {
    icon: MapPin,
    title: "Multi-location Support",
    description: "Coordinate stock across warehouses, retail stores, and online hubs from a unified interface.",
    iconBg: "#fce8e8",
    iconColor: "#b53131",
    colSpan: 1,
    cardBg: "bg-silo-surface",
  },
  {
    icon: SlidersHorizontal,
    title: "Custom Attributes",
    description: "Add any data point\u2014material, artist, edition number, or provenance\u2014to fit your unique catalog.",
    iconBg: "#ede8f6",
    iconColor: "#6d35c0",
    colSpan: 2,
    cardBg: "bg-white shadow-sm ring-1 ring-[#ebebeb]",
  },
  {
    icon: Package,
    title: "Purchase Orders",
    description: "Streamline vendor relationships with automated PO generation based on your actual demand.",
    iconBg: "#e4f2ea",
    iconColor: "#2a7a42",
    colSpan: 2,
    cardBg: "bg-[#e4f2ea]",
  },
  {
    icon: BellRing,
    title: "Real-time Alerts",
    description: "Never miss a low-stock event with intelligent push notifications and automated reorder triggers.",
    iconBg: "#fdf0e4",
    iconColor: "#c45c12",
    colSpan: 1,
    cardBg: "bg-[#fdf0e4]",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Detailed Reporting",
    description: "Gain insights into stock velocity and turnover rates with beautifully rendered analytics dashboards.",
    iconBg: "#e4f0ea",
    iconColor: "#005440",
    colSpan: 1,
    cardBg: "bg-silo-surface",
  },
  {
    icon: Users,
    title: "Team Permissions",
    description: "Collaborate securely with role-based access controls for your warehouse team and office staff.",
    iconBg: "#e4ecf6",
    iconColor: "#1a5aaa",
    colSpan: 2,
    cardBg: "bg-[#e4ecf6]",
  },
];



const STEPS = [
  {
    n: "1",
    title: "Connect your data",
    description: "Import existing CSVs or connect your Shopify/ERP in minutes. Our engine handles the mapping for you.",
  },
  {
    n: "2",
    title: "Track movements",
    description: "Record every incoming pallet and outgoing parcel with mobile-first scanning and real-time sync.",
  },
  {
    n: "3",
    title: "Scale with confidence",
    description: "Use predictive analytics to forecast demand and optimize your capital allocation automatically.",
  },
];

const PLANS = [
  {
    name: "Studio",
    price: "$99",
    period: "/mo",
    features: ["Up to 500 SKUs", "Single Location", "Basic Analytics"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Curator",
    price: "$249",
    period: "/mo",
    features: ["Unlimited SKUs", "Multi-location support", "Custom Attributes", "Priority Support"],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Custom Integrations", "White-label Reports", "Dedicated Manager"],
    cta: "Contact Sales",
    popular: false,
  },
];

const FAQS = [
  {
    q: "Can I manage multiple businesses under one account?",
    a: "Yes, Silo supports multi-tenancy. You can switch between different brand catalogs and warehouses seamlessly from the main dashboard sidebar.",
  },
  {
    q: "Does Silo integrate with Shopify or WooCommerce?",
    a: "Absolutely. We offer native integrations for most major e-commerce platforms. Orders flow in automatically, and stock levels are synced back in real-time.",
  },
  {
    q: "How secure is my proprietary collection data?",
    a: "Data security is our top priority. We use bank-grade AES-256 encryption for all data at rest and in transit, with regular third-party security audits.",
  },
  {
    q: "Is there a limit on the number of team members?",
    a: "No. We believe inventory is a team effort. You can invite your entire staff at no extra cost; pricing is based solely on SKU volume and features.",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-silo-surface text-silo-ink">

      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#e4e3da]/60 bg-silo-surface/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 lg:px-8">
          <SiloLogo variant="green" iconClassName="h-6 w-6" labelClassName="text-xl text-silo-ink" />

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ href, label }, i) => (
              <a
                key={label}
                href={href}
                className={`relative px-3 py-1.5 text-sm font-medium transition ${
                  i === 0
                    ? "text-silo-ink after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-silo-primary"
                    : "text-silo-muted hover:text-silo-ink"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          <Link
            href="/register"
            className="rounded-full bg-silo-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-silo-primary-strong"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 lg:px-8 lg:pb-20 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-7">
            <h1 className="text-[3.4rem] font-bold leading-[1.06] tracking-[-0.04em] sm:text-[4rem]">
              Inventory management for the{" "}
              <span className="text-silo-primary">modern curator.</span>
            </h1>
            <p className="max-w-xl text-lg leading-7 text-silo-muted">
              Centralize your stock, automate your reorders, and scale your business with the precision of Silo.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-silo-primary px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(0,84,64,0.55)] transition hover:bg-silo-primary-strong"
              >
                Start your free trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-silo-ink ring-1 ring-[#d4d1c7] transition hover:bg-silo-panel"
              >
                Book a demo
              </Link>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="overflow-hidden rounded-2xl bg-[#101c14] p-5 shadow-2xl shadow-silo-primary/20">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold text-white/90">Inventory Overview</p>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-400">
                Live
              </span>
            </div>
            <svg viewBox="0 0 300 90" className="mb-4 w-full">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#005440" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#005440" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,72 L30,58 L65,63 L100,42 L135,35 L170,45 L210,22 L250,28 L300,18 L300,90 L0,90Z"
                fill="url(#g)"
              />
              <path
                d="M0,72 L30,58 L65,63 L100,42 L135,35 L170,45 L210,22 L250,28 L300,18"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total SKUs", value: "2,847", change: "+12% this mo" },
                { label: "Stock Value", value: "$284K", change: "+8.3% this mo" },
              ].map(({ change, label, value }) => (
                <div key={label} className="rounded-xl bg-[#182d1e] p-4">
                  <p className="text-[0.65rem] text-[#6b9175]">{label}</p>
                  <p className="my-0.5 text-xl font-bold text-white">{value}</p>
                  <p className="text-[0.65rem] font-medium text-emerald-400">{change}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1.5">
              {["Linen Blazer – Sand  ·  42 units", "Canvas Tote – Khaki  ·  128 units"].map((row) => (
                <div key={row} className="flex items-center justify-between rounded-lg bg-[#182d1e] px-3 py-2">
                  <span className="text-xs text-[#c4dccf]">{row}</span>
                  <span className="text-[0.6rem] font-semibold text-emerald-400">In Stock</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ──────────────────────────────────────────────── */}
      <div className="border-y border-[#e4e3da]/60 bg-white py-7">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <p className="mb-5 text-center text-[0.63rem] font-semibold tracking-[0.22em] text-silo-muted uppercase">
            Trusted by modern retail leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {TRUSTED_BY.map((brand) => (
              <span key={brand} className="text-sm font-bold tracking-widest text-silo-ink">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features Bento ─────────────────────────────────────────── */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-12 space-y-3 text-center">
            <h2 className="text-[2.5rem] font-bold tracking-[-0.035em]">
              Everything you need to curate at scale
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-7 text-silo-muted">
              Silo combines operational power with editorial precision, designed for the unique demands of high-value inventory.
            </p>
          </div>

          {/* Bento grid — S-shaped spans: 1+2 / 2+1 / 1+2 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ cardBg, colSpan, description, icon: Icon, iconBg, iconColor, title }) => (
              <article
                key={title}
                className={`rounded-3xl p-6 ${cardBg} ${colSpan === 2 ? "lg:col-span-2" : ""}`}
              >
                <div
                  className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: iconBg }}
                >
                  <Icon className="h-5 w-5" style={{ color: iconColor }} />
                </div>
                <h3 className="mb-2 text-base font-semibold">{title}</h3>
                <p className="text-sm leading-6 text-silo-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section className="bg-[#0c2e1f] py-20 text-white">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-[2.5rem] font-bold tracking-[-0.035em]">
                  The path to inventory mastery
                </h2>
                <p className="text-base leading-7 text-[#9abfaf]">
                  Transition from spreadsheets to a system designed for growth in three simple steps.
                </p>
              </div>
              <div className="space-y-7">
                {STEPS.map(({ description, n, title }) => (
                  <div key={n} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-silo-primary text-sm font-bold">
                      {n}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{title}</h3>
                      <p className="text-sm leading-6 text-[#9abfaf]">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipment mockup */}
            <div className="rounded-2xl bg-[#1c4535] p-5 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[0.63rem] font-semibold tracking-[0.15em] text-[#7eb59b] uppercase">
                    Inbound Shipment
                  </p>
                  <p className="text-lg font-bold">#4092</p>
                </div>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-400">
                  Processing
                </span>
              </div>
              <div className="mb-3 space-y-2">
                {[
                  "10× Linen Blazer – Sand",
                  "24× Canvas Tote – Khaki",
                  "6× Leather Weekender",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-xl bg-[#14372a] px-4 py-3"
                  >
                    <span className="text-sm text-[#d4ede3]">{item}</span>
                    <span className="text-xs text-[#7eb59b]">Pending</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-silo-primary/40 px-4 py-3 text-sm font-medium text-[#a8dfc5]">
                <span className="text-lg">▣</span>
                Scan items to receive
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial ────────────────────────────────────────────── */}
      <section className="bg-silo-surface py-20">
        <div className="mx-auto max-w-2xl px-5 text-center lg:px-8">
          <p className="mb-5 text-[0.7rem] font-bold tracking-[0.22em] text-silo-primary uppercase">
            MODERNA
          </p>
          <blockquote className="mb-8 text-[1.45rem] font-medium leading-[1.45] tracking-[-0.02em] text-silo-ink">
            "Before Silo, we were managing $2M in inventory on a fragile spreadsheet. Now, our warehouse runs like a gallery. We've cut reorder lead times by 40% and haven't had an accidental stockout in six months."
          </blockquote>
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-silo-panel ring-2 ring-silo-panel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu-Uwr_yQ-VU4Gi3f_1noEyUclxc9pUYJp22WVFoNVPn7u1qItgfimbk9PypVSY2MZ88HNkzD2zHyqDZXNZfado0kRwhEl8k2MVf-dF-PoiO1SueICoAF57qNtcBsM5OHj4fjUMAbWxS8DwvXan0OgvaY4BiMF2ZNcKV_gW4cAJngJWde5fN-EZdAj4D13gUjdKDVrnx4M86-F15bcM8y9ZTZ-S6vWPZzyqf_c4pmPaY5dyg2SzcYCplTmJUYFuTm8ZCaGoZVM"
                alt="Marcus Thorne"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-silo-ink">Marcus Thorne</p>
              <p className="text-sm text-silo-muted">Director of Logistics, Moderna Living</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-silo-panel py-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-12 space-y-3 text-center">
            <h2 className="text-[2.5rem] font-bold tracking-[-0.035em]">Simple, curated pricing</h2>
            <p className="text-base text-silo-muted">Choose the plan that fits your current volume.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {PLANS.map(({ cta, features, name, period, popular, price }) => (
              <div
                key={name}
                className={`relative rounded-2xl p-6 ${
                  popular
                    ? "bg-silo-primary text-white shadow-xl shadow-silo-primary/30"
                    : "bg-white text-silo-ink"
                }`}
              >
                {popular && (
                  <div className="mb-4 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[0.63rem] font-bold tracking-[0.18em] text-white uppercase">
                    Popular
                  </div>
                )}
                <div className="mb-1 text-base font-semibold">{name}</div>
                <div className="mb-6 flex items-end gap-1">
                  <span className="text-[2.5rem] font-bold leading-none tracking-[-0.04em]">{price}</span>
                  {period && (
                    <span className={`mb-1 text-sm ${popular ? "text-white/70" : "text-silo-muted"}`}>
                      {period}
                    </span>
                  )}
                </div>
                <ul className="mb-6 space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${popular ? "text-white/80" : "text-silo-primary"}`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${
                    popular
                      ? "bg-white text-silo-primary hover:bg-silo-surface"
                      : "bg-silo-surface text-silo-ink ring-1 ring-[#d4d1c7] hover:bg-silo-panel"
                  }`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <h2 className="mb-10 text-center text-[2.5rem] font-bold tracking-[-0.035em]">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {FAQS.map(({ a, q }, i) => (
              <div key={i} className="rounded-xl bg-silo-surface">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-silo-ink"
                >
                  {q}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-silo-muted transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-5 text-sm leading-6 text-silo-muted">{a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="bg-[#0c2e1f] py-20 text-white">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="space-y-5">
              <h2 className="text-[2.5rem] font-bold tracking-[-0.035em]">
                Ready to master your inventory?
              </h2>
              <p className="max-w-xl text-base leading-7 text-[#9abfaf]">
                Join the new era of inventory management. Start your 14-day free trial today. No credit card required.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-silo-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-silo-primary-strong"
                >
                  Get Started for Free
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/10"
                >
                  Talk to Sales
                </Link>
              </div>
            </div>
            <Image
              src="/green-logo.png"
              alt=""
              width={120}
              height={120}
              className="hidden opacity-15 lg:block"
            />
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-silo-panel py-14">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div className="space-y-3">
              <SiloLogo variant="dark" iconClassName="h-6 w-6" labelClassName="text-xl text-silo-ink" />
              <p className="text-sm leading-6 text-silo-muted">
                The editorial inventory system for modern retail brands and curators.
              </p>
            </div>
            <div>
              <p className="mb-4 text-[0.68rem] font-bold tracking-[0.15em] text-silo-ink uppercase">Product</p>
              <ul className="space-y-2.5 text-sm text-silo-muted">
                {["Features", "Pricing", "Status"].map((l) => (
                  <li key={l}>
                    <a href="#" className="transition hover:text-silo-ink">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[0.68rem] font-bold tracking-[0.15em] text-silo-ink uppercase">Company</p>
              <ul className="space-y-2.5 text-sm text-silo-muted">
                {["About", "Contact", "Privacy Policy"].map((l) => (
                  <li key={l}>
                    <a href="#" className="transition hover:text-silo-ink">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[0.68rem] font-bold tracking-[0.15em] text-silo-ink uppercase">Connect</p>
              <ul className="space-y-2.5 text-sm text-silo-muted">
                {["Twitter", "LinkedIn"].map((l) => (
                  <li key={l}>
                    <a href="#" className="transition hover:text-silo-ink">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-[#d8d6cd] pt-6 text-xs text-silo-muted">
            © 2024 Silo Inventory Systems. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
