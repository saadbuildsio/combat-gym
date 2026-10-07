import { BOXING_OPPONENTS } from "@/content/boxing/opponents";
import { FightClient } from "./fight-client";

/** Pre-builds one page per opponent so the app can be hosted as plain static files. */
export function generateStaticParams() {
  return BOXING_OPPONENTS.map((o) => ({ id: o.id }));
}

export default async function FightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FightClient id={id} />;
}
