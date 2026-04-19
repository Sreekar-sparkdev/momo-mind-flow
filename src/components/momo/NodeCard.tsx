import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  badge?: { tone: "idle" | "active" | "processing" | "error" | "success" | "muted"; label: string; pulse?: boolean };
  icon?: ReactNode;
  active?: boolean;
  glow?: "data" | "ai" | "success" | null;
  children?: ReactNode;
  className?: string;
}

export function NodeCard({ title, subtitle, badge, icon, active, glow, children, className }: Props) {
  const glowClass = glow === "data" ? "glow-data" : glow === "ai" ? "glow-ai" : glow === "success" ? "glow-success" : "";
  return (
    <div
      className={cn(
        "relative rounded-xl border border-hairline bg-surface-1 p-4 transition-all duration-500",
        active && "border-primary/40",
        active && glowClass,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <div className="text-muted-foreground shrink-0">{icon}</div>}
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{title}</div>
            {subtitle && <div className="text-[11px] text-muted-foreground font-mono truncate">{subtitle}</div>}
          </div>
        </div>
        {badge && <StatusBadge tone={badge.tone} pulse={badge.pulse}>{badge.label}</StatusBadge>}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
