import { StatusBadge } from "@/components/momo/StatusBadge";
import { LogStream, type LogEntry } from "@/components/momo/LogStream";
import { Shield, KeyRound } from "lucide-react";

const sessions = [
  { id: "session#a31f", user: "owner@local", device: "Momodash · Chrome", ip: "192.168.1.20", since: "12:01:24", active: true },
  { id: "session#9c02", user: "owner@local", device: "iPad Safari", ip: "192.168.1.33", since: "08:42:11", active: false },
  { id: "session#7b81", user: "guest@local", device: "Momodash · Firefox", ip: "192.168.1.24", since: "Yesterday", active: false },
];

const audit: LogEntry[] = [
  { t: "12:01:22", source: "auth", level: "success", message: "owner@local · jwt issued · session#a31f" },
  { t: "11:58:04", source: "auth", level: "info", message: "key rotation scheduled (24h)" },
  { t: "10:14:09", source: "policy", level: "info", message: "rule updated: external network egress = deny" },
  { t: "08:42:11", source: "auth", level: "success", message: "owner@local · jwt issued · session#9c02" },
  { t: "07:30:00", source: "audit", level: "info", message: "daily integrity scan ok · 0 anomalies" },
  { t: "Yesterday", source: "auth", level: "error", message: "guest@local · failed login (3) · throttled 5m" },
];

const Security = () => (
  <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Trust</div>
        <h1 className="text-[32px] font-semibold tracking-tight leading-none mt-1">Security</h1>
        <p className="text-sm text-muted-foreground mt-2">JWT auth · audit log · local-first network policy</p>
      </div>
      <StatusBadge tone="success" pulse>Secure · 0 anomalies</StatusBadge>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Stat icon={<Shield size={14} />} label="Encryption" value="TLS 1.3 · AES-256-GCM" />
      <Stat icon={<KeyRound size={14} />} label="Key rotation" value="every 24h · next 11h 58m" />
      <Stat icon={<Shield size={14} />} label="Network egress" value="deny by default · 2 allowed" />
    </div>

    <div className="rounded-2xl border border-hairline bg-surface-1">
      <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
        <div className="text-sm font-medium">Active sessions</div>
        <div className="text-[11px] font-mono text-muted-foreground">{sessions.filter(s=>s.active).length} active · {sessions.length} total</div>
      </div>
      <div className="divide-y divide-hairline">
        {sessions.map((s) => (
          <div key={s.id} className="grid grid-cols-[1fr_1fr_140px_120px_auto] gap-3 items-center px-5 py-3 text-[13px]">
            <div className="font-mono text-[12px]">{s.id}</div>
            <div>{s.user}<div className="text-[11px] text-muted-foreground">{s.device}</div></div>
            <div className="font-mono text-[12px] text-muted-foreground">{s.ip}</div>
            <div className="font-mono text-[12px] text-muted-foreground">{s.since}</div>
            <StatusBadge tone={s.active ? "success" : "muted"} pulse={s.active}>{s.active ? "Active" : "Idle"}</StatusBadge>
          </div>
        ))}
      </div>
    </div>

    <div className="rounded-2xl border border-hairline bg-surface-1 p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Audit log</div>
      <LogStream entries={audit} className="max-h-[260px]" />
    </div>
  </div>
);

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-4">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="text-muted-foreground">{icon}</span>{label}
      </div>
      <div className="text-[14px] font-medium mt-1.5">{value}</div>
    </div>
  );
}

export default Security;
