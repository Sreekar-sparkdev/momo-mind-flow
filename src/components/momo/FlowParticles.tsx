import { useStage, usePlayer } from "@/lib/simulation";

/**
 * Animated SVG particle bus running between Node B ↔ A ↔ C.
 * Particles travel along straight horizontal paths; direction & color
 * are derived from the current simulation stage.
 */
export function FlowParticles() {
  const { stage } = useStage();
  const { time } = usePlayer();

  // Lane geometry (% of container) — must match NodeCard column positions
  const B_RIGHT = 24;   // right edge of Node B
  const A_LEFT = 40;    // left edge of Node A
  const A_RIGHT = 60;   // right edge of Node A
  const C_LEFT = 76;    // left edge of Node C

  // Stage → flow descriptors
  const flows: { from: number; to: number; y: number; color: string; speed: number; count: number }[] = [];

  // B → A audio uplink
  if (stage === "streaming" || stage === "stt") {
    flows.push({ from: B_RIGHT, to: A_LEFT, y: 48, color: "hsl(var(--primary))", speed: 1.2, count: 6 });
  }
  // Internal AI pipeline shimmer (subtle particles inside Node A region)
  if (stage === "stt" || stage === "intent" || stage === "brain" || stage === "orchestrator" || stage === "execution") {
    flows.push({ from: A_LEFT + 2, to: A_RIGHT - 2, y: 52, color: "hsl(var(--accent))", speed: 0.7, count: 4 });
  }
  // A → C status push (always when system is alive)
  if (stage !== "boot") {
    flows.push({ from: A_RIGHT, to: C_LEFT, y: 48, color: "hsl(var(--success))", speed: 0.8, count: 3 });
  }
  // C → A control commands
  if (stage === "idle" || stage === "return" || stage === "listening") {
    flows.push({ from: C_LEFT, to: A_RIGHT, y: 56, color: "hsl(var(--success))", speed: 0.6, count: 2 });
  }
  // A → B response (TTS audio downlink)
  if (stage === "tts" || stage === "speaking") {
    flows.push({ from: A_LEFT, to: B_RIGHT, y: 56, color: "hsl(var(--accent))", speed: 1.4, count: 7 });
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      {/* Static rails (always faintly visible) */}
      <Rail x1={B_RIGHT} x2={A_LEFT} y={48} />
      <Rail x1={A_LEFT} x2={B_RIGHT} y={56} />
      <Rail x1={A_RIGHT} x2={C_LEFT} y={48} />
      <Rail x1={C_LEFT} x2={A_RIGHT} y={56} />

      {flows.map((f, i) => (
        <FlowLane key={`${stage}-${i}`} time={time} {...f} />
      ))}
    </svg>
  );
}

function Rail({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <line
      x1={`${x1}%`} x2={`${x2}%`} y1={`${y}%`} y2={`${y}%`}
      stroke="hsl(var(--hairline))"
      strokeWidth="1"
      strokeDasharray="2 4"
    />
  );
}

function FlowLane({
  from, to, y, color, speed, count, time,
}: { from: number; to: number; y: number; color: string; speed: number; count: number; time: number }) {
  const reverse = to < from;
  const a = Math.min(from, to);
  const b = Math.max(from, to);
  const span = b - a;

  return (
    <g>
      {/* Bright rail */}
      <line
        x1={`${from}%`} x2={`${to}%`} y1={`${y}%`} y2={`${y}%`}
        stroke={color}
        strokeWidth="1.2"
        opacity="0.45"
      />
      {/* Particles — phase-shifted dots traveling along the rail */}
      {Array.from({ length: count }).map((_, i) => {
        // 0..1 progress for this particle, looping
        const phase = ((time * speed + i / count) % 1);
        const p = reverse ? 1 - phase : phase;
        const x = a + p * span;
        // Trailing tail using a tiny line behind the dot
        const tailLen = 2.4;
        const tailX = reverse ? Math.min(b, x + tailLen) : Math.max(a, x - tailLen);
        return (
          <g key={i}>
            <line
              x1={`${tailX}%`} x2={`${x}%`} y1={`${y}%`} y2={`${y}%`}
              stroke={color}
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.55"
            />
            <circle cx={`${x}%`} cy={`${y}%`} r="2.4" fill={color}>
              <animate attributeName="r" values="2.4;3.2;2.4" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
    </g>
  );
}
