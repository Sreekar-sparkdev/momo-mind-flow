import { ArchitectureView } from "@/components/momo/ArchitectureView";
import { LiveLogs } from "@/components/momo/LiveLogs";

const Architecture = () => (
  <div className="space-y-6">
    <div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">System Map</div>
      <h1 className="text-[32px] font-semibold tracking-tight leading-none mt-1">Architecture</h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
        Three-node distributed system. Edge device captures audio, Brain reasons and executes,
        Control plane orchestrates and visualizes. Scrub the timeline to watch data, control, and audio loops light up.
      </p>
    </div>
    <ArchitectureView />
    <div className="rounded-2xl border border-hairline bg-surface-1 p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Bus events</div>
      <LiveLogs className="max-h-[300px]" />
    </div>
  </div>
);
export default Architecture;
