import { useEffect, useState } from "react";

export type SystemStage =
  | "boot"
  | "idle"
  | "listening"
  | "streaming"
  | "stt"
  | "intent"
  | "brain"
  | "orchestrator"
  | "execution"
  | "tts"
  | "speaking"
  | "return";

export interface TimelineMark {
  t: number; // seconds
  stage: SystemStage;
  label: string;
}

export const TIMELINE: TimelineMark[] = [
  { t: 0, stage: "boot", label: "Boot · initialize subsystems" },
  { t: 4, stage: "idle", label: "Dashboard idle · live metrics" },
  { t: 8, stage: "listening", label: "Node B · listening" },
  { t: 11, stage: "streaming", label: "Node B → Node A · streaming audio" },
  { t: 13, stage: "stt", label: "Whisper STT" },
  { t: 15, stage: "intent", label: "Intent model" },
  { t: 17, stage: "brain", label: "Brain model · reasoning" },
  { t: 19, stage: "orchestrator", label: "Orchestrator · routing" },
  { t: 20, stage: "execution", label: "Execution engine" },
  { t: 23, stage: "tts", label: "TTS · synthesizing response" },
  { t: 25, stage: "speaking", label: "Node B · OLED + speaker output" },
  { t: 30, stage: "return", label: "Return to dashboard" },
];

export const TOTAL = 35;

export function stageAt(time: number): SystemStage {
  let s: SystemStage = "boot";
  for (const m of TIMELINE) if (time >= m.t) s = m.stage;
  return s;
}

interface PlayerState {
  time: number;
  playing: boolean;
}

const listeners = new Set<(s: PlayerState) => void>();
const state: PlayerState = { time: 0, playing: false };

let raf = 0;
let last = 0;

function tick(now: number) {
  if (!state.playing) return;
  const dt = (now - last) / 1000;
  last = now;
  state.time = Math.min(TOTAL, state.time + dt);
  if (state.time >= TOTAL) state.playing = false;
  emit();
  if (state.playing) raf = requestAnimationFrame(tick);
}

function emit() {
  for (const l of listeners) l({ ...state });
}

export const player = {
  play() {
    if (state.time >= TOTAL) state.time = 0;
    state.playing = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
    emit();
  },
  pause() {
    state.playing = false;
    cancelAnimationFrame(raf);
    emit();
  },
  toggle() {
    state.playing ? player.pause() : player.play();
  },
  seek(t: number) {
    state.time = Math.max(0, Math.min(TOTAL, t));
    emit();
  },
  reset() {
    state.time = 0;
    state.playing = false;
    cancelAnimationFrame(raf);
    emit();
  },
};

export function usePlayer() {
  const [s, setS] = useState<PlayerState>(state);
  useEffect(() => {
    const l = (n: PlayerState) => setS(n);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return s;
}

export function useStage() {
  const { time } = usePlayer();
  return { time, stage: stageAt(time) };
}
