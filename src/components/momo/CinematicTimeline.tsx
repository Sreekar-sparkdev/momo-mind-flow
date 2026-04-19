import { Play, Pause, RotateCcw } from "lucide-react";
import { player, usePlayer, TIMELINE, TOTAL, stageAt } from "@/lib/simulation";
import { cn } from "@/lib/utils";

export function CinematicTimeline() {
  const { time, playing } = usePlayer();
  const stage = stageAt(time);
  const current = TIMELINE.slice().reverse().find((m) => time >= m.t)!;
  const pct = (time / TOTAL) * 100;

  return (
    <div className="rounded-2xl border border-hairline bg-surface-1 p-4">
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => player.toggle()}
          className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition glow-data"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
        </button>
        <button
          onClick={() => player.reset()}
          className="h-9 w-9 rounded-full bg-surface-2 text-muted-foreground flex items-center justify-center hover:text-foreground transition"
          aria-label="Reset"
        >
          <RotateCcw size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Stage</div>
          <div className="text-sm font-medium truncate">{current.label}</div>
        </div>
        <div className="font-mono text-xs text-muted-foreground tabular-nums">
          {time.toFixed(1)}s / {TOTAL}s
        </div>
      </div>

      {/* Scrubber */}
      <div className="relative">
        <input
          type="range"
          min={0}
          max={TOTAL * 100}
          value={time * 100}
          onChange={(e) => player.seek(parseInt(e.target.value) / 100)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label="Timeline scrubber"
        />
        <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-75"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Markers */}
        <div className="relative h-6 mt-1">
          {TIMELINE.map((m) => (
            <div
              key={m.t}
              className="absolute -translate-x-1/2"
              style={{ left: `${(m.t / TOTAL) * 100}%` }}
              title={m.label}
            >
              <div
                className={cn(
                  "h-1.5 w-px mx-auto",
                  time >= m.t ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
              <div
                className={cn(
                  "text-[9px] font-mono mt-0.5",
                  time >= m.t ? "text-foreground/80" : "text-muted-foreground/50"
                )}
              >
                {m.t}s
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {TIMELINE.map((m) => {
          const isCurrent = m.stage === stage;
          const isPast = time > m.t;
          return (
            <button
              key={m.t}
              onClick={() => player.seek(m.t)}
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wide transition",
                isCurrent
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : isPast
                  ? "bg-surface-2 text-muted-foreground"
                  : "bg-background/40 text-muted-foreground/40 border border-transparent"
              )}
            >
              {m.stage}
            </button>
          );
        })}
      </div>
    </div>
  );
}
