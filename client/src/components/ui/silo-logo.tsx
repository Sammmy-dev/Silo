import Image from "next/image";

import { cn } from "@/lib/utils";

const LOGO_SRCS = {
  white: "/white-logo.png",
  dark: "/black-logo.png",
  green: "/green-logo.png",
} as const;

type SiloLogoProps = {
  variant?: keyof typeof LOGO_SRCS;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
};

export default function SiloLogo({ variant = "green", className, iconClassName, labelClassName }: SiloLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src={LOGO_SRCS[variant]}
        alt="Silo logo"
        width={28}
        height={28}
        className={cn("h-7 w-7 object-contain", iconClassName)}
      />
      <span className={cn("text-3xl font-semibold tracking-[-0.04em]", labelClassName)}>Silo</span>
    </div>
  );
}