import Link from "next/link";
import { ArrowRight, Boxes, ChartNoAxesCombined, ShieldCheck, Warehouse } from "lucide-react";

import SiloLogo from "@/components/ui/silo-logo";

const highlights = [
  {
    icon: Boxes,
    title: "Centralized stock control",
    description: "Track inventory across stores and warehouses without juggling spreadsheets.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Operational visibility",
    description: "Review movements, low-stock risks, and value trends from one workspace.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description: "Keep every adjustment traceable with secure auth and organization-aware permissions.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-silo-surface px-6 py-10 text-silo-ink sm:px-10 lg:px-16 lg:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="flex items-center justify-between gap-4">
          <SiloLogo variant="green" iconClassName="h-7 w-7" labelClassName="text-3xl text-silo-primary" />
          <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-silo-primary shadow-sm ring-1 ring-(--silo-outline) transition hover:bg-silo-panel">
            Log in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-[0.16em] text-silo-muted uppercase ring-1 ring-(--silo-outline)">
              <Warehouse className="h-3.5 w-3.5 text-silo-primary" />
              Inventory command center
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Inventory management built for retail teams and warehouse floors.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-silo-muted sm:text-lg">
                Silo centralizes products, stock movements, suppliers, and low-stock decisions in a single operational workspace.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--silo-primary)_0%,var(--silo-primary-strong)_100%)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_-24px_rgba(0,84,64,0.65)] transition hover:brightness-105">
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-silo-ink ring-1 ring-(--silo-outline) transition hover:bg-silo-panel">
                View dashboard shell
                <ChartNoAxesCombined className="h-4 w-4 text-silo-primary" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-(--silo-outline) sm:p-6">
            {highlights.map(({ description, icon: Icon, title }) => (
              <article key={title} className="rounded-3xl bg-silo-panel p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-silo-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold tracking-[-0.03em]">{title}</h2>
                    <p className="text-sm leading-6 text-silo-muted">{description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
