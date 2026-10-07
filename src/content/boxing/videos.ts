import type { DemoVideo } from "@/domain/types";

/**
 * Demo videos by lesson or drill id.
 * To add a clip: put the file in public/videos/ and add a line here, for example
 *   "boxing-jab": { kind: "file", src: "/videos/jab.mp4", poster: "/videos/jab.jpg", credit: "Coach name", coachReviewed: true },
 * or for YouTube:
 *   "boxing-jab": { kind: "youtube", src: "VIDEO_ID", credit: "Channel name", coachReviewed: true },
 * The shot list for every clip is in docs/video-shot-list.md.
 */
export const DEMO_VIDEOS: Record<string, DemoVideo> = {};

/** Returns a video only if it exists and a coach has approved it. */
export function getDemoVideo(id: string): DemoVideo | undefined {
  const video = DEMO_VIDEOS[id];
  return video?.coachReviewed ? video : undefined;
}
