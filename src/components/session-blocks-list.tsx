import type { SessionBlock } from "@/domain/types";

const BLOCK_ICONS: Record<SessionBlock["type"], string> = {
  warmup: "🔥",
  learn: "📘",
  practice: "🥊",
  test: "⚡",
  challenge: "🎯",
  cooldown: "🧘",
};

export function SessionBlocksList({ blocks, activeIndex }: { blocks: SessionBlock[]; activeIndex?: number }) {
  return (
    <ol className="space-y-2">
      {blocks.map((block, i) => (
        <li
          key={`${block.type}-${i}`}
          className={`flex items-center justify-between rounded-xl px-4 py-3 ${i === activeIndex ? "bg-accent/15" : "bg-surface-2"}`}
        >
          <span className="flex items-center gap-3">
            <span aria-hidden>{BLOCK_ICONS[block.type]}</span>
            <span className="font-semibold">{block.title}</span>
          </span>
          <span className="whitespace-nowrap text-sm tabular-nums text-muted">{block.minutes} min</span>
        </li>
      ))}
    </ol>
  );
}
