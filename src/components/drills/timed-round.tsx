"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ProgressBar } from "@/components/ui";
import { scoreConditioning } from "@/domain/scoring";
import type { Drill } from "@/domain/types";
import { speak, stopSpeaking } from "@/lib/speech";
import type { DrillProps } from "./types";
import { DemoVideo } from "../demo-video";

interface TimedRoundProps extends DrillProps {
  drill: Drill;
  callouts: string[];
  /** Seconds between callouts. */
  calloutEvery: number;
  /** Pick callouts at random (shadow rounds) or in order (warm-up, cool-down). */
  randomOrder: boolean;
  /** Ask "how hard was that?" at the end and score conditioning. */
  scoreEffort: boolean;
}

/**
 * Follow-along round with a countdown and spoken callouts.
 * We cannot see the user, so this only tracks time completed (and effort if asked).
 */
export function TimedRound({ drill, callouts, calloutEvery, randomOrder, scoreEffort, onDone, onPain }: TimedRoundProps) {
  const total = drill.minutes * 60;
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [voice, setVoice] = useState(true);
  const [callout, setCallout] = useState<string>("Get in your stance");
  const [askingEffort, setAskingEffort] = useState(false);
  const calloutIndex = useRef(0);
  const voiceRef = useRef(voice);
  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  const finished = elapsed >= total;

  useEffect(() => {
    if (!running || finished) return;
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, [running, finished]);

  // New callout every `calloutEvery` seconds while running.
  useEffect(() => {
    if (!running || finished || elapsed % calloutEvery !== 0) return;
    const next = randomOrder
      ? callouts[Math.floor(Math.random() * callouts.length)]
      : callouts[calloutIndex.current++ % callouts.length];
    setCallout(next);
    if (voiceRef.current) speak(next);
  }, [elapsed, running, finished, calloutEvery, callouts, randomOrder]);

  useEffect(() => stopSpeaking, []);

  useEffect(() => {
    if (finished) {
      setRunning(false);
      if (voiceRef.current) speak("Time");
    }
  }, [finished]);

  const complete = (effort?: number) => {
    stopSpeaking();
    const completed = elapsed >= total * 0.8;
    onDone({
      drillId: drill.id,
      kind: drill.kind,
      completed,
      effort,
      // A round cut short is recorded but not scored, so skipping does not distort the Conditioning rating.
      scores: scoreEffort && completed ? { conditioning: scoreConditioning(elapsed, total, effort) } : {},
      stats: { secondsCompleted: elapsed, secondsPlanned: total },
    });
  };

  const end = () => {
    setRunning(false);
    if (scoreEffort) setAskingEffort(true);
    else complete();
  };

  const remaining = total - elapsed;
  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, "0");

  if (askingEffort || (finished && scoreEffort)) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-black">How hard was that round?</h2>
        <p className="mt-2 text-muted">Be honest. It helps us plan tomorrow.</p>
        <div className="mt-6 grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Button key={n} variant="secondary" onClick={() => complete(n)} aria-label={`Effort ${n} of 5`}>
              {n}
            </Button>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>Easy</span>
          <span>All out</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-sm text-muted">{drill.description}</p>
      {/* Show the demo before the round starts; hide it while training so the timer stays in view. */}
      {!running && elapsed === 0 && (
        <div className="mt-4">
          <DemoVideo id={drill.id} title={drill.title} />
        </div>
      )}
      <p className="mt-6 font-mono text-6xl font-black tabular-nums" aria-live="off">
        {mm}:{ss}
      </p>
      <ProgressBar value={elapsed} max={total} className="mt-4" />
      <p className="mt-8 min-h-16 text-3xl font-black text-accent" aria-live="polite">
        {running || finished ? callout : "Press start when you are ready"}
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {finished ? (
          <Button onClick={() => complete()}>Next</Button>
        ) : (
          <Button onClick={() => setRunning((r) => !r)}>{running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}</Button>
        )}
        {!finished && elapsed > 0 && (
          <Button variant="secondary" onClick={end}>
            Finish round
          </Button>
        )}
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setVoice((v) => !v)}>
            {voice ? "🔊 Voice on" : "🔇 Voice off"}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              stopSpeaking();
              onPain({ drillId: drill.id, kind: drill.kind, completed: false, scores: {}, reportedPain: true });
            }}
          >
            I feel pain
          </Button>
        </div>
      </div>
    </div>
  );
}
