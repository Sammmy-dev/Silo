import { ArrowRightLeft, Boxes, TriangleAlert, WalletCards } from "lucide-react";

import SiloLogo from "@/components/ui/silo-logo";

const stats = [
  {
    icon: Boxes,
    label: "Products tracked",
    value: "0",
    description: "Start by importing SKUs or creating your first product manually.",
  },
  {
    icon: ArrowRightLeft,
    label: "Recent movements",
    value: "0",
    description: "Every stock-in, stock-out, and adjustment will appear here.",
  },
  {
    icon: TriangleAlert,
    label: "Low stock alerts",
    value: "0",
    description: "Reorder warnings will surface once thresholds are configured.",
  },
  {
    icon: WalletCards,
    label: "Inventory value",
    value: "$0.00",
    description: "Valuation cards populate as soon as costed stock is recorded.",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-silo-surface px-6 py-10 text-silo-ink">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-(--silo-outline)">
          <SiloLogo variant="green" iconClassName="h-7 w-7" labelClassName="text-3xl text-silo-primary" />
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em]">Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-silo-muted">
            Authentication is wired and this protected route is ready for the inventory workspace UI. These starter cards now use lucide icons consistently with the rest of the app.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ description, icon: Icon, label, value }) => (
            <article key={label} className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-(--silo-outline)">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-silo-panel text-silo-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-xs font-semibold tracking-[0.16em] text-silo-muted uppercase">{label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{value}</p>
              <p className="mt-3 text-sm leading-6 text-silo-muted">{description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}