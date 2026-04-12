import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

import SiloLogo from "@/components/ui/silo-logo";

const platformHighlights = [
  {
    icon: CheckCircle2,
    title: "Real-time global sync",
    description: "Monitor stock across all warehouses instantly with zero latency.",
  },
  {
    icon: CheckCircle2,
    title: "Automated Logistics",
    description: "AI-driven route optimization and intelligent shipment tracking.",
  },
  {
    icon: CheckCircle2,
    title: "Predictive Analytics",
    description: "Anticipate demand surges before they happen with Silo Kinetic insights.",
  },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-white text-silo-ink">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden bg-[#187254] text-white lg:flex">
          <div className="flex h-full w-full flex-col justify-between px-9 py-10 xl:px-14 xl:py-10">
            <div className="flex items-center gap-3 text-white">
              <SiloLogo variant="white" className="gap-3" iconClassName="h-8 w-8" labelClassName="text-[2rem] leading-none tracking-[-0.03em] text-white" />
            </div>

            <div className="max-w-[30rem] space-y-12">
              <h1 className="max-w-[26rem] text-6xl leading-[0.94] font-semibold tracking-[-0.06em]">
                Welcome back.
                <br />
                Your inventory is waiting.
              </h1>

              <div className="space-y-8">
                {platformHighlights.map(({ description, icon: Icon, title }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#a7f0cf] text-[#187254]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-[1.65rem] font-semibold tracking-[-0.03em]">{title}</h2>
                      <p className="max-w-[23rem] text-base leading-6 text-white/82">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs font-medium tracking-[0.28em] text-white/62 uppercase">
              Silo Operational OS • V 2.4.0
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-20">
          <div className="w-full max-w-[21rem] sm:max-w-[24rem]">
            <div className="mb-10 flex items-center gap-3 text-silo-primary lg:hidden">
              <SiloLogo variant="green" className="gap-3" iconClassName="h-7 w-7" labelClassName="text-3xl text-silo-primary" />
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}