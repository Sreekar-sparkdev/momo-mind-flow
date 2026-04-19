import { Search } from "lucide-react";

const memories = [
  { t: "Today · 12:01", tag: "voice", title: "Opened project notes", body: "Summary of 2025-01-14_project.md · 3 open threads" },
  { t: "Today · 09:42", tag: "task", title: "Scheduled standup reminder", body: "Daily 09:30 · room: Studio · device MOMO-01" },
  { t: "Yesterday · 18:14", tag: "doc", title: "Indexed notes/2025-01-14_project.md", body: "1.2 KB · 312 tokens · 6 entities" },
  { t: "Yesterday · 14:02", tag: "voice", title: "Asked: weather tomorrow", body: "Skill: weather.local · returned 14°C, light rain" },
  { t: "2 days ago", tag: "system", title: "Firmware MOMO-02 updated", body: "0.4.1 → 0.4.2 · success · 12.4s" },
  { t: "3 days ago", tag: "doc", title: "Indexed inbox/refactor-plan.md", body: "4.8 KB · 1,204 tokens · 22 entities" },
];

const tagColor: Record<string, string> = {
  voice: "bg-primary/15 text-primary border-primary/30",
  task: "bg-accent/15 text-accent border-accent/30",
  doc: "bg-success/15 text-success border-success/30",
  system: "bg-surface-2 text-muted-foreground border-hairline",
};

const Memory = () => (
  <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Context</div>
        <h1 className="text-[32px] font-semibold tracking-tight leading-none mt-1">Memory</h1>
        <p className="text-sm text-muted-foreground mt-2">Short-term context · long-term vector store · 1,284 entries</p>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-hairline bg-surface-1 px-3 h-10 w-full sm:w-72">
        <Search size={14} className="text-muted-foreground" />
        <input placeholder="search memory…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60" />
      </div>
    </div>

    <div className="rounded-2xl border border-hairline bg-surface-1">
      <ul className="divide-y divide-hairline">
        {memories.map((m, i) => (
          <li key={i} className="grid grid-cols-[120px_1fr_auto] gap-4 items-center px-5 py-4 hover:bg-surface-2/40 transition">
            <div className="font-mono text-[11px] text-muted-foreground">{m.t}</div>
            <div>
              <div className="text-sm font-medium">{m.title}</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">{m.body}</div>
            </div>
            <span className={`text-[10px] uppercase tracking-wider rounded-full border px-2 py-0.5 ${tagColor[m.tag]}`}>{m.tag}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="grid grid-cols-3 gap-3">
      {[
        ["Short-term", "142 / 4096", "tokens"],
        ["Long-term", "1,284", "entries"],
        ["Vector dim", "768", "all-MiniLM"],
      ].map(([l,v,h]) => (
        <div key={l} className="rounded-xl border border-hairline bg-surface-1 p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{l}</div>
          <div className="text-2xl font-semibold tabular-nums mt-1">{v}</div>
          <div className="text-[11px] font-mono text-muted-foreground">{h}</div>
        </div>
      ))}
    </div>
  </div>
);
export default Memory;
