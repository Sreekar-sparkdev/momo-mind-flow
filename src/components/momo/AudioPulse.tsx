import { cn } from "@/lib/utils";

interface Props {
  active?: boolean;
  size?: number;
  className?: string;
}

export function AudioPulse({ active = false, size = 64, className }: Props) {
  return (
    <div className={cn("relative inline-flex", className)} style={{ width: size, height: size }}>
      {active && (
        <>
          <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping-soft" />
          <span className="absolute inset-2 rounded-full bg-accent/40 animate-ping-soft" style={{ animationDelay: "0.3s" }} />
        </>
      )}
      <span
        className={cn(
          "relative m-auto rounded-full transition-all duration-300",
          active ? "bg-accent glow-ai" : "bg-surface-2"
        )}
        style={{ width: size * 0.5, height: size * 0.5, margin: "auto" }}
      />
    </div>
  );
}
