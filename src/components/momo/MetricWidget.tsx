import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number; // -100..100
  accent?: "data" | "ai" | "success" | "default";
  spark?: number[];
  className?: string;
}

const accents = {
  data: "text-primary",
  ai: "text-accent",
  success: "text-success",
  default: "text-foreground",
};

export function MetricWidget({ label, value, unit, trend, accent = "default", spark, className }: Props) {
  return (
    <div className={cn("rounded-xl border border-hairline bg-surface-1 p-4", className)}>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <div className={cn("text-2xl font-semibold tabular-nums", accents[accent])}>{value}</div>
        {unit && <div className="text-xs text-muted-foreground">{unit}</div>}
        {trend !== undefined && (
          <div className={cn("ml-auto text-[11px] font-mono", trend >= 0 ? "text-success" : "text-destructive")}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      {spark && spark.length > 1 && (
        <svg viewBox={`0 0 ${spark.length - 1} 20`} className="mt-2 h-6 w-full" preserveAspectRatio="none">
          <polyline
            points={spark.map((v, i) => `${i},${20 - (v / 100) * 18}`).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            className={accents[accent]}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
    </div>
  );
}
