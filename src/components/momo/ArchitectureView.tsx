import { useStage, type SystemStage } from "@/lib/simulation";
import { NodeCard } from "./NodeCard";
import { PipelineBlock } from "./PipelineBlock";
import { StatusBadge } from "./StatusBadge";
import { Waveform } from "./Waveform";
import { AudioPulse } from "./AudioPulse";
import { Mic, Cpu, Volume2, MonitorSmartphone, MessageSquare, Activity, Database, Shield, Network, Eye, GitBranch } from "lucide-react";

// Helpers — derive UI state from simulation stage
const STAGE_ORDER: SystemStage[] = [
  "boot", "idle", "listening", "streaming", "stt", "intent", "brain", "orchestrator", "execution", "tts", "speaking", "return"
];
const idx = (s: SystemStage) => STAGE_ORDER.indexOf(s);

function pipeState(stage: SystemStage, target: SystemStage): "idle" | "active" | "done" {
  const a = idx(stage), b = idx(target);
  if (a < b) return "idle";
  if (a === b) return "active";
  return "done";
}

export function ArchitectureView() {
  const { stage } = useStage();
  const audioFlow = stage === "streaming" || stage === "stt";
  const responseFlow = stage === "tts" || stage === "speaking";
  const controlFlow = stage === "idle" || stage === "return";

  // Node B states
  const nodeB =
    stage === "listening" ? { tone: "active" as const, label: "Listening", pulse: true } :
    stage === "streaming" ? { tone: "active" as const, label: "Streaming", pulse: true } :
    stage === "speaking" ? { tone: "processing" as const, label: "Speaking", pulse: true } :
    { tone: "idle" as const, label: "Idle" };

  // Node C
  const nodeC =
    controlFlow ? { tone: "active" as const, label: "Live", pulse: true } :
    { tone: "idle" as const, label: "Monitoring" };

  return (
    <div className="relative rounded-2xl border border-hairline bg-surface-1/40 bg-grid bg-radial-fade overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-hairline backdrop-blur-sm">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">System Architecture</div>
          <div className="text-base font-medium">MOMO · Distributed Offline AI</div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] font-mono">
          <Legend color="bg-primary" label="Audio / Data" />
          <Legend color="bg-accent" label="AI Pipeline" />
          <Legend color="bg-success" label="Control Loop" />
        </div>
      </div>

      {/* SVG flow lines */}
      <div className="relative px-6 py-8">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          {/* B → A audio */}
          <line x1="22%" y1="50%" x2="42%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="1.2"
            className={audioFlow ? "flow-line opacity-90" : "opacity-25"} />
          {/* A → B response */}
          <line x1="42%" y1="56%" x2="22%" y2="56%" stroke="hsl(var(--accent))" strokeWidth="1.2"
            className={responseFlow ? "flow-line opacity-90" : "opacity-20"} />
          {/* A ↔ C control */}
          <line x1="58%" y1="50%" x2="78%" y2="50%" stroke="hsl(var(--success))" strokeWidth="1.2"
            className={controlFlow ? "flow-line opacity-90" : "opacity-30"} />
          <line x1="58%" y1="56%" x2="78%" y2="56%" stroke="hsl(var(--success))" strokeWidth="1.2"
            className={controlFlow ? "flow-line opacity-70" : "opacity-15"} />
        </svg>

        <div className="grid grid-cols-12 gap-6 relative">
          {/* NODE B */}
          <div className="col-span-12 lg:col-span-3 space-y-3">
            <SectionLabel>Node B · Edge Device</SectionLabel>
            <NodeCard
              title="ESP32 · MOMO-01"
              subtitle="192.168.1.42 · firmware 0.4.2"
              icon={<MonitorSmartphone size={16} />}
              badge={nodeB}
              active={nodeB.tone === "active" || nodeB.tone === "processing"}
              glow={audioFlow ? "data" : responseFlow ? "ai" : null}
            >
              <div className="space-y-2.5">
                <Row icon={<Mic size={13} />} label="Dual mic input">
                  <Waveform active={stage === "listening" || stage === "streaming"} bars={18} className="h-6" />
                </Row>
                <Row icon={<Activity size={13} />} label="Audio buffer">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {stage === "streaming" ? "12.4 KB/s" : stage === "listening" ? "armed" : "—"}
                  </span>
                </Row>
                <Row icon={<Volume2 size={13} />} label="Speaker">
                  <AudioPulse active={stage === "speaking"} size={20} />
                </Row>
                <div className="rounded-md border border-hairline bg-background/50 p-2 mt-2">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground/70 mb-1">OLED</div>
                  <div className="font-mono text-[11px] text-primary leading-tight">
                    {stage === "boot" && "MOMO · booting"}
                    {(stage === "idle" || stage === "return") && "ready"}
                    {stage === "listening" && "● listening"}
                    {stage === "streaming" && "→ streaming"}
                    {(stage === "stt" || stage === "intent" || stage === "brain" || stage === "orchestrator" || stage === "execution") && "thinking…"}
                    {stage === "tts" && "← incoming"}
                    {stage === "speaking" && "♫ speaking"}
                  </div>
                </div>
              </div>
            </NodeCard>
          </div>

          {/* NODE A */}
          <div className="col-span-12 lg:col-span-6 space-y-3">
            <SectionLabel>Node A · Brain</SectionLabel>
            <div className="rounded-xl border border-hairline bg-surface-1 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-accent" />
                  <span className="text-sm font-medium">Intelligence Pipeline</span>
                </div>
                <StatusBadge tone={idx(stage) >= idx("stt") && idx(stage) <= idx("execution") ? "processing" : "idle"} pulse={idx(stage) >= idx("stt") && idx(stage) <= idx("execution")}>
                  {idx(stage) >= idx("stt") && idx(stage) <= idx("execution") ? "Processing" : "Standby"}
                </StatusBadge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <PipelineBlock label="Audio Receiver" meta="WebSocket" state={pipeState(stage, "streaming") === "active" ? "active" : pipeState(stage, "streaming") === "done" ? "done" : "idle"} icon={<Network size={13} />} />
                <PipelineBlock label="STT · Whisper" meta="base.en" state={pipeState(stage, "stt")} />
                <PipelineBlock label="Intent" meta="classifier" state={pipeState(stage, "intent")} />
                <PipelineBlock label="Brain" meta="llama-3.1-8b" state={pipeState(stage, "brain")} />
                <PipelineBlock label="Orchestrator" meta="task router" state={pipeState(stage, "orchestrator")} icon={<GitBranch size={13} />} />
                <PipelineBlock label="Execution" meta="tools · skills" state={pipeState(stage, "execution")} />
                <PipelineBlock label="TTS" meta="piper · en_US" state={pipeState(stage, "tts")} className="sm:col-span-3" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-hairline">
                <SubSystem icon={<Database size={13} />} label="Memory" hint="142 ctx" />
                <SubSystem icon={<Shield size={13} />} label="Security" hint="JWT · audit" />
                <SubSystem icon={<Network size={13} />} label="API" hint="REST + WS" />
                <SubSystem icon={<Eye size={13} />} label="Monitor" hint="logs · metrics" />
              </div>
            </div>
          </div>

          {/* NODE C */}
          <div className="col-span-12 lg:col-span-3 space-y-3">
            <SectionLabel>Node C · Control</SectionLabel>
            <NodeCard
              title="Momodash"
              subtitle="control + experience"
              icon={<MessageSquare size={16} />}
              badge={nodeC}
              active={nodeC.tone === "active"}
              glow={controlFlow ? "success" : null}
            >
              <div className="space-y-1.5">
                <SubRow label="Control Engine" hint="dispatcher" active={controlFlow} />
                <SubRow label="Interaction Layer" hint="chat · voice" active={stage === "speaking" || stage === "return"} />
                <SubRow label="Visualization" hint="logs · pipeline" active={idx(stage) >= idx("stt")} />
                <SubRow label="Session Manager" hint="context · tasks" />
                <SubRow label="Feedback Layer" hint="learning loop" />
              </div>
              <div className="mt-3 pt-3 border-t border-hairline flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Mode</span>
                <span className="text-[11px] font-mono text-primary">Agentic</span>
              </div>
            </NodeCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <span className={`h-1.5 w-4 rounded-full ${color}`} />
      {label}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 px-1">{children}</div>;
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function SubSystem({ icon, label, hint }: { icon: React.ReactNode; label: string; hint: string }) {
  return (
    <div className="rounded-md border border-hairline bg-background/40 px-2.5 py-1.5">
      <div className="flex items-center gap-1.5 text-[11px] text-foreground">
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </div>
      <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{hint}</div>
    </div>
  );
}

function SubRow({ label, hint, active }: { label: string; hint: string; active?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[11.5px]">
      <span className="flex items-center gap-1.5">
        <span className={`h-1 w-1 rounded-full ${active ? "bg-success animate-pulse" : "bg-muted-foreground/40"}`} />
        <span className={active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
      </span>
      <span className="font-mono text-[10px] text-muted-foreground/70">{hint}</span>
    </div>
  );
}
