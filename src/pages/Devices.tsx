import { NodeCard } from "@/components/momo/NodeCard";
import { Waveform } from "@/components/momo/Waveform";
import { useStage } from "@/lib/simulation";
import { MonitorSmartphone, Wifi, RotateCw, MicOff } from "lucide-react";

const devices = [
  { id: "MOMO-01", ip: "192.168.1.42", room: "Studio", batt: 88, rssi: -48, fw: "0.4.2", primary: true },
  { id: "MOMO-02", ip: "192.168.1.51", room: "Kitchen", batt: 72, rssi: -61, fw: "0.4.2", primary: false },
  { id: "MOMO-03", ip: "192.168.1.66", room: "Bedroom", batt: 41, rssi: -73, fw: "0.4.1", primary: false },
  { id: "MOMO-04", ip: "—", room: "Office", batt: 0, rssi: 0, fw: "0.4.1", primary: false, offline: true },
];

const Devices = () => {
  const { stage } = useStage();
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Edge Fleet</div>
        <h1 className="text-[32px] font-semibold tracking-tight leading-none mt-1">Devices</h1>
        <p className="text-sm text-muted-foreground mt-2">4 paired Node B devices · 3 online</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {devices.map((d) => {
          const active = d.primary && (stage === "listening" || stage === "streaming" || stage === "speaking");
          return (
            <NodeCard
              key={d.id}
              title={`Node B · ${d.id}`}
              subtitle={`${d.ip} · ${d.room} · fw ${d.fw}`}
              icon={<MonitorSmartphone size={16} />}
              badge={
                d.offline
                  ? { tone: "error", label: "Offline" }
                  : active
                  ? { tone: "active", label: "Active", pulse: true }
                  : { tone: "success", label: "Online", pulse: true }
              }
              active={active}
              glow={active ? "data" : null}
            >
              <div className="grid grid-cols-4 gap-3 text-[11px]">
                <Stat label="Battery" value={d.offline ? "—" : `${d.batt}%`} />
                <Stat label="RSSI" value={d.offline ? "—" : `${d.rssi} dBm`} />
                <Stat label="Sample" value={d.offline ? "—" : "16 kHz"} />
                <Stat label="Codec" value={d.offline ? "—" : "PCM16"} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Waveform active={active} bars={26} className="h-7" />
                <div className="flex items-center gap-1.5">
                  <Btn icon={<RotateCw size={12} />} label="Reconnect" />
                  <Btn icon={<MicOff size={12} />} label="Mute" />
                </div>
              </div>
            </NodeCard>
          );
        })}
      </div>

      <div className="rounded-2xl border border-hairline bg-surface-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Wifi size={14} className="text-muted-foreground" />
          <div className="text-sm font-medium">Network</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
          <Stat label="Gateway" value="192.168.1.1" mono />
          <Stat label="Brain (Node A)" value="192.168.1.10:7331" mono />
          <Stat label="Throughput" value="142 KB/s" mono />
          <Stat label="Avg latency" value="38 ms" mono />
        </div>
      </div>
    </div>
  );
};

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70">{label}</div>
      <div className={mono ? "font-mono text-foreground text-[12.5px]" : "text-foreground text-[12.5px]"}>{value}</div>
    </div>
  );
}
function Btn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="inline-flex items-center gap-1 h-7 px-2 rounded-md border border-hairline bg-surface-2 text-[11px] text-muted-foreground hover:text-foreground transition">
      {icon}{label}
    </button>
  );
}

export default Devices;
