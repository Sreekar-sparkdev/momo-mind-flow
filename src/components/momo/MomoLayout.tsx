import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Activity, MessageSquare, MonitorSmartphone, Database, BarChart3, Shield, Settings, Network } from "lucide-react";
import { useStage } from "@/lib/simulation";
import { CinematicTimeline } from "./CinematicTimeline";

const tabs = [
  { to: "/", label: "Dashboard", icon: Activity, end: true },
  { to: "/architecture", label: "Architecture", icon: Network },
  { to: "/command", label: "Command", icon: MessageSquare },
  { to: "/devices", label: "Devices", icon: MonitorSmartphone },
  { to: "/memory", label: "Memory", icon: Database },
  { to: "/metrics", label: "Metrics", icon: BarChart3 },
  { to: "/security", label: "Security", icon: Shield },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function MomoLayout() {
  const { stage } = useStage();
  const live = stage !== "boot";
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-6 h-14">
            <div className="flex items-center gap-2.5">
              <div className="relative h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-[11px] font-bold text-background">M</span>
                <span className="absolute -inset-px rounded-lg ring-1 ring-primary/30" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">Momodash</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">MOMO · v0.4.2</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-0.5 ml-2 overflow-x-auto">
              {tabs.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.end}
                  className={({ isActive }) =>
                    cn(
                      "relative flex items-center gap-1.5 px-3 h-9 rounded-md text-[13px] transition-colors whitespace-nowrap",
                      isActive ? "text-foreground bg-surface-2" : "text-muted-foreground hover:text-foreground hover:bg-surface-1"
                    )
                  }
                >
                  <t.icon size={13} />
                  {t.label}
                </NavLink>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                <span className={cn("h-1.5 w-1.5 rounded-full", live ? "bg-success animate-pulse" : "bg-muted-foreground/40")} />
                {live ? "system online" : "offline"}
              </div>
              <div className="hidden sm:block text-[11px] font-mono text-muted-foreground">{ipNow()}</div>
            </div>
          </div>

          {/* Mobile tabs */}
          <nav className="md:hidden flex items-center gap-0.5 pb-2 overflow-x-auto -mx-2 px-2">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1.5 px-2.5 h-8 rounded-md text-[12px] whitespace-nowrap",
                    isActive ? "text-foreground bg-surface-2" : "text-muted-foreground"
                  )
                }
              >
                <t.icon size={12} />
                {t.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-6 lg:py-8">
        <Outlet />
      </main>

      {/* Persistent timeline scrubber */}
      <footer className="sticky bottom-0 z-40 border-t border-hairline bg-background/85 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-3">
          <CinematicTimeline />
        </div>
      </footer>
    </div>
  );
}

function ipNow() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
}
