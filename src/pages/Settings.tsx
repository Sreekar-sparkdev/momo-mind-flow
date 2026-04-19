import { useState } from "react";
import { cn } from "@/lib/utils";

const models = [
  { id: "llama-3.1-8b", name: "Llama 3.1 · 8B", size: "4.6 GB", role: "Brain", default: true },
  { id: "qwen-2.5-7b", name: "Qwen 2.5 · 7B", size: "4.1 GB", role: "Brain" },
  { id: "whisper-base", name: "Whisper base.en", size: "142 MB", role: "STT", default: true },
  { id: "piper-en-amy", name: "Piper · en_US/amy", size: "62 MB", role: "TTS", default: true },
];

const Settings = () => {
  const [agentic, setAgentic] = useState(true);
  const [wake, setWake] = useState(true);
  const [telemetry, setTelemetry] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Configuration</div>
        <h1 className="text-[32px] font-semibold tracking-tight leading-none mt-1">Settings</h1>
        <p className="text-sm text-muted-foreground mt-2">Models, behavior, and system preferences</p>
      </div>

      <Section title="Models">
        <div className="rounded-2xl border border-hairline bg-surface-1 divide-y divide-hairline">
          {models.map((m) => (
            <div key={m.id} className="grid grid-cols-[1fr_120px_120px_auto] gap-3 items-center px-5 py-3.5">
              <div>
                <div className="text-sm font-medium">{m.name}</div>
                <div className="text-[11px] font-mono text-muted-foreground">{m.id}</div>
              </div>
              <div className="text-[12px] text-muted-foreground">{m.role}</div>
              <div className="font-mono text-[12px] text-muted-foreground">{m.size}</div>
              <button className={cn(
                "h-7 px-2.5 rounded-md text-[11px] uppercase tracking-wide border",
                m.default ? "border-primary/40 bg-primary/15 text-primary" : "border-hairline bg-surface-2 text-muted-foreground hover:text-foreground"
              )}>
                {m.default ? "Active" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Behavior">
        <div className="rounded-2xl border border-hairline bg-surface-1 divide-y divide-hairline">
          <Toggle label="Agentic mode" hint="Allow MOMO to execute multi-step plans without confirmation" v={agentic} on={() => setAgentic(!agentic)} />
          <Toggle label="Wake word" hint="Listen for 'hey momo' on Node B devices" v={wake} on={() => setWake(!wake)} />
          <Toggle label="Anonymous telemetry" hint="Share crash + latency metrics with the project (off by default)" v={telemetry} on={() => setTelemetry(!telemetry)} />
        </div>
      </Section>

      <Section title="System">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <KV label="Brain endpoint" value="ws://192.168.1.10:7331" />
          <KV label="Audio sample rate" value="16000 Hz" />
          <KV label="Context window" value="4096 tokens" />
          <KV label="Log retention" value="30 days · local" />
        </div>
      </Section>
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-[15px] font-medium">{title}</h2>
      {children}
    </div>
  );
}
function Toggle({ label, hint, v, on }: { label: string; hint: string; v: boolean; on: () => void }) {
  return (
    <button onClick={on} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-2/40 transition">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[12px] text-muted-foreground mt-0.5">{hint}</div>
      </div>
      <span className={cn("relative h-5 w-9 rounded-full transition", v ? "bg-primary" : "bg-surface-2 border border-hairline")}>
        <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-all", v ? "left-[18px]" : "left-0.5")} />
      </span>
    </button>
  );
}
function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-1 px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono text-[13px] mt-1">{value}</div>
    </div>
  );
}

export default Settings;
