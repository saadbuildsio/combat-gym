import { getDemoVideo } from "@/content/boxing/videos";

/**
 * Shows the demo video for a lesson or drill.
 * Until a coach-approved clip exists, shows a clear "coming soon" placeholder instead of an unverified video.
 */
export function DemoVideo({ id, title }: { id: string; title: string }) {
  const video = getDemoVideo(id);

  if (!video) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-dashed border-surface-3 bg-surface-2 text-center">
        <span className="text-3xl" aria-hidden>
          🎬
        </span>
        <p className="mt-2 text-sm font-semibold">Demo video coming soon</p>
        <p className="text-xs text-muted">Follow the written steps below for now.</p>
      </div>
    );
  }

  return (
    <figure>
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
        {video.kind === "file" ? (
          <video
            className="h-full w-full object-contain"
            src={video.src}
            poster={video.poster}
            controls
            playsInline
            muted
            loop
            preload="metadata"
            aria-label={`Demo: ${title}`}
          />
        ) : (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.src)}?rel=0&modestbranding=1`}
            title={`Demo: ${title}`}
            loading="lazy"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      {video.credit && <figcaption className="mt-1 text-xs text-muted">Video: {video.credit}</figcaption>}
    </figure>
  );
}
