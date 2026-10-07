"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "./language-provider";
import { GUARD_POSE, getMove, type MoveId, type MoveTrail } from "@/content/boxing/moves";
import { localizeMove } from "@/content/localize";
import { poseAt, timelineLength, type Keyframe, type Point, type Pose } from "@/domain/pose";

/** Pause in guard between repeats of the whole move or combo. */
const LOOP_PAUSE_MS = 700;

const BODY = "#d5dbe3";
const BODY_REAR = "#7f8a99";
const GLOVE = "#ff4d2e";
const GLOVE_REAR = "#b5361f";

/**
 * Our own animated fighter hitting a bag. Plays a move or a whole combo in order, then loops.
 * The names of the moves sit under the animation, and the one being thrown is highlighted.
 */
export function MoveAnimation({
  moves,
  playKey = 0,
  slow = false,
  showCue = true,
  className = "",
}: {
  moves: MoveId[];
  /** Change this to restart the animation from the start, for example when a new combo is called. */
  playKey?: number | string;
  /** Half speed, for learning. */
  slow?: boolean;
  showCue?: boolean;
  className?: string;
}) {
  const movesKey = moves.join("|");
  const timeline = useMemo(() => {
    const frames: Keyframe[] = [];
    const moveOfFrame: number[] = [];
    movesKey
      .split("|")
      .filter(Boolean)
      .forEach((id, i) => {
        for (const f of getMove(id as MoveId).frames) {
          frames.push(f);
          moveOfFrame.push(i);
        }
      });
    frames.push({ pose: GUARD_POSE, ms: LOOP_PAUSE_MS });
    moveOfFrame.push(-1);
    return { frames, moveOfFrame, length: timelineLength(frames) };
  }, [movesKey]);

  const [state, setState] = useState<{ pose: Pose; active: number }>({ pose: GUARD_POSE, active: 0 });

  useEffect(() => {
    if (timeline.frames.length <= 1) return;
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // No motion: show the hit position of the first move and keep it still.
      setState({ pose: timeline.frames[0].pose, active: 0 });
      return;
    }
    const speed = slow ? 0.5 : 1;
    let frameId = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const elapsed = ((now - startedAt) * speed) % timeline.length;
      const { pose, frameIndex } = poseAt(GUARD_POSE, timeline.frames, elapsed);
      setState({ pose, active: timeline.moveOfFrame[frameIndex] });
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [timeline, slow, playKey]);

  const { language } = useLanguage();
  const moveText = (id: MoveId) => localizeMove(getMove(id), language);
  const ids = movesKey.split("|").filter(Boolean) as MoveId[];
  if (ids.length === 0) return null;
  const currentMove = getMove(ids[Math.max(0, state.active)]);
  const current = moveText(currentMove.id);
  const names = ids.map((id) => moveText(id).name).join(", ");

  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-2 to-surface">
        <svg viewBox="0 0 300 220" className="block w-full" role="img" aria-label={`Animation: ${names}`}>
          <Floor />
          <Bag swing={state.pose.bagSwing} />
          <Trail trail={state.active >= 0 ? current.trail : "none"} />
          <Fighter pose={state.pose} />
        </svg>
        {current.arrow && state.active >= 0 && (
          <span aria-hidden className="absolute left-3 top-2 text-4xl font-black text-accent">
            {current.arrow}
          </span>
        )}
      </div>
      {ids.length > 1 && (
        <ol className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Moves in this combo">
          {ids.map((id, i) => (
            <li
              key={`${id}-${i}`}
              className={`rounded-full px-3 py-1 text-sm font-bold transition ${
                i === state.active ? "bg-accent text-white" : "bg-surface-2 text-muted"
              }`}
            >
              {moveText(id).name}
            </li>
          ))}
        </ol>
      )}
      {showCue && (
        <figcaption className="mt-2 text-center text-sm text-muted">
          <span className="font-semibold text-foreground">{current.name}:</span> {current.cue}
        </figcaption>
      )}
    </figure>
  );
}

