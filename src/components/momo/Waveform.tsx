import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Props {
  active?: boolean;
  bars?: number;
  className?: string;
  color?: "data" | "ai";
}

export function Waveform({ active = false, bars = 40, className, color = "data" }: Props) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const i = setInterval(() => setTick((t) => t + 1), 90);
    return () => clearInterval(i);
  }, [active]);

  const colorClass = color === "data" ? "bg-primary" : "bg-accent";

  return (
    <div className={cn("flex items-center gap-[3px] h-12", className)}>
      {Array.from({ length: bars }).map((_, i) => {
        const seed = Math.sin(i * 1.7 + tick * 0.6) * 0.5 + 0.5;
        const height = active ? 8 + seed * 36 : 4 + Math.sin(i * 0.6) * 2 + 2;
        return (
          <div
            key={i}
            className={cn("w-[3px] rounded-full transition-all duration-150", active ? colorClass : "bg-muted")}
            style={{ height: `${height}px`, opacity: active ? 0.5 + seed * 0.5 : 0.4 }}
          />
        );
      })}
    </div>
  );
}
