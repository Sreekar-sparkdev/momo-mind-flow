import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  label: string;
  state?: "idle" | "active" | "done" | "error";
  icon?: ReactNode;
  meta?: string;
  className?: string;
}

const stateStyles = {
  idle: "border-hairline bg-surface-1 text-muted-foreground",
  active: "border-accent/50 bg-accent/10 text-accent glow-ai",
  done: "border-success/40 bg-success/5 text-foreground",
  error: "border-destructive/50 bg-destructive/10 text-destructive",
};

export function PipelineBlock({ label, state = "idle", icon, meta, className }: Props) {
  return (
    <div
      className={cn(
        "relative rounded-lg border px-3 py-2.5 min-w-[120px] transition-all duration-500",
        stateStyles[state],
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="min-w-0">
          <div className="text-[12px] font-medium leading-tight truncate">{label}</div>
          {meta && <div className="text-[10px] font-mono opacity-70 truncate">{meta}</div>}
        </div>
      </div>
      {state === "active" && (
        <div className="absolute inset-x-2 bottom-1 h-[2px] overflow-hidden rounded">
          <div className="scan-bar h-full w-full" />
        </div>
      )}
    </div>
  );
}
