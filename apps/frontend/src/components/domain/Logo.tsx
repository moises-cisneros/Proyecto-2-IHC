import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
}

/** Planazo symbol: a calendar with a check, plus an amber spark. Decorative by default. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={cn("size-9 shrink-0", className)}
    >
      <rect width="64" height="64" rx="18" className="fill-primary" />
      <rect x="14" y="19" width="36" height="31" rx="8" className="fill-card" />
      <rect x="14" y="19" width="36" height="10" rx="5" className="fill-secondary" />
      <rect x="22" y="13" width="4.5" height="12" rx="2.25" className="fill-card" />
      <rect x="37.5" y="13" width="4.5" height="12" rx="2.25" className="fill-card" />
      <path
        d="M23 40.5l6 6 12-13"
        fill="none"
        className="stroke-primary"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="51" cy="14" r="7" className="fill-accent" />
      <path d="M51 9.5v9M46.5 14h9" className="stroke-card" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  tone?: "default" | "light";
}

export function Logo({ className, tone = "default" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cn(
          "font-display text-xl font-extrabold tracking-tight",
          tone === "light" ? "text-ink-foreground" : "text-foreground",
        )}
      >
        Planazo
      </span>
    </span>
  );
}
