import { useStage, type SystemStage } from "@/lib/simulation";
import { LogStream, type LogEntry } from "./LogStream";
import { useMemo } from "react";

const T0 = new Date(2025, 0, 1, 12, 1, 22).getTime();
function ts(off: number) {
  const d = new Date(T0 + off * 1000);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

const SCRIPT: { stage: SystemStage; entries: LogEntry[] }[] = [
  { stage: "boot", entries: [
    { t: ts(0), source: "system", level: "info", message: "MOMO v0.4.2 boot sequence" },
    { t: ts(1), source: "Node B", level: "info", message: "ESP32 online · firmware 0.4.2" },
    { t: ts(2), source: "Node A", level: "info", message: "Brain runtime ready · llama-3.1-8b loaded" },
    { t: ts(3), source: "Security", level: "success", message: "JWT keypair verified · audit log opened" },
    { t: ts(4), source: "API", level: "info", message: "REST + WebSocket listening on :7331" },
  ]},
  { stage: "idle", entries: [
    { t: ts(5), source: "Node C", level: "success", message: "Dashboard connected · session#a31f" },
    { t: ts(6), source: "Monitor", level: "info", message: "metrics tick · cpu 18% · mem 1.2GB" },
  ]},
  { stage: "listening", entries: [
    { t: ts(8), source: "Node B", level: "data", message: "wake-word detected · arming mics" },
    { t: ts(9), source: "Node B", level: "data", message: "VAD active · noise floor -52dB" },
  ]},
  { stage: "streaming", entries: [
    { t: ts(11), source: "Node B", level: "data", message: "streaming pcm16 → Node A · 16kHz" },
    { t: ts(12), source: "Node A", level: "data", message: "audio chunk received · 480 samples" },
  ]},
  { stage: "stt", entries: [
    { t: ts(13), source: "STT", level: "ai", message: "whisper transcribing… (118ms)" },
    { t: ts(14), source: "STT", level: "ai", message: 'transcript: "open the project notes from yesterday"' },
  ]},
  { stage: "intent", entries: [
    { t: ts(15), source: "Intent", level: "ai", message: 'classified · open_document (conf 0.94)' },
  ]},
  { stage: "brain", entries: [
    { t: ts(17), source: "Brain", level: "ai", message: "reasoning · context window 142 tokens" },
    { t: ts(18), source: "Brain", level: "ai", message: "plan: query memory → fetch doc → summarize" },
  ]},
  { stage: "orchestrator", entries: [
    { t: ts(19), source: "Orchestrator", level: "ai", message: "routing → memory.query, fs.open, summarize" },
  ]},
  { stage: "execution", entries: [
    { t: ts(20), source: "Memory", level: "info", message: "match: notes/2025-01-14_project.md" },
    { t: ts(21), source: "Execution", level: "success", message: "document opened · 1.2KB · 312 tokens" },
    { t: ts(22), source: "Execution", level: "success", message: "summary generated · latency 1.4s" },
  ]},
  { stage: "tts", entries: [
    { t: ts(23), source: "TTS", level: "ai", message: "piper synthesizing · 24 chars/s" },
  ]},
  { stage: "speaking", entries: [
    { t: ts(25), source: "Node B", level: "data", message: "audio frames received · playback start" },
    { t: ts(26), source: "Node B", level: "info", message: "OLED: ♫ speaking" },
  ]},
  { stage: "return", entries: [
    { t: ts(30), source: "Node C", level: "success", message: "response delivered · session idle" },
    { t: ts(31), source: "Monitor", level: "info", message: "round-trip 14.2s · tokens/s 38.4" },
  ]},
];

const ORDER: SystemStage[] = ["boot","idle","listening","streaming","stt","intent","brain","orchestrator","execution","tts","speaking","return"];

export function useLiveLogs(): LogEntry[] {
  const { stage } = useStage();
  return useMemo(() => {
    const i = ORDER.indexOf(stage);
    return SCRIPT.filter((s) => ORDER.indexOf(s.stage) <= i).flatMap((s) => s.entries);
  }, [stage]);
}

export function LiveLogs({ className }: { className?: string }) {
  const entries = useLiveLogs();
  return <LogStream entries={entries} className={className} />;
}
