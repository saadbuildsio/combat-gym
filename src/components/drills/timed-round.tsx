"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ProgressBar } from "@/components/ui";
import { scoreConditioning } from "@/domain/scoring";
import type { Drill } from "@/domain/types";
import { speak, stopSpeaking } from "@/lib/speech";
import type { DrillProps } from "./types";
import { getDemoVideo } from "@/content/boxing/videos";
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
  /**
   * Warm-up and cool-down: when a demo video exists, the video leads. It stays on screen, plays with the timer,
   * and our own step callouts are switched off so the app never says one exercise while the video shows another.
   */
  followVideo?: boolean;
}

/**
 * Follow-along round with a countdown and spoken callouts.
 * We cannot see the user, so this only tracks time completed (and effort if asked).
 */
export function TimedRound({ drill, callouts, calloutEvery, randomOrder, scoreEffort, followVideo = false, onDone, onPain }: TimedRoundProps) {
  const hasVideo = getDemoVideo(drill.id) !== undefined;
  const videoLeads = followVideo && hasVideo;
  const total = drill.minutes * 60;
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [voice, setVoice] = useState(true);
  const [callout, setCallout] = useState<string>("Get in your stance");
  const [askingEffort, setAskingEffort] = useState(false);
  const [showExample, setShowExample] = useState(true);
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
    if (videoLeads || !running || finished || elapsed % calloutEvery !== 0) return;
    const next = randomOrder
      ? callouts[Math.floor(Math.random() * callouts.length)]
      : callouts[calloutIndex.current++ % callouts.length];
    setCallout(next);
    if (voiceRef.current) speak(next);
  }, [elapsed, running, finished, calloutEvery, callouts, randomOrder, videoLeads]);

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
      {/* The video stays mounted for the whole round, so starting the timer never makes it disappear. */}
      {videoLeads ? (
        <div className="mt-4">
          {/* At "Time" the video keeps playing; the user may finish it before tapping Next. */}
          <DemoVideo id={drill.id} title={drill.title} playing={running || finished} leads />
          <p className="mt-1 text-xs text-muted">Start and Pause also control the video. If it does not start, tap play on the video.</p>
        </div>
      ) : (
        hasVideo && (
          <div className="mt-4">
            <div className={showExample ? "" : "hidden"}>
              <DemoVideo id={drill.id} title={drill.title} playing={showExample ? undefined : false} />
              <p className="mt-1 text-xs font-semibold">Example only. In this round, follow the app&apos;s callouts.</p>
            </div>
            <Button variant="ghost" onClick={() => setShowExample((v) => !v)}>
              {showExample ? "Hide example video" : "Show example video"}
            </Button>
          </div>
        )
      )}
      <p className="mt-6 font-mono text-6xl font-black tabular-nums" aria-live="off">
        {mm}:{ss}
      </p>
      <ProgressBar value={elapsed} max={total} className="mt-4" />
      <p className="mt-8 min-h-16 text-3xl font-black text-accent" aria-live="polite">
        {videoLeads
          ? finished
            ? "Time. Finish the video if you like, then tap Next."
            : "Follow the video"
          : running || finished
            ? callout
            : "Press start when you are ready"}
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {finished ? (
          <Button onClick={() => complete()}>Next</Button>
        ) : (
          <Button
            onClick={() => {
              if (!running && elapsed === 0 && !videoLeads) setShowExample(false);
              setRunning((r) => !r);
            }}
          >{running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}</Button>
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
