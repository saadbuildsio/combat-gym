import Link from "next/link";

/** Small shared UI pieces. Keep styling here so every screen looks the same. */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:brightness-110",
  secondary: "bg-surface-2 text-foreground hover:bg-surface-3",
  ghost: "bg-transparent text-muted hover:text-foreground",
  danger: "bg-transparent text-danger border border-danger/50 hover:bg-danger/10",
};

const BASE =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 font-bold uppercase tracking-wide transition disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type="button" className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <section className={`rounded-2xl bg-surface p-5 ${className}`}>{children}</section>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-bold uppercase tracking-widest text-muted">{children}</h2>;
}

/** Horizontal bar for a 0-100 skill. A value of 0 reads as "not measured yet". */
export function StatBar({ label, value, locked = false }: { label: string; value: number; locked?: boolean }) {
  const measured = !locked && value > 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className={locked ? "text-muted" : "font-semibold"}>
          {locked ? "🔒 " : ""}
          {label}
        </span>
        <span className="tabular-nums text-muted">{locked ? "Camera" : measured ? value : "Not measured"}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2" role="presentation">
        {measured && <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />}
      </div>
    </div>
  );
}

export function ProgressBar({ value, max, className = "" }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      className={`h-2 overflow-hidden rounded-full bg-surface-2 ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Pill({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "accent" | "good" }) {
  const tones = { muted: "bg-surface-2 text-muted", accent: "bg-accent/15 text-accent", good: "bg-good/15 text-good" };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>;
}