function Floor() {
  return (
    <g>
      <ellipse cx="112" cy="202" rx="62" ry="6" fill="#000" opacity="0.35" />
      <line x1="0" y1="202" x2="300" y2="202" stroke="#29303b" strokeWidth="2" />
    </g>
  );
}

function Bag({ swing }: { swing: number }) {
  // Pivots at the ceiling; a hit pushes the bottom away from the fighter.
  return (
    <g transform={`rotate(${-swing} 232 0)`}>
      <line x1="232" y1="0" x2="232" y2="22" stroke="#8f99a8" strokeWidth="2" strokeDasharray="3 2" />
      <rect x="210" y="22" width="44" height="132" rx="14" fill="#2b2f36" />
      <rect x="210" y="52" width="44" height="16" fill="#8d2a1b" />
      <rect x="216" y="26" width="6" height="124" rx="3" fill="#ffffff" opacity="0.06" />
    </g>
  );
}

const TRAILS: Record<Exclude<MoveTrail, "none">, string> = {
  "straight-lead": "M146 60 L196 60",
  "straight-rear": "M136 54 L198 57",
  "hook-lead": "M146 62 Q176 30 196 62",
  "hook-rear": "M136 58 Q170 26 194 62",
  "upper-lead": "M150 104 Q186 100 196 64",
  "upper-rear": "M146 108 Q190 104 198 62",
  "body-lead": "M148 90 L194 104",
  "body-rear": "M142 84 L196 102",
  "body-hook": "M150 104 Q174 78 190 108",
  // Defense: the opponent's punch coming at the fighter, drawn in grey so it does not look like our own punch.
  "incoming-straight": "M206 46 L140 46",
  "incoming-hook": "M206 64 Q160 8 108 42",
};

const INCOMING = "#9aa5b4";

function Trail({ trail }: { trail: MoveTrail }) {
  if (trail === "none") return null;
  const incoming = trail.startsWith("incoming");
  return (
    <path
      d={TRAILS[trail]}
      fill="none"
      stroke={incoming ? INCOMING : GLOVE}
      strokeWidth="3"
      strokeDasharray="5 5"
      strokeLinecap="round"
      opacity={incoming ? 0.6 : 0.45}
    />
  );
}

function Limb({ points, color, width }: { points: Point[]; color: string; width: number }) {
  return (
    <polyline
      points={points.map((p) => `${p.x},${p.y}`).join(" ")}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Fighter({ pose }: { pose: Pose }) {
  const j = pose.joints;
  // Sideways steps change the size around the feet, as if the fighter moves towards or away from you.
  const transform = `translate(${pose.shiftX} 0) translate(110 200) scale(${pose.scale}) translate(-110 -200)`;
  return (
    <g transform={transform}>
      {/* Far side first, so the near arm and leg draw on top. */}
      <Limb points={[j.hip, j.rearKnee, j.rearFoot]} color={BODY_REAR} width={11} />
      <Limb points={[j.rearShoulder, j.rearElbow, j.rearFist]} color={BODY_REAR} width={8} />
      <circle cx={j.rearFist.x} cy={j.rearFist.y} r="8" fill={GLOVE_REAR} />
      <Limb points={[j.neck, j.hip]} color={BODY} width={20} />
      <Limb points={[{ x: j.hip.x - 2, y: j.hip.y - 6 }, { x: j.hip.x + 2, y: j.hip.y + 8 }]} color="#1d2430" width={24} />
      <circle cx={j.head.x} cy={j.head.y} r="12" fill={BODY} />
      <Limb points={[j.hip, j.leadKnee, j.leadFoot]} color={BODY} width={11} />
      <Limb points={[j.leadShoulder, j.leadElbow, j.leadFist]} color={BODY} width={8} />
      <circle cx={j.leadFist.x} cy={j.leadFist.y} r="8.5" fill={GLOVE} />
    </g>
  );
}
