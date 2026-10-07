"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ProgressBar } from "@/components/ui";
import { calloutName, movesForCallout } from "@/content/boxing/moves";
import { getDemoVideo } from "@/content/boxing/videos";
import { localizeDrill, localizePhrase } from "@/content/localize";
import { scoreConditioning } from "@/domain/scoring";
import type { Drill } from "@/domain/types";
import { translate } from "@/i18n/translate";
import { speak, stopSpeaking } from "@/lib/speech";
import { DemoVideo } from "../demo-video";
import { useLanguage } from "../language-provider";
import { MoveAnimation } from "../move-animation";
import type { DrillProps } from "./types";

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
 * Shadow rounds show our animated fighter throwing each called move, so the picture always matches the callout.
 * We cannot see the user, so this only tracks time completed (and effort if asked).
 */
export function TimedRound({ drill, callouts, calloutEvery, randomOrder, scoreEffort, followVideo = false, onDone, onPain }: TimedRoundProps) {
  const { language, t } = useLanguage();
  const languageRef = useRef(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);
  /** Callouts stay English internally (they pick the animation); this is how one reads and sounds to the player. */
  const shown = (callout: string) => localizePhrase(calloutName(callout), language);
  const text = localizeDrill(drill, language);
  const hasVideo = getDemoVideo(drill.id) !== undefined;
  const videoLeads = followVideo && hasVideo;
  const total = drill.minutes * 60;
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [voice, setVoice] = useState(true);
  const [callout, setCallout] = useState<string>("");
  const [calloutCount, setCalloutCount] = useState(0);
  const [askingEffort, setAskingEffort] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const calloutIndex = useRef(0);
  /** Second of the round when the next callout is due. Skip and repeat move it. */
  const nextCalloutAt = useRef(0);
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

  const say = (text: string) => {
    if (voiceRef.current) speak(localizePhrase(calloutName(text), languageRef.current), languageRef.current);
  };

  const nextCallout = (at: number) => {
    const next = randomOrder
      ? callouts[Math.floor(Math.random() * callouts.length)]
      : callouts[calloutIndex.current++ % callouts.length];
    setCallout(next);
    setCalloutCount((c) => c + 1);
    nextCalloutAt.current = at + calloutEvery;
    say(next);
  };

  // A new callout every `calloutEvery` seconds while running.
  useEffect(() => {
    if (videoLeads || !running || finished || elapsed < nextCalloutAt.current) return;
    nextCallout(elapsed);
    // nextCallout only reads refs and props that are stable during a round.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, running, finished, videoLeads]);

  useEffect(() => stopSpeaking, []);

  useEffect(() => {
    if (finished) {
      setRunning(false);
      if (voiceRef.current) speak(translate(languageRef.current, "round.time"), languageRef.current);
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

  const pain = () => {
    stopSpeaking();
    onPain({ drillId: drill.id, kind: drill.kind, completed: false, scores: {}, reportedPain: true });
  };

  const remaining = total - elapsed;
  const clock = formatClock(remaining);

  if (askingEffort || (finished && scoreEffort)) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-black">{t("round.howHard")}</h2>
        <p className="mt-2 text-muted">{t("round.beHonest")}</p>
        <div className="mt-6 grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Button key={n} variant="secondary" onClick={() => complete(n)} aria-label={t("round.effortLabel", { n })}>
              {n}
            </Button>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{t("round.easy")}</span>
          <span>{t("round.allOut")}</span>
        </div>
      </div>
    );
  }

  if (videoLeads) {
    return (
      <div className="text-center">
        <p className="text-sm text-muted">{text.description}</p>
        {/* The video stays mounted for the whole round, so starting the timer never makes it disappear. */}
        <div className="mt-4">
          {/* At "Time" the video keeps playing; the user may finish it before tapping Next. */}
          <DemoVideo id={drill.id} title={text.title} playing={running || finished} leads />
          <p className="mt-1 text-xs text-muted">{t("round.videoControls")}</p>
        </div>
        <p className="mt-6 font-mono text-6xl font-black tabular-nums" aria-live="off">
          {clock}
        </p>
        <ProgressBar value={elapsed} max={total} className="mt-4" />
        <p className="mt-8 min-h-16 text-3xl font-black text-accent" aria-live="polite">
          {finished ? t("round.timeFinishVideo") : t("round.followVideo")}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {finished ? (
            <Button onClick={() => complete()}>{t("common.next")}</Button>
          ) : (
            <Button onClick={() => setRunning((r) => !r)}>{running ? t("round.pause") : elapsed > 0 ? t("round.resume") : t("common.start")}</Button>
          )}
          {!finished && elapsed > 0 && (
            <Button variant="secondary" onClick={end}>
              {t("round.finishRound")}
            </Button>
          )}
          <div className="flex justify-between gap-2">
            <Button variant="ghost" className="whitespace-nowrap px-3!" onClick={() => setVoice((v) => !v)}>
              {voice ? t("round.voiceOn") : t("round.voiceOff")}
            </Button>
            <Button variant="danger" className="whitespace-nowrap px-3!" onClick={pain}>
              {t("round.pain")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Round screen: callout on top, the move animated under it, then counters, ring timer and controls.
  const started = running || elapsed > 0;
  const called = started && callout !== "";
  const moves = called ? movesForCallout(callout) : (["guard"] as const);
  const title = finished ? t("round.time") : called ? shown(callout) : t("round.getInStance");

  return (
    <div>
      <h2 className="flex min-h-12 items-center gap-3 border-l-4 border-accent pl-3 text-3xl font-black leading-tight" aria-live="polite">
        {title}
      </h2>

      <div className="mt-3">
        {moves.length > 0 ? (
          <MoveAnimation moves={[...moves]} playKey={calloutCount} />
        ) : (
          <p className="rounded-2xl bg-surface-2 p-6 text-center text-muted">{text.description}</p>
        )}
      </div>

      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-muted">{t("round.callouts")}</p>
          <p className="mt-1 inline-block rounded-full border border-surface-3 px-3 font-mono text-sm font-bold">{calloutCount}</p>
          <button
            type="button"
            className="mt-2 block w-full text-xl"
            onClick={() => setVoice((v) => !v)}
            aria-label={voice ? t("round.turnVoiceOff") : t("round.turnVoiceOn")}
          >
            {voice ? "🔊" : "🔇"}
          </button>
        </div>
        <RingTimer label={t("round.timeLeft", { clock })} clock={clock} planned={formatClock(total)} value={elapsed} max={total} />
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-muted">{t("round.every")}</p>
          <p className="mt-1 inline-block rounded-full border border-surface-3 px-3 font-mono text-sm font-bold">{t("round.seconds", { seconds: calloutEvery })}</p>
          {hasVideo && (
            <button type="button" className="mt-2 block w-full text-xl" onClick={() => setShowExample((v) => !v)} aria-label={t("round.showExample")}>
              🎬
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-6">
        <RoundButton
          label={t("round.repeatCallout")}
          disabled={!running}
          onClick={() => {
            nextCalloutAt.current = elapsed + calloutEvery;
            setCalloutCount((c) => c + 1);
            say(callout);
          }}
        >
          ⟲
        </RoundButton>
        {finished ? (
          <Button onClick={() => complete()}>{t("common.next")}</Button>
        ) : (
          <RoundButton big label={running ? t("round.pause") : elapsed > 0 ? t("round.resume") : t("common.start")} onClick={() => setRunning((r) => !r)}>
            {running ? "❚❚" : "▶"}
          </RoundButton>
        )}
        <RoundButton label={t("round.nextCallout")} disabled={!running} onClick={() => nextCallout(elapsed)}>
          ⏭
        </RoundButton>
      </div>
      <p className="mt-2 text-center text-xs text-muted">{started ? "" : t("round.pressPlay")}</p>

      {hasVideo && (
        // Kept mounted when hidden, so it does not restart; paused whenever it is hidden.
        <div className={showExample ? "mt-4" : "hidden"}>
          <DemoVideo id={drill.id} title={text.title} playing={showExample ? undefined : false} />
          <p className="mt-1 text-xs font-semibold">{t("round.exampleOnly")}</p>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        {!finished && elapsed > 0 ? (
          <Button variant="secondary" onClick={end}>
            {t("round.finishRound")}
          </Button>
        ) : (
          <span />
        )}
        <Button variant="danger" className="whitespace-nowrap px-3!" onClick={pain}>
          {t("round.pain")}
        </Button>
      </div>
    </div>
  );
}

function formatClock(seconds: number): string {
  const s = Math.max(0, seconds);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function RingTimer({ label, clock, planned, value, max }: { label: string; clock: string; planned: string; value: number; max: number }) {
  const r = 70;
  const circumference = 2 * Math.PI * r;
  const left = max > 0 ? 1 - Math.min(1, value / max) : 0;
  return (
    <div className="relative size-36" role="timer" aria-label={label}>
      <svg viewBox="0 0 160 160" className="size-full -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="8" />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - left)}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-black tabular-nums">{clock}</span>
        <span className="mt-1 h-0.5 w-10 bg-accent" />
        <span className="mt-1 font-mono text-sm text-muted">{planned}</span>
      </div>
    </div>
  );
}

function RoundButton({
  children,
  label,
  big = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  big?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center rounded-full font-black transition disabled:opacity-30 ${
        big ? "size-20 bg-accent text-2xl text-white" : "size-14 bg-surface-2 text-xl"
      }`}
    >
      {children}
    </button>
  );
}
