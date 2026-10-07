"use client";

import { useEffect, useRef } from "react";
import { getDemoVideo } from "@/content/boxing/videos";
import { useT } from "./language-provider";

/**
 * Shows the demo video for a lesson or drill.
 * With no video, shows a "coming soon" placeholder. Unreviewed YouTube placeholders carry a notice.
 * When `playing` is given, the video follows it (the round's Start and Pause also play and pause the video).
 */
export function DemoVideo({ id, title, playing, leads = false }: { id: string; title: string; playing?: boolean; leads?: boolean }) {
  const t = useT();
  const video = getDemoVideo(id);
  const fileRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (playing === undefined) return;
    if (fileRef.current) {
      if (playing) fileRef.current.play().catch(() => {});
      else fileRef.current.pause();
    }
    // YouTube's embed API takes play and pause commands by message. Some phones block remote play; the user can tap play.
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: playing ? "playVideo" : "pauseVideo", args: [] }),
      "https://www.youtube-nocookie.com",
    );
  }, [playing]);

  if (!video) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-dashed border-surface-3 bg-surface-2 text-center">
        <span className="text-3xl" aria-hidden>
          🎬
        </span>
        <p className="mt-2 text-sm font-semibold">{t("video.comingSoon")}</p>
        <p className="text-xs text-muted">{t("video.followSteps")}</p>
      </div>
    );
  }

  return (
    <figure>
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
        {video.kind === "file" ? (
          <video
            ref={fileRef}
            className="h-full w-full object-contain"
            src={video.src}
            poster={video.poster}
            controls
            playsInline
            muted
            loop
            preload="metadata"
            aria-label={t("video.demoLabel", { title })}
          />
        ) : (
          <iframe
            ref={frameRef}
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.src)}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1${video.skipTo ? `&start=${video.skipTo}` : ""}`}
            title={t("video.demoLabel", { title })}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      {video.kind === "youtube" && (
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => skipIntro(frameRef.current, video.skipTo ?? DEFAULT_INTRO_SECONDS)}
            className="shrink-0 rounded-full bg-surface-2 px-3 py-1.5 text-sm font-bold"
          >
            ⏩ {t("video.skipIntro")}
          </button>
          <p className="text-xs text-muted">{t("video.skipIntroHint")}</p>
        </div>
      )}
      <figcaption className="mt-1 text-xs text-muted">
        {video.credit && <>{t("video.credit", { credit: video.credit })} </>}
        {!video.coachReviewed && (leads ? t("video.notReviewedLeads") : t("video.notReviewed"))}
      </figcaption>
    </figure>
  );
}

/** Where "Skip intro" jumps when we have not timed a video's intro yet. */
const DEFAULT_INTRO_SECONDS = 30;

function skipIntro(frame: HTMLIFrameElement | null, seconds: number) {
  const send = (func: string, args: unknown[]) =>
    frame?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "https://www.youtube-nocookie.com");
  send("seekTo", [seconds, true]);
  send("playVideo", []);
}
