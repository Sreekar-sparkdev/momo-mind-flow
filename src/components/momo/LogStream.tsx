import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export interface LogEntry {
  t: string; // "12:01:22"
  level: "info" | "data" | "ai" | "success" | "error";
  source: string; // "Node B" | "STT" | ...
  message: string;
}

interface Props {
  entries: LogEntry[];
  className?: string;
  autoscroll?: boolean;
}

const levelColor = {
  info: "text-muted-foreground",
  data: "text-primary",
  ai: "text-accent",
  success: "text-success",
  error: "text-destructive",
};

export function LogStream({ entries, className, autoscroll = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (autoscroll && ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [entries, autoscroll]);

  return (
    <div
      ref={ref}
      className={cn(
        "font-mono text-[11.5px] leading-relaxed bg-background/60 rounded-lg border border-hairline p-3 overflow-auto",
        className
      )}
    >
      {entries.length === 0 ? (
        <div className="text-muted-foreground/60">// awaiting events…</div>
      ) : (
        entries.map((e, i) => (
          <div key={i} className="flex gap-2 animate-fade-in">
            <span className="text-muted-foreground/70 shrink-0">[{e.t}]</span>
            <span className="text-muted-foreground/90 shrink-0 w-20 truncate">{e.source}</span>
            <span className={cn("flex-1", levelColor[e.level])}>{e.message}</span>
          </div>
        ))
      )}
    </div>
  );
}
