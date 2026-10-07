import { BOXING_LESSONS } from "@/content/boxing/lessons";
import { LessonClient } from "./lesson-client";

/** Pre-builds one page per lesson so the app can be hosted as plain static files. */
export function generateStaticParams() {
  return BOXING_LESSONS.map((l) => ({ id: l.id }));
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LessonClient id={id} />;
}
