import { MetricWidget } from "@/components/momo/MetricWidget";
import { useStage } from "@/lib/simulation";
import { useEffect, useState } from "react";

const Metrics = () => {
  const { time } = useStage();
  const [t, setT] = useState(0);
  useEffect(() => { const i = setInterval(() => setT(x => x + 1), 800); return () => clearInterval(i); }, []);

  const series = (base: number, amp: number, n = 60) =>
    Array.from({ length: n }, (_, i) => Math.max(0, base + Math.sin((t + i) * 0.25) * amp + Math.cos(i * 0.7) * amp * 0.3 + (Math.random()-0.5)*4));

  const lat = series(40, 22);
  const cpu = series(28, 14);
  const mem = series(55, 6);
  const tok = series(34, 10);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Performance</div>
        <h1 className="text-[32px] font-semibold tracking-tight leading-none mt-1">Metrics</h1>
        <p className="text-sm text-muted-foreground mt-2">Last 60 seconds · sampled every 1s</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricWidget label="Latency p50" value={Math.round(lat.at(-1)!)} unit="ms" accent="data" trend={-2.4} />
        <MetricWidget label="CPU avg" value={Math.round(cpu.at(-1)!)} unit="%" accent="default" trend={1.1} />
        <MetricWidget label="Memory" value={(1.2 + (time%5)*0.01).toFixed(2)} unit="GB" accent="default" trend={0.3} />
        <MetricWidget label="Tokens / sec" value={tok.at(-1)!.toFixed(1)} accent="ai" trend={4.2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Chart title="Latency (ms)" data={lat} color="hsl(var(--primary))" />
        <Chart title="CPU (%)" data={cpu} color="hsl(var(--accent))" />
        <Chart title="Memory (relative)" data={mem} color="hsl(var(--success))" />
        <Chart title="Tokens / sec" data={tok} color="hsl(var(--accent))" />
      </div>
    </div>
  );
};

function Chart({ title, data, color }: { title: string; data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const w = data.length - 1;
  const points = data.map((v, i) => `${i},${100 - (v / max) * 96}`).join(" ");
  const area = `0,100 ${points} ${w},100`;
  return (
    <div className="rounded-2xl border border-hairline bg-surface-1 p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-sm font-medium">{title}</div>
        <div className="font-mono text-[11px] text-muted-foreground">now {data.at(-1)!.toFixed(1)}</div>
      </div>
      <svg viewBox={`0 0 ${w} 100`} className="w-full h-40" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`g-${title}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25,50,75].map(y => <line key={y} x1="0" x2={w} y1={y} y2={y} stroke="hsl(var(--hairline))" strokeWidth="0.3" />)}
        <polygon points={area} fill={`url(#g-${title})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

export default Metrics;
