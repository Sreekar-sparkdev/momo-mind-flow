import { ArchitectureView } from "@/components/momo/ArchitectureView";
import { LiveLogs } from "@/components/momo/LiveLogs";
import { MetricWidget } from "@/components/momo/MetricWidget";
import { NodeCard } from "@/components/momo/NodeCard";
import { StatusBadge } from "@/components/momo/StatusBadge";
import { useStage } from "@/lib/simulation";
import { Cpu, MonitorSmartphone, Activity, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { stage, time } = useStage();
  const [tick, setTick] = useState(0);
  useEffect(() => { const i = setInterval(() => setTick(t => t+1), 1000); return () => clearInterval(i); }, []);

  // Derived live metrics
  const cpu = 18 + Math.round(Math.sin(time * 0.7) * 6) + (stage === "brain" || stage === "execution" ? 38 : 0);
  const latency = stage === "stt" ? 118 : stage === "brain" ? 642 : stage === "execution" ? 1420 : 84;
  const tps = stage === "tts" ? 24 : stage === "brain" ? 38 : 0;
  const sessions = 1;

  const sparkCpu = Array.from({ length: 24 }, (_, i) => 18 + Math.sin((tick + i) * 0.5) * 12 + Math.random() * 6);
  const sparkLat = Array.from({ length: 24 }, (_, i) => 30 + Math.sin((tick + i) * 0.3) * 20 + Math.random() * 8);

  const nodeAOnline = stage !== "boot";
  const nodeBOnline = stage !== "boot";

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Overview</div>
          <h1 className="text-[32px] font-semibold tracking-tight leading-none mt-1">System Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            Real-time view of the MOMO distributed AI assistant. Edge device, intelligence layer, and control plane in one screen.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge tone={nodeAOnline && nodeBOnline ? "success" : "error"} pulse>
            {nodeAOnline && nodeBOnline ? "All Systems Operational" : "System Offline"}
          </StatusBadge>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricWidget label="CPU · Node A" value={Math.min(99, cpu)} unit="%" accent="data" spark={sparkCpu} trend={2.4} />
        <MetricWidget label="Round-trip latency" value={latency} unit="ms" accent={latency > 800 ? "ai" : "success"} spark={sparkLat} trend={-3.1} />
        <MetricWidget label="Tokens / sec" value={tps.toFixed(1)} accent="ai" trend={5.7} />
        <MetricWidget label="Active sessions" value={sessions} accent="default" />
      </div>

      {/* Nodes status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <NodeCard
          title="Node B · MOMO-01"
          subtitle="ESP32 · 192.168.1.42"
          icon={<MonitorSmartphone size={16} />}
          badge={{ tone: nodeBOnline ? "success" : "error", label: nodeBOnline ? "Online" : "Offline", pulse: true }}
        >
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-muted-foreground">
            <Mini label="uptime" value="14h 02m" />
            <Mini label="rssi" value="-48 dBm" />
            <Mini label="batt" value="88%" />
          </div>
        </NodeCard>
        <NodeCard
          title="Node A · Brain"
          subtitle="llama-3.1-8b · piper · whisper"
          icon={<Cpu size={16} />}
          badge={{ tone: nodeAOnline ? "success" : "error", label: nodeAOnline ? "Ready" : "Offline", pulse: true }}
        >
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-muted-foreground">
            <Mini label="vram" value="6.2 GB" />
            <Mini label="ctx" value="4096" />
            <Mini label="model" value="ok" />
          </div>
        </NodeCard>
        <NodeCard
          title="Node C · Momodash"
          subtitle="control + experience"
          icon={<Activity size={16} />}
          badge={{ tone: "success", label: "Live", pulse: true }}
        >
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-muted-foreground">
            <Mini label="ws" value="1" />
            <Mini label="mode" value="agentic" />
            <Mini label="errs" value="0" />
          </div>
        </NodeCard>
      </div>

      {/* Architecture + Logs */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <ArchitectureView />
        </div>
        <div className="rounded-2xl border border-hairline bg-surface-1 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Live Stream</div>
              <div className="text-sm font-medium flex items-center gap-2">
                <Zap size={14} className="text-primary" /> System logs
              </div>
            </div>
            <StatusBadge tone="active" pulse>streaming</StatusBadge>
          </div>
          <LiveLogs className="flex-1 min-h-[420px] max-h-[520px]" />
        </div>
      </div>
    </div>
  );
};

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground/70">{label}</div>
      <div className="text-foreground">{value}</div>
    </div>
  );
}

export default Dashboard;
