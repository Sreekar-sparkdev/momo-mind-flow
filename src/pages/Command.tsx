import { AudioPulse } from "@/components/momo/AudioPulse";
import { Waveform } from "@/components/momo/Waveform";
import { StatusBadge } from "@/components/momo/StatusBadge";
import { PipelineBlock } from "@/components/momo/PipelineBlock";
import { useStage, type SystemStage } from "@/lib/simulation";
import { Mic, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Msg { role: "user" | "assistant" | "system"; text: string; meta?: string; stage?: SystemStage; }

const ORDER: SystemStage[] = ["boot","idle","listening","streaming","stt","intent","brain","orchestrator","execution","tts","speaking","return"];

const SCRIPT: Msg[] = [
  { role: "system", text: "Session #a31f · Agentic mode · Node B paired" },
  { role: "user", text: "open the project notes from yesterday", meta: "voice · 12:01:24", stage: "stt" },
  { role: "assistant", text: "Understood — searching memory for yesterday's project notes.", stage: "intent" },
  { role: "assistant", text: "Found notes/2025-01-14_project.md (1.2 KB). Opening and summarizing.", stage: "execution" },
  { role: "assistant", text: "Here's the gist: three open threads — auth refactor, edge buffer tuning, OLED font swap. Which would you like to dive into?", stage: "speaking" },
];

const Command = () => {
  const { stage } = useStage();
  const idx = ORDER.indexOf(stage);
  const visible = SCRIPT.filter((m) => !m.stage || ORDER.indexOf(m.stage) <= idx);
  const speaking = stage === "speaking";
  const listening = stage === "listening" || stage === "streaming";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Interaction</div>
          <h1 className="text-[32px] font-semibold tracking-tight leading-none mt-1">Command Interface</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <StatusBadge tone={listening ? "active" : speaking ? "processing" : "idle"} pulse={listening || speaking}>
            {listening ? "Listening" : speaking ? "Responding" : "Ready"}
          </StatusBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chat */}
        <div className="lg:col-span-2 rounded-2xl border border-hairline bg-surface-1 flex flex-col min-h-[520px]">
          <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
            <div className="text-sm font-medium">Conversation</div>
            <div className="text-[11px] font-mono text-muted-foreground">session#a31f</div>
          </div>
          <div className="flex-1 overflow-auto px-5 py-4 space-y-3">
            {visible.map((m, i) => <Bubble key={i} msg={m} />)}
            {(stage === "brain" || stage === "orchestrator") && <Typing />}
          </div>
          {/* Composer */}
          <div className="border-t border-hairline p-3 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-lg border border-hairline bg-background/60 px-3 h-11">
              <Waveform active={listening} bars={28} className="h-7 w-32" />
              <input
                placeholder={listening ? "listening…" : "ask MOMO anything"}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                readOnly
              />
            </div>
            <button className={cn("h-11 w-11 rounded-lg flex items-center justify-center transition", listening ? "bg-primary text-primary-foreground glow-data" : "bg-surface-2 text-muted-foreground hover:text-foreground")}>
              <Mic size={16} />
            </button>
            <button className="h-11 w-11 rounded-lg bg-surface-2 text-muted-foreground hover:text-foreground flex items-center justify-center">
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-hairline bg-surface-1 p-5 flex flex-col items-center text-center">
            <AudioPulse active={listening || speaking} size={128} />
            <div className="mt-4 text-sm font-medium">{listening ? "Listening on Node B" : speaking ? "Speaking via Node B" : "Idle"}</div>
            <div className="text-[11px] font-mono text-muted-foreground mt-1">
              {listening ? "16 kHz · pcm16" : speaking ? "piper · 22050 Hz" : "tap mic to begin"}
            </div>
          </div>
          <div className="rounded-2xl border border-hairline bg-surface-1 p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Pipeline</div>
            <div className="space-y-1.5">
              {[
                ["STT","stt"],["Intent","intent"],["Brain","brain"],["Orchestrator","orchestrator"],["Execution","execution"],["TTS","tts"],
              ].map(([l, s]) => (
                <PipelineBlock
                  key={s}
                  label={l}
                  state={idx < ORDER.indexOf(s as SystemStage) ? "idle" : idx === ORDER.indexOf(s as SystemStage) ? "active" : "done"}
                  className="w-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Bubble({ msg }: { msg: Msg }) {
  if (msg.role === "system") {
    return <div className="text-[11px] font-mono text-muted-foreground/80 text-center py-1">{msg.text}</div>;
  }
  const user = msg.role === "user";
  return (
    <div className={cn("flex", user ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[78%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed animate-fade-in",
        user ? "bg-primary/15 border border-primary/30 text-foreground rounded-br-sm" : "bg-surface-2 border border-hairline rounded-bl-sm"
      )}>
        <div>{msg.text}</div>
        {msg.meta && <div className="text-[10px] font-mono text-muted-foreground mt-1">{msg.meta}</div>}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-sm bg-surface-2 border border-hairline px-4 py-3 flex items-center gap-1.5">
        {[0,1,2].map(i => <span key={i} className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: `${i*150}ms` }} />)}
      </div>
    </div>
  );
}

function ModeToggle() {
  return (
    <div className="inline-flex rounded-lg border border-hairline bg-surface-1 p-0.5 text-[12px]">
      <span className="px-2.5 py-1 rounded-md bg-primary/15 text-primary">Agentic</span>
      <span className="px-2.5 py-1 text-muted-foreground">Assist</span>
    </div>
  );
}

export default Command;
