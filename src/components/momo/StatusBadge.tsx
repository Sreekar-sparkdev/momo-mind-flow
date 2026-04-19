import { cn } from "@/lib/utils";

type Tone = "idle" | "active" | "processing" | "error" | "success" | "muted";

const tones: Record<Tone, string> = {
  idle: "bg-surface-2 text-muted-foreground border-hairline",
  active: "bg-primary/15 text-primary border-primary/40",
  processing: "bg-accent/15 text-accent border-accent/40",
  error: "bg-destructive/15 text-destructive border-destructive/40",
  success: "bg-success/15 text-success border-success/40",
  muted: "bg-surface-1 text-muted-foreground border-hairline",
};

const dotTones: Record<Tone, string> = {
  idle: "bg-muted-foreground",
  active: "bg-primary",
  processing: "bg-accent",
  error: "bg-destructive",
  success: "bg-success",
  muted: "bg-muted-foreground/50",
};

interface Props {
  tone?: Tone;
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ tone = "idle", pulse, children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase",
        tones[tone],
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse && (
          <span
            className={cn(
              "absolute inset-0 rounded-full animate-ping-soft",
              dotTones[tone]
            )}
          />
        )}
        <span className={cn("relative h-1.5 w-1.5 rounded-full", dotTones[tone])} />
      </span>
      {children}
    </span>
  );
}
